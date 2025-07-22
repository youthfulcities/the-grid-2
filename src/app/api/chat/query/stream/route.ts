/* eslint no-restricted-syntax: 0 */

import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from '@aws-sdk/client-bedrock-agent-runtime';
import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
import { XMLParser } from 'fast-xml-parser';
import { NextResponse } from 'next/server';

const credentials = await fromNodeProviderChain()();

const bedrockAgentClient = new BedrockAgentRuntimeClient({
  region: 'ca-central-1',
  credentials,
});

export default async function POST(req: Request) {
  const { query, sessionId } = await req.json();

  const encoder = new TextEncoder();
  const parser = new XMLParser({ ignoreAttributes: false });

  const command = new InvokeAgentCommand({
    agentId: process.env.BEDROCK_AGENT_ID!,
    agentAliasId: process.env.BEDROCK_ALIAS_ID!,
    sessionId: sessionId || crypto.randomUUID(),
    inputText: query,
    enableTrace: true,
    streamingConfigurations: {
      streamFinalResponse: true,
    },
  });

  const agentResponse = await bedrockAgentClient.send(command);
  const nodeStream = agentResponse.completion;

  if (!nodeStream) {
    return NextResponse.json(
      { error: 'No stream returned from Bedrock agent.' },
      { status: 500 }
    );
  }
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of nodeStream) {
          if (
            chunk.trace?.trace?.orchestrationTrace?.modelInvocationOutput
              ?.rawResponse?.content
          ) {
            const rawXml =
              chunk.trace.trace.orchestrationTrace.modelInvocationOutput
                .rawResponse.content;
            const questions = parser.parse(rawXml).followups?.followup;
            if (questions) {
              controller.enqueue(
                encoder.encode(
                  `${JSON.stringify({ type: 'followups', content: questions })}\n`
                )
              );
            }
          }
          if (chunk.chunk?.bytes) {
            const content = new TextDecoder().decode(chunk.chunk.bytes);
            const attributions = chunk.chunk.attribution?.citations ?? [];
            controller.enqueue(
              encoder.encode(`${JSON.stringify({ type: 'text', content })}\n`)
            );
            if (attributions.length > 0) {
              controller.enqueue(
                encoder.encode(
                  `${JSON.stringify({ type: 'attribution', content: JSON.stringify(attributions) })}\n`
                )
              );
            }
          }
        }
        controller.close();
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        controller.enqueue(
          encoder.encode(
            `${JSON.stringify({ type: 'error', error: message })}\n`
          )
        );
        controller.error(e);
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Transfer-Encoding': 'chunked',
    },
  });
}
