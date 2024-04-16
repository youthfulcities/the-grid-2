//

import NavBar from '@/components/NavBar/NavBar';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import type { Metadata } from 'next';
import React from 'react';
import config from '../amplifyconfiguration.json';
import AWSThemeProvider from './aws-theme-provider';
import './globals.css';

// i18n
//   .use(HttpApi)
//   .use(initReactI18next) // passes i18n down to react-i18next
//   .use(LanguageDetector)
//   .init({
//     supportedLngs: ['en', 'fr'],
//     fallbackLng: 'en',
//     detection: {
//       // order and from where user language should be detected
//       order: [
//         'querystring',
//         'path',
//         'localStorage',
//         'sessionStorage',
//         'navigator',
//         'subdomain',
//         'cookie',
//         'htmlTag',
//       ],

//       // keys or params to lookup language from
//       lookupQuerystring: 'lng',
//       lookupCookie: 'i18next',
//       lookupLocalStorage: 'i18nextLng',
//       lookupSessionStorage: 'i18nextLng',
//       lookupFromPathIndex: 0,
//       lookupFromSubdomainIndex: 0,

//       // cache user language on
//       caches: ['localStorage'],
//     },

//     backend: { loadPath: '/assets/locales/{{lng}}/translation.json' },
//     interpolation: {
//       escapeValue: false,
//     },
//   });

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
