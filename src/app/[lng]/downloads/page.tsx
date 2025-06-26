'use client';

import DataCard from '@/app/[lng]/downloads/components/DataCards';
import Container from '@/app/components/Background';
import useTranslation from '@/app/i18n/client';
import useDownloadFile from '@/hooks/useDownloadFile';
import {
  Flex,
  Heading,
  Text,
  View,
  useAuthenticator,
} from '@aws-amplify/ui-react';
// import { Amplify } from 'aws-amplify';
import FadeInUp from '@/app/components/FadeInUp';
import Feature from '@/app/components/Feature';
import { getProperties, getUrl } from 'aws-amplify/storage';
import Link from 'next/link';
import React from 'react';
import { Trans } from 'react-i18next/TransWithoutContext';
// import config from '../../../amplifyconfiguration.json';

interface RootLayoutProps {
  params: { lng: string };
}

// Amplify.configure(config);

const Datasets: React.FC<RootLayoutProps> = ({ params: { lng } }) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const { downloadFile } = useDownloadFile();

  const fetchUrl = async (filename: string) => {
    try {
      const getUrlResult = await getUrl({
        key: filename,
        options: {
          accessLevel: 'guest',
          validateObjectExistence: true,
          expiresIn: 20,
          useAccelerateEndpoint: false,
        },
      });
      return getUrlResult;
    } catch (error) {
      console.error('Error fetching URL:', error);
      return null;
    }
  };

  const getFileProperties = async (filename: string) => {
    try {
      const result = await getProperties({
        key: filename,
        options: {
          accessLevel: 'guest',
        },
      });

      // Extract the relevant metadata
      const metadata = {
        size: result.size,
        lastModified: result.lastModified
          ? result.lastModified.toISOString()
          : undefined,
      };

      return metadata;
    } catch (error) {
      console.error('Error getting file properties:', error);
      return null;
    }
  };

  const { t } = useTranslation(lng, 'datasets');

  return (
    <Container>
      <View as='section' className='container' paddingTop='xxxl'>
        <FadeInUp>
          <Heading level={2}>
            <Trans
              t={t}
              i18nKey='explore-data'
              components={{ span: <span className='highlight' /> }}
            />
          </Heading>
        </FadeInUp>
        <View className='inner-container'>
          <FadeInUp>
            <Feature />
          </FadeInUp>
          <FadeInUp>
            <Text>{t('description')}</Text>
            <Text>
              <Trans
                t={t}
                i18nKey='index'
                components={{ strong: <strong /> }}
              />
            </Text>
            <Text>
              <Trans
                t={t}
                i18nKey='survey'
                components={{ strong: <strong /> }}
              />
            </Text>
            <Text>
              <Trans
                t={t}
                i18nKey='interview'
                components={{ strong: <strong /> }}
              />
            </Text>
            <Text>
              <Trans
                t={t}
                i18nKey='more'
                components={{ a: <Link href='/contact' /> }}
              />
            </Text>
          </FadeInUp>
        </View>
        <FadeInUp>
          <Flex className='inner-container'>
            <View className='cards-container'>
              <DataCard
                fetchUrl={fetchUrl}
                getFileProperties={getFileProperties}
              />
            </View>
          </Flex>
        </FadeInUp>
      </View>
    </Container>
  );
};

export default Datasets;
