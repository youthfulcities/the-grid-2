'use client';

import { Amplify } from 'aws-amplify';

import React from 'react';
import awsExports from '../../aws-exports';
import useTranslation from '../i18n/client';
import Banner from './components/Banner';
import GridInfo from './components/GridInfo';
import HomeHeader from './components/HomeHeader';

Amplify.configure(awsExports);

interface RootLayoutProps {
  params: { lng: string };
}

const App: React.FC<RootLayoutProps> = ({ params: { lng } }) => {


  const { t } = useTranslation(lng, 'home');

  return (
    <main>
      <HomeHeader lng={lng} />
      <Banner lng={lng} />
      <GridInfo lng={lng} />
    </main>
  );
};

export default App;
