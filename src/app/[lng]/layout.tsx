

import '@aws-amplify/ui-react/styles.css';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { Amplify } from 'aws-amplify';
import { configureAutoTrack } from 'aws-amplify/analytics';
import { dir } from 'console';
import type { Metadata } from 'next';
import Script from 'next/script';
import React from 'react';
import config from '../../amplifyconfiguration.json';
import StyledComponentsRegistry from '../../lib/registry';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import { languages } from '../i18n/settings';
import AWSThemeProvider from './aws-theme-provider';
import './global.css';
import AutheticatorProvider from '../components/AuthenticatorProvider'

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
  ssr: true,
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
  title: 'Youth Data Lab',
  description: 'Insights driving change',
};

const RootLayout: React.FC<RootLayoutProps> = ({
  children,
  params: { lng },
}) => {
  const direction = dir(lng);
  return (
    <html lang={lng} dir={direction !== undefined ? direction : 'ltr'}>
      <Script
        id='cookieyes'
        type='text/javascript'
        src='https://cdn-cookieyes.com/client_data/36b079cad9fec46bd01a04bc/script.js'
      />
      <Script
        id='adsense'
        async
        src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6052560776293450'
        crossOrigin='anonymous'
      />
      <Script id='hotjar'>
        {' '}
        {`
          (function (h, o, t, j, a, r)
          {
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:5039963,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}
      </Script>
      <body>

        <GoogleAnalytics gaId='G-GEF0PPKZXD' />
        <GoogleTagManager gtmId='GTM-MXZ2WJTV' />
        <StyledComponentsRegistry>
          <AutheticatorProvider>
          <AWSThemeProvider>
            <NavBar lng={lng} />
            {children}
            <Footer lng={lng} />
          </AWSThemeProvider>
          </AutheticatorProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
