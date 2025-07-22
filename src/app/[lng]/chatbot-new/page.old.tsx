'use client';

import Container from '@/app/components/Background';
import { Button, Card, Flex, Input, Text, View } from '@aws-amplify/ui-react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import styled from 'styled-components';

interface Quote {
  text: string;
  filename?: string;
  speaker?: string;
  time?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  quotes?: Quote[];
  followups?: string[];
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

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const sendQuery = async (query: string) => {
    try {
      setLoading(true);
      // Call your API and receive a response in the expected structure
      const res = await fetch('/api/chat/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      console.log(data);
      const { response: assistantResponse, source_chunks, follow_ups } = data;

      // Build HTML for each source chunk with a link to its footnote
      let sourceChunksHtml = '';
      if (source_chunks && source_chunks.length) {
        source_chunks.forEach((chunk, idx) => {
          sourceChunksHtml += `<p>${chunk.text} <a href="#footnote-${idx + 1}" style="text-decoration:none;"><sup>${idx + 1}</sup></a></p>`;
        });
      }

      // Flatten all sources from source_chunks into a footnotes array
      const footnotes = source_chunks?.flatMap((chunk) => chunk.sources) || [];
      let footnotesHtml = '';
      if (footnotes.length) {
        footnotes.forEach((note, idx) => {
          footnotesHtml += `<p id="footnote-${idx + 1}"><a href="#top" style="text-decoration:none;">&#8593;</a> ${note.full_quote}</p>`;
        });
      }

      // Combine the main assistant response with the sources and footnotes sections
      const finalAnswerHtml = `
      <div>${assistantResponse}</div>
      ${sourceChunksHtml ? `<hr/><div id="top">${sourceChunksHtml}</div>` : ''}
      ${footnotesHtml ? `<hr/><div><strong>Footnotes:</strong>${footnotesHtml}</div>` : ''}
    `;

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          // Ensure your message component renders HTML appropriately (e.g. via dangerouslySetInnerHTML):
          content: finalAnswerHtml,
          followups: follow_ups,
        },
      ]);
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
                  dangerouslySetInnerHTML={{ __html: msg.content }}
                />
                {msg.role === 'assistant' && msg.quotes?.length > 0 && (
                  <View>
                    {msg.quotes.map((q, i) => (
                      <QuoteCard key={i}>
                        <Text
                          as='blockquote'
                          color='font.inverse'
                          fontSize='small'
                        >
                          <sup id={`footnote-${i + 1}`}>[{i + 1}]</sup> “
                          {q.text}”
                        </Text>
                      </QuoteCard>
                    ))}
                  </View>
                )}

                {msg.role === 'assistant' && msg.followups?.length > 0 && (
                  <View marginTop='1rem'>
                    <Text fontWeight='bold' marginBottom='0.5rem'>
                      Follow-up Questions:
                    </Text>
                    <Flex direction='column' gap='0.25rem'>
                      {msg.followups.map((question, i) => (
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
