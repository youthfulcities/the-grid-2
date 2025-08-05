import '@aws-amplify/ui-react/styles.css';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
// import { Amplify } from 'aws-amplify';
import { dir } from 'console';
import type { Metadata } from 'next';
import Script from 'next/script';
import React from 'react';
// import config from '../../amplifyconfiguration.json';
import StyledComponentsRegistry from '../../utils/registry';
import AutheticatorProvider from '../components/AuthenticatorProvider';
import { LoadingProvider } from '../context/LoadingContext';
import { ThemeProvider } from '../context/ThemeContext';
import { TooltipProvider } from '../context/TooltipContext';
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
      <body>
        <GoogleAnalytics gaId='G-GEF0PPKZXD' />
        <GoogleTagManager gtmId='GTM-MXZ2WJTV' />
        <GoogleTagManager gtmId='GTM-NQN7F59B' />
        <StyledComponentsRegistry>
          <AutheticatorProvider>
            <ThemeProvider>
              <AWSThemeProvider>
                <LoadingProvider>
                  <TooltipProvider>
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
                  </TooltipProvider>
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
