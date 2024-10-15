'use client';

import {
  Authenticator,
  Text,
  View,
  useAuthenticator,
} from '@aws-amplify/ui-react';

import config from '@/amplifyconfiguration.json';
import RedirectAfterAuth from '@/app/components/RedirectAfterAuth';
import { Amplify } from 'aws-amplify';
import Container from '../../components/Background';
import '../global.css';
Amplify.configure(config);

const Auth = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  console.log(authStatus, user);
  return (
    <Container>
      <View
        as='section'
        className='container section-padding authenticator-container'
      >
        <Text textAlign='center' marginBottom='xl'>
          Login or create a free account to access the chatbot and download
          datasets. Creating an account helps us monitor usage and keep Youth
          Data Lab free for everyone.
        </Text>
        <Authenticator>
          {({ signOut }) => <button onClick={signOut}>Sign out</button>}
        </Authenticator>
        <RedirectAfterAuth /> {/* This will handle the redirect after login */}
      </View>
    </Container>
  );
};

export default Auth;
