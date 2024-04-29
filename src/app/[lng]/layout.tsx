//

import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import { dir } from 'console';
import type { Metadata } from 'next';
import React from 'react';
import config from '../../amplifyconfiguration.json';
import StyledComponentsRegistry from '../../lib/registry';
import { languages } from '../i18n/settings';
import AWSThemeProvider from './aws-theme-provider';
import Footer from './components/Footer/Footer';
import NavBar from './components/NavBar/NavBar';
import './global.css';

interface RootLayoutProps {
  children: React.ReactNode;
  params: { lng: string };
}

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

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export const metadata: Metadata = {
  title: 'THE GRID',
  description: '',
};

const RootLayout: React.FC<RootLayoutProps> = ({
  children,
  params: { lng },
}) => {
  const direction = dir(lng);
  return (
    <html lang={lng} dir={direction !== undefined ? direction : 'ltr'}>
      <body>
        <StyledComponentsRegistry>
          <AWSThemeProvider>
            <NavBar lng={lng} />
            {children}
            <Footer lng={lng} />
          </AWSThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
