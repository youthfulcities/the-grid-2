'use client';

import Container from '@/app/components/Background';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styled from 'styled-components';

const StyledChat = styled.iframe`
  min-height: 80vh;
  border: none;
`;

const Chatbot = () => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const router = useRouter();

  useEffect(() => {
    if (authStatus !== 'authenticated') {
      localStorage.setItem('postLoginRedirect', '/insights/housing/open-ended');
      router.push('/authentication');
    }
  }, [authStatus, router]);

  // if (authStatus !== 'authenticated') {
  //   return null;
  // }

  return (
    <Container background='#0E1117'>
      <StyledChat
        src='https://chat.youthfulcities.com/'
        title='Youthful Cities Chatbot'
        height='100%'
        width='100%'
      />
    </Container>
  );
};

export default Chatbot;
