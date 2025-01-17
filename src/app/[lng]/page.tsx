'use client';

import { Flex, Heading, Text, View } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { useParams } from 'next/navigation';
import React from 'react';
import { Trans } from 'react-i18next/TransWithoutContext';
import awsExports from '../../aws-exports';
import Container from '../components/Background';
import Banner from '../components/Banner';
import HomeHeader from '../components/HomeHeader';
import useTranslation from '../i18n/client';

Amplify.configure(awsExports);

interface RootLayoutProps {
  params: { lng: string };
}

const App: React.FC<RootLayoutProps> = () => {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'about');

  return (
    <Container>
      <HomeHeader />
      <Banner lng={lng} />
      <Flex className='container section-padding'>
        <Flex direction='column'>
          <Heading level={2}>
            <Trans
              t={t}
              i18nKey='title'
              components={{ span: <span className='highlight' /> }}
            />
          </Heading>
          <View className='inner-container'>
            <Trans t={t} i18nKey='about' components={{ p: <Text /> }} />
          </View>
        </Flex>
      </Flex>
    </Container>
  );
};

export default App;
