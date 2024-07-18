'use client';

import Container from '@/app/components/Background';
import { Heading, Text, View, useTheme } from '@aws-amplify/ui-react';
import { useParams } from 'next/navigation';
import { Trans } from 'react-i18next/TransWithoutContext';
import styled from 'styled-components';
import useTranslation from '../../i18n/client';

const StyledChat = styled.iframe`
  min-height: 60vh;
  border: none;
`;

const Chatbot = () => {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'insights');
  const { tokens } = useTheme();

  return (
    <Container background='#0E1117'>
      <View className='short-container' marginTop='xl'>
        <Heading level={3} color={tokens.colors.font.inverse}>
          {t('note')}{' '}
        </Heading>
        <Text>{t('disclaimer')}</Text>
        <Text>{t('login')}</Text>
        <Text>
          <Trans t={t} i18nKey='email' components={{ strong: <strong /> }} />
        </Text>
        <Text marginBottom='large'>
          <Trans t={t} i18nKey='password' components={{ strong: <strong /> }} />
        </Text>
      </View>
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
