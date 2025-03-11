'use client';

import config from '@/amplifyconfiguration.json';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';

Amplify.configure(config);

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Authenticator.Provider>{children}</Authenticator.Provider>;
}
