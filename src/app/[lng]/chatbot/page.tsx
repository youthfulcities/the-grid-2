'use client';

import Accordion from '@/app/components/Accordion';
import Container from '@/app/components/Background';
import useTranslation from '@/app/i18n/client';
import {
  Button,
  Card,
  Flex,
  Input,
  Text,
  View,
  useAuthenticator,
} from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { AnimatePresence, motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Quote {
  text: string;
  id: string;
  [key: string]: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  open?: boolean;
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
  margin-bottom: var(--amplify-space-xxxl);
`;

const Bubble = styled(motion.div)<{ isUser: boolean }>`
  background: ${({ isUser }) =>
    isUser ? 'var(--amplify-colors-blue-60)' : '#0f0f0f'};
  color: ${({ isUser }) => (isUser ? '#fff' : '#111')};
  border-radius: var(--amplify-radii-xl);
  padding: var(--amplify-space-small) var(--amplify-space-large);
  max-width: 80%;
  align-self: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
`;

const DotLoader = styled.div`
  width: 30px;
  aspect-ratio: 2;
  --_g: no-repeat radial-gradient(circle closest-side, #fff 90%, #0000);
  background:
    var(--_g) 0% 50%,
    var(--_g) 50% 50%,
    var(--_g) 100% 50%;
  background-size: calc(100% / 3) 50%;
  animation: l3 1s infinite linear;
  @keyframes l3 {
    20% {
      background-position:
        0% 0%,
        50% 50%,
        100% 50%;
    }
    40% {
      background-position:
        0% 100%,
        50% 0%,
        100% 50%;
    }
    60% {
      background-position:
        0% 50%,
        50% 100%,
        100% 0%;
    }
    80% {
      background-position:
        0% 50%,
        50% 50%,
        100% 100%;
    }
  }
`;

const QuoteCard = styled(Card)`
  margin: var(--amplify-space-small) -0.75rem;
  padding: 0.75rem 1rem;
  border-left: 4px solid #d0d0d0;
  background-color: #fafafa;
`;

const FollowupButton = styled(Button)`
  text-align: left;
  justify-content: flex-start;
  font-size: 0.9rem;
`;

const QuoteLink = styled.a`
  overflow-wrap: break-word;
  color: var(--amplify-colors-blue-60);
  :hover {
    color: var(--amplify-colors-red-60);
  }
`;

const normalizeNewlines = (text: string) =>
  text
    // remove parentheses and their contents
    .replace(/\(.*?\)/g, '')
    // normalize newlines
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const ChatInterface: React.FC = () => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const router = useRouter();
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'chatbot');

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      sessionStorage.setItem('postLoginRedirect', '/chatbot');
      router.push('/authentication');
    }
  }, [authStatus, router]);

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! What can I help you research today?',
      open: false,
      followups: [
        'What are the most in-demand skills in Canada, and how can young people aquire them?',
        'What impact will AI have on the future of work?',
        'What are the main barriers to youth employment in Toronto, Calgary, Vancouver, Montreal, Moncton, and Whitehorse?',
      ],
    },
  ]);
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
        body: JSON.stringify({ query, sessionId: token }),
      });

      if (!res.body) throw new Error('No response stream');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let buffer = '';
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
              attribution.map((part: GeneratedResponsePart, attI: number) => {
                const quotes = part.retrievedReferences;
                const { end } =
                  part.generatedResponsePart.textResponsePart.span;
                return quotes.forEach((quote, quoteI: number) => {
                  const { metadata } = quote;
                  setMessages((prev) =>
                    prev.map((msg, i) => {
                      if (i === prev.length - 1 && msg.role === 'assistant') {
                        if (
                          msg.quotes &&
                          msg.quotes.some(
                            (q) => q.id === `${quoteI}_${i}_${attI}`
                          )
                        ) {
                          return msg;
                        }
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
                                ...metadata,
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
                  );
                });
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
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: query },
      { role: 'assistant', content: '' },
    ]);
    setInput('');
    await sendQuery(query);
  };

  const handleFollowupClick = async (question: string) => {
    setInput('');
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: question },
      { role: 'assistant', content: '' },
    ]);
    await sendQuery(question);
  };

  const toggleCitations = (messageIndex: number) => {
    setMessages((prev) =>
      prev.map((msg, i) =>
        i === messageIndex ? { ...msg, open: msg.open ? !msg.open : true } : msg
      )
    );
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' &&
        target.getAttribute('href')?.startsWith('#footnote-')
      ) {
        e.preventDefault();
        const id = target.getAttribute('href')!.slice('#footnote-'.length);
        const [, messageIndexStr] = id.split('_');
        const messageIndex = parseInt(messageIndexStr, 10);
        if (!Number.isNaN(messageIndex)) {
          setMessages((prev) =>
            prev.map((msg, i) =>
              i === messageIndex ? { ...msg, open: true } : msg
            )
          );
          // Optionally scroll to the citations area
          setTimeout(() => {
            const el = document.getElementById(`footnote-${id}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 50);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <Container>
      <ChatContainer>
        <Flex direction='column' gap='1rem'>
          <sub
            style={{
              color: '#fff',
              marginBottom: 'var(--amplify-space-large)',
            }}
          >
            The YC AI Research Assistant is an experimental tool that retrieves
            information from internal and external sources curated by Youthful
            Cities. The Assistant utilizes Claude 3 Sonnet to interpret and
            summarize results. All AI generated content should be carefully
            reviewed for accuracy, and we encourage you to read the original
            sources linked in the citations to get the full context.
          </sub>
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
                <Flex
                  direction='column'
                  gap={msg.content.length === 0 && loading ? '0' : 'large'}
                  marginTop={
                    msg.role === 'user' ? '0' : 'var(--amplify-space-xs)'
                  }
                  marginBottom={
                    msg.role === 'user' ? '0' : 'var(--amplify-space-xs)'
                  }
                >
                  {loading &&
                    msg.content.length === 0 &&
                    msg.role === 'assistant' && <DotLoader />}
                  <Text
                    as='p'
                    margin='0'
                    style={{ whiteSpace: 'pre-wrap' }}
                    dangerouslySetInnerHTML={{
                      __html: normalizeNewlines(msg.content),
                    }}
                  />
                  {msg.role === 'assistant' &&
                    (msg.quotes?.length ?? 0) > 0 && (
                      <View>
                        <Accordion
                          title={t('citations')}
                          open={msg.open ? 0 : undefined}
                          setOpen={() => toggleCitations(idx)}
                        >
                          {msg.quotes?.map((q, i) => (
                            <QuoteCard key={`quote-${q.id}`}>
                              <Text
                                as='blockquote'
                                color='font.inverse'
                                fontSize='small'
                              >
                                <sup id={`footnote-${q.id}`}>[{i + 1}]</sup>{' '}
                                {q.text}
                                {q.project && (
                                  <>
                                    <br />
                                    <br />
                                    <strong>Project:</strong> {q.project}
                                  </>
                                )}
                                {q.project && q.year && q.year !== 'None' && (
                                  <>, {q.year}</>
                                )}
                                {q.source_url && (
                                  <>
                                    <br />
                                    <strong>Source:</strong>{' '}
                                    <QuoteLink
                                      href={q.source_url}
                                      target='_blank'
                                      rel='noopener noreferrer'
                                    >
                                      {q.source_url}
                                    </QuoteLink>
                                  </>
                                )}
                              </Text>
                            </QuoteCard>
                          ))}
                        </Accordion>
                      </View>
                    )}

                  {msg.role === 'assistant' &&
                    (msg.followups?.length ?? 0) > 0 && (
                      <View>
                        <Text fontWeight='bold' marginBottom='xs'>
                          {t('followup')}
                        </Text>
                        <Flex direction='column' gap='0'>
                          {msg.followups?.map((question) => (
                            <FollowupButton
                              key={question}
                              variation='link'
                              fontSize='small'
                              colorTheme='info'
                              onClick={() => handleFollowupClick(question)}
                            >
                              {question}
                            </FollowupButton>
                          ))}
                        </Flex>
                      </View>
                    )}
                </Flex>
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
              style={{ resize: 'vertical' }}
              as='textarea'
              rows={1}
              placeholder={t('ask_something')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <Button isDisabled={loading} type='submit'>
              {t('send_btn')}
            </Button>
          </Flex>
        </Flex>
      </ChatContainer>
    </Container>
  );
};

export default ChatInterface;
