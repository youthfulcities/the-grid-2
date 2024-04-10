//

import NavBar from '@/components/NavBar/NavBar';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import type { Metadata } from 'next';
import React from 'react';
import config from '../amplifyconfiguration.json';
import AWSThemeProvider from './aws-theme-provider';
import './globals.css';

Amplify.configure(config, {
  Storage: {
    S3: {
      prefixResolver: async ({ accessLevel, targetIdentityId }) => {
        if (accessLevel === 'guest') {
          return 'public/';
        }
        if (accessLevel === 'protected') {
          return `protected/${targetIdentityId}/`;
        }
        return `private/${targetIdentityId}/`;
      },
    },
  },
});

export const metadata: Metadata = {
  title: 'THE GRID',
  description: '',
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <html lang='en'>
    <body>
      <AWSThemeProvider>
        <NavBar />
        {children}
      </AWSThemeProvider>
    </body>
  </html>
);

export default RootLayout;
