/* eslint no-restricted-syntax: 0 */

import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from '@aws-sdk/client-bedrock-agent-runtime';
import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
import { XMLParser } from 'fast-xml-parser';
import { NextResponse } from 'next/server';
import { ReadableStream } from 'stream/web';

const credentials = await fromNodeProviderChain()();

const bedrockAgentClient = new BedrockAgentRuntimeClient({
  region: 'ca-central-1',
  credentials,
});

export async function POST(req: Request) {
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

  const traces: any[] = [];

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
      } catch (e: any) {
        controller.enqueue(
          encoder.encode(
            `${JSON.stringify({ type: 'error', error: e.message })}\n`
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

function extractSourceIdMap(text: string): Record<string, string> {
  const start = text.indexOf('<search_results>');
  const end = text.indexOf('</search_results>') + '</search_results>'.length;
  if (start === -1 || end === -1) return {};

  const xml = `<root>${text.slice(start, end)}</root>`;
  const parser = new XMLParser({ ignoreAttributes: false });

  try {
    const root = parser.parse(xml);
    const results = root.root?.search_results?.search_result ?? [];
    const items = Array.isArray(results) ? results : [results];
    return items.reduce((acc: Record<string, string>, result: any) => {
      const source = result.source?.trim?.();
      const content = result.content?.trim?.();
      if (source && content) acc[source] = content;
      return acc;
    }, {});
  } catch {
    return {};
  }
}
