//

import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import { configureAutoTrack } from 'aws-amplify/analytics';
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
import { GoogleAnalytics } from '@next/third-parties/google';

interface RootLayoutProps {
  children: React.ReactNode;
  params: { lng: string };
}

//configure Amazon Pinpoint tracking
configureAutoTrack({
  // REQUIRED, turn on/off the auto tracking
  enable: true,
  // REQUIRED, the event type, it's one of 'event', 'pageView' or 'session'
  type: 'session',
  // OPTIONAL, additional options for the tracked event.
  options: {
    // OPTIONAL, the attributes of the event
    attributes: {
      customizableField: 'attr',
    },
  },
});

configureAutoTrack({
  // REQUIRED, turn on/off the auto tracking
  enable: true,
  // REQUIRED, the event type, it's one of 'event', 'pageView' or 'session'
  type: 'pageView',
  // OPTIONAL, additional options for the tracked event.
  options: {
    // OPTIONAL, the attributes of the event
    attributes: {
      customizableField: 'attr',
    },

    // OPTIONAL, the event name. By default, this is 'pageView'
    eventName: 'pageView',

    // OPTIONAL, the type of app under tracking. By default, this is 'multiPageApp'.
    // You will need to change it to 'singlePage' if your app is a single-page app like React
    appType: 'multiPage',

    // OPTIONAL, provide the URL for the event.
    urlProvider: () =>
      // the default function
      window.location.origin + window.location.pathname,
  },
});

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
        <GoogleAnalytics gaId='G-7S1Y1B2YXC' />
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
