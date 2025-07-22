'use client';

import Container from '@/app/components/Background';
import { Button, Card, Flex, Input, Text, View } from '@aws-amplify/ui-react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import styled from 'styled-components';

import { fetchAuthSession } from 'aws-amplify/auth';

interface Quote {
  text: string;
  id: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  quotes?: Quote[];
  followups?: string[];
}

export interface RetrievedReference {
  content: {
    text: string;
    type: 'TEXT' | string;
  };
  location: {
    type: 'S3' | string;
    s3Location: {
      uri: string;
    };
  };
  metadata: {
    [key: string]: string;
    Age: string;
    City: string;
    Gender: string;
    'Ethno-racial identity': string;
    'Work status': string;
    'x-amz-bedrock-kb-data-source-id': string;
    'x-amz-bedrock-kb-source-uri': string;
  };
}

export interface GeneratedResponsePart {
  generatedResponsePart: {
    textResponsePart: {
      text: string;
      span: {
        start: number;
        end: number;
      };
    };
  };
  retrievedReferences: RetrievedReference[];
}

const ChatContainer = styled(View)`
  max-width: 800px;
  margin: auto;
  padding: 2rem;
`;

const Bubble = styled(motion.div)<{ isUser: boolean }>`
  background: ${({ isUser }) => (isUser ? '#0070f3' : '#0f0f0f')};
  color: ${({ isUser }) => (isUser ? '#fff' : '#111')};
  padding: 1rem;
  border-radius: 16px;
  margin-bottom: 1rem;
  max-width: 80%;
  align-self: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
`;

const QuoteCard = styled(Card)`
  margin-top: 0.75rem;
  padding: 0.75rem 1rem;
  border-left: 4px solid #d0d0d0;
  background-color: #fafafa;
`;

const FollowupButton = styled(Button)`
  text-align: left;
  justify-content: flex-start;
  padding: 0;
  font-size: 0.9rem;
`;

const normalizeNewlines = (text: string) =>
  text
    .replace(/\r\n/g, '\n') // Normalize Windows-style newlines
    .replace(/[ \t]+\n/g, '\n') // Remove trailing spaces/tabs before newlines
    .replace(/\n{3,}/g, '\n\n') // Collapse 3+ newlines into exactly 2 (one blank line)
    .trim(); // Remove leading/trailing blank lines

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const sendQuery = async (query: string) => {
    try {
      setLoading(true);
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      const res = await fetch('/api/chat/query/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      });

      if (!res.body) throw new Error('No response stream');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let buffer = '';
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      const process = async () => {
        const { done, value } = await reader.read();
        if (done) return;

        const chunkText = decoder.decode(value, { stream: true });
        buffer += chunkText;

        const events = buffer.split(/\r?\n/);
        buffer = events.pop() || ''; // incomplete fragment
        events.forEach((raw) => {
          if (!raw.trim()) return; // skip empty
          const payload = JSON.parse(raw);
          try {
            if (payload.type === 'text') {
              setMessages((prev) =>
                prev.map((msg, i) =>
                  i === prev.length - 1 && msg.role === 'assistant'
                    ? { ...msg, content: msg.content + payload.content }
                    : msg
                )
              );
            } else if (payload.type === 'attribution') {
              const attribution = JSON.parse(payload.content);
              console.log(attribution);
              attribution.map((part: GeneratedResponsePart, attI: number) => {
                const quotes = part.retrievedReferences;
                const { end } =
                  part.generatedResponsePart.textResponsePart.span;
                return quotes.forEach((quote, quoteI: number) =>
                  setMessages((prev) =>
                    prev.map((msg, i) => {
                      if (i === prev.length - 1 && msg.role === 'assistant') {
                        if (msg.content.length >= end) {
                          const footnoteLink = `<sup><a href="#footnote-${quoteI}_${i}_${attI}">[${(msg.quotes?.length ?? 0) + 1}]</a></sup>`;
                          const footnoteLength = footnoteLink.length;
                          const before = msg.content.slice(
                            0,
                            end + (msg.quotes?.length ?? 0) * footnoteLength
                          );
                          const after = msg.content.slice(
                            end + (msg.quotes?.length ?? 0) * footnoteLength
                          );
                          return {
                            ...msg,
                            content: before + footnoteLink + after,
                            quotes: [
                              ...(msg.quotes ?? []),
                              {
                                text: quote.content.text,
                                id: `${quoteI}_${i}_${attI}`,
                              },
                            ],
                          };
                        }
                        return {
                          ...msg,
                          quotes: [
                            ...(msg.quotes ?? []),
                            {
                              text: quote.content.text,
                              id: `${quoteI}_${i}_${attI}`,
                            },
                          ],
                        };
                      }
                      return msg;
                    })
                  )
                );
              });
            } else if (payload.type === 'followups') {
              setMessages((prev) =>
                prev.map((msg, i) =>
                  i === prev.length - 1 && msg.role === 'assistant'
                    ? {
                        ...msg,
                        followups: [
                          ...(msg.followups ?? []),
                          ...payload.content,
                        ],
                      }
                    : msg
                )
              );
            } else if (payload.type === 'error') {
              setMessages((prev) =>
                prev.map((msg, i) =>
                  i === prev.length - 1 && msg.role === 'assistant'
                    ? { ...msg, content: msg.content + payload.content }
                    : msg
                )
              );
            }
          } catch (err) {
            console.error('Failed to parse payload chunk:', err, raw);
          }
        });

        return process();
      };

      await process();
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Error retrieving response.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const query = input.trim();
    if (!query) return;
    setMessages((prev) => [...prev, { role: 'user', content: query }]);
    setInput('');
    await sendQuery(query);
  };

  const handleFollowupClick = async (question: string) => {
    setInput('');
    await sendQuery(question);
  };
  return (
    <Container>
      <ChatContainer>
        <Flex direction='column' gap='1rem'>
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <Bubble
                key={idx}
                isUser={msg.role === 'user'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Text
                  as='p'
                  style={{ whiteSpace: 'pre-wrap' }}
                  dangerouslySetInnerHTML={{
                    __html: normalizeNewlines(msg.content),
                  }}
                />
                {msg.role === 'assistant' && (msg.quotes?.length ?? 0) > 0 && (
                  <View>
                    {msg.quotes?.map((q, i) => (
                      <QuoteCard key={q.id}>
                        <Text
                          as='blockquote'
                          color='font.inverse'
                          fontSize='small'
                        >
                          <sup id={`footnote-${q.id}`}>[{i + 1}]</sup> {q.text}
                        </Text>
                      </QuoteCard>
                    ))}
                  </View>
                )}

                {msg.role === 'assistant' &&
                  (msg.followups?.length ?? 0) > 0 && (
                    <View marginTop='1rem'>
                      <Text fontWeight='bold' marginBottom='0.5rem'>
                        Follow-up Questions:
                      </Text>
                      <Flex direction='column' gap='0.25rem'>
                        {msg.followups?.map((question, i) => (
                          <FollowupButton
                            key={i}
                            variation='link'
                            onClick={() => handleFollowupClick(question)}
                          >
                            {question}
                          </FollowupButton>
                        ))}
                      </Flex>
                    </View>
                  )}
              </Bubble>
            ))}
          </AnimatePresence>

          <Flex
            as='form'
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            gap='0.5rem'
          >
            <Input
              placeholder='Ask something...'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <Button isDisabled={loading} type='submit'>
              Send
            </Button>
          </Flex>
        </Flex>
      </ChatContainer>
    </Container>
  );
};

export default ChatInterface;
