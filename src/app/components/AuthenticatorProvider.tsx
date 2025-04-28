'use client';

import config from '@/amplifyconfiguration.json';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import 'aws-amplify/auth/enable-oauth-listener';

Amplify.configure(config);

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Authenticator.Provider>{children}</Authenticator.Provider>;
}
