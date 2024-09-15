'use client';

import Container from '@/app/components/Background';
import { Heading, Text, View, useTheme } from '@aws-amplify/ui-react';
import { useParams, useRouter } from 'next/navigation';
import { Trans } from 'react-i18next/TransWithoutContext';
import styled from 'styled-components';
import useTranslation from '../../i18n/client';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useEffect } from 'react';

const StyledChat = styled.iframe`
  min-height: 80vh;
  border: none;
`;

const Chatbot = () => {
  const { lng } = useParams<{ lng: string }>();
  const { user } = useAuthenticator();
  const router = useRouter();

  useEffect(() => {
    if (!user) {

      sessionStorage.setItem("postLoginRedirect", "/chatbot");
      router.push("/authentication");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <Container background='#0E1117'>
      <StyledChat
        src='https://chat.youthfulcities.com/'
        title='Youthful Cities Chatbot'
        height='100%'
        width='100%'
      ></StyledChat>
    </Container>
  );
};

export default Chatbot;