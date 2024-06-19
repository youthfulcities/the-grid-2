'use client';

import { Amplify } from 'aws-amplify';
import { useParams } from 'next/navigation';
import React from 'react';
import awsExports from '../../aws-exports';
import Container from '../components/Background';
import Banner from '../components/Banner';
import HomeHeader from '../components/HomeHeader';
import useTranslation from '../i18n/client';
import Insights from './insights/page';

Amplify.configure(awsExports);

interface RootLayoutProps {
  params: { lng: string };
}

const App: React.FC<RootLayoutProps> = ({ params: { lng } }) => {
  const params = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'home');

  return (
    <Container>
      <HomeHeader lng={lng} />
      <Banner lng={lng} />
      <Insights params={params} />
      {/* <GridInfo lng={lng} /> */}
    </Container>
  );
};

export default App;
