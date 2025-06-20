import '@aws-amplify/ui-react/styles.css';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
// import { Amplify } from 'aws-amplify';
import { configureAutoTrack } from 'aws-amplify/analytics';
import { dir } from 'console';
import type { Metadata } from 'next';
import Script from 'next/script';
import React from 'react';
// import config from '../../amplifyconfiguration.json';
import StyledComponentsRegistry from '../../utils/registry';
import AutheticatorProvider from '../components/AuthenticatorProvider';
import { LoadingProvider } from '../context/LoadingContext';
import { ThemeProvider } from '../context/ThemeContext';
import { languages } from '../i18n/settings';
import AWSThemeProvider from './aws-theme-provider';
import Banner from './components/BetaBanner';
import Footer from './components/Footer';
import LoadingBar from './components/LoadingBar';
import NavBar from './components/NavBar';
import './global.css';

interface RootLayoutProps {
  children: React.ReactNode;
  params: { lng: string };
}

// Define the possible languages
type Language = 'en' | 'fr';

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

// Amplify.configure(config, {
//   ssr: true,
//   Storage: {
//     S3: {
//       prefixResolver: async ({ accessLevel, targetIdentityId }) => {
//         if (accessLevel === 'guest') {
//           return 'public/';
//         }
//         if (accessLevel === 'protected') {
//           return `protected/${targetIdentityId}/`;
//         }
//         return `private/${targetIdentityId}/`;
//       },
//     },
//   },
// });

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

// Function to generate metadata dynamically based on language
const generateMetadata = async ({
  params,
}: RootLayoutProps): Promise<Metadata> => {
  const { lng } = params;

  const titles: { [key in Language]: string } = {
    en: 'Youth Data Lab',
    fr: 'Labo Data Jeunesse',
  };

  const descriptions: { [key in Language]: string } = {
    en: 'Insights driving change',
    fr: "L'intelligence au service du changement",
  };

  return {
    title: titles[lng as Language] || 'Youth Data Lab',
    description: descriptions[lng as Language] || 'Insights driving change',
  };
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
      <Script id='hotjar'>
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
      {/* <Script id='surveyMonkey'>
        {`(function(t,e,s,o){var n,a,c;t.SMCX=t.SMCX||[],e.getElementById(o)||(n=e.getElementsByTagName(s),a=n[n.length-1],c=e.createElement(s),c.type="text/javascript",c.async=!0,c.id=o,c.src="https://widget.surveymonkey.com/collect/website/js/tRaiETqnLgj758hTBazgdyrLe4Ns0eubJYLkQ_2Br4qlsFBFuAqt1McsNAO60hulgf.js",a.parentNode.insertBefore(c,a))})(window,document,"script","smcx-sdk");`}
      </Script> */}
      {/* override layout shift when opening nav bar */}
      <body>
        <GoogleAnalytics gaId='G-GEF0PPKZXD' />
        <GoogleTagManager gtmId='GTM-MXZ2WJTV' />
        <GoogleTagManager gtmId='GTM-NQN7F59B' />
        <StyledComponentsRegistry>
          <AutheticatorProvider>
            <ThemeProvider>
              <AWSThemeProvider>
                <LoadingProvider>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: '100vh',
                      height: '100%',
                    }}
                  >
                    <Banner />
                    <LoadingBar />
                    <NavBar />
                    {children}
                    <Footer />
                  </div>
                </LoadingProvider>
              </AWSThemeProvider>
            </ThemeProvider>
          </AutheticatorProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
};

export { generateMetadata };
export default RootLayout;
