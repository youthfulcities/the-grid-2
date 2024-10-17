'use client';

import { Authenticator, Flex, Text, View } from '@aws-amplify/ui-react';

import config from '@/amplifyconfiguration.json';
import RedirectAfterAuth from '@/app/components/RedirectAfterAuth';
import { Amplify } from 'aws-amplify';
import Container from '../../components/Background';
import '../global.css';

import { useParams } from 'next/navigation';
import { Trans } from 'react-i18next/TransWithoutContext';
import useTranslation from '../../i18n/client';
Amplify.configure(config);

const Auth = () => {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'translation');
  return (
    <Container>
      <View
        as='section'
        className='container section-padding authenticator-container'
      >
        <Flex direction='column' justifyContent='center' alignItems='center'>
          <Text marginBottom='xl' maxWidth='475px'>
            <Trans
              t={t}
              i18nKey='login_info'
              components={{ a: <a href='/terms' /> }}
            />
          </Text>
          <Authenticator>
            {({ signOut }) => <button onClick={signOut}>Sign out</button>}
          </Authenticator>
          <RedirectAfterAuth />
          {/* This will handle the redirect after login */}
        </Flex>
      </View>
    </Container>
  );
};

export default Auth;
