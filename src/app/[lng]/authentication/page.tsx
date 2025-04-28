'use client';

import { Authenticator, Flex, Text, View } from '@aws-amplify/ui-react';

// import config from '@/amplifyconfiguration.json';
import Container from '@/app/components/Background';
// import { Amplify } from 'aws-amplify';
import '../global.css';

import useTranslation from '@/app/i18n/client';

import 'aws-amplify/auth/enable-oauth-listener';
import { useParams } from 'next/navigation';
import { Trans } from 'react-i18next/TransWithoutContext';
import RedirectAfterAuth from './components/RedirectAfterAuth';
// Amplify.configure(config);

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
            {({ signOut }) => (
              <button type='submit' onClick={signOut}>
                {t('logout')}
              </button>
            )}
          </Authenticator>
          <RedirectAfterAuth />
        </Flex>
      </View>
    </Container>
  );
};

export default Auth;
