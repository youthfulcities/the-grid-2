'use client';

import {
  Flex,
  Heading,
  Text,
  View,
  useAuthenticator,
} from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { getProperties, getUrl } from 'aws-amplify/storage';
import React, { useEffect } from 'react';
import { Trans } from 'react-i18next/TransWithoutContext';
import config from '../../../amplifyconfiguration.json';
import Container from '../../components/Background';
import DataCard from '../../components/DataCards';
import useTranslation from '../../i18n/client';

interface RootLayoutProps {
  params: { lng: string };
}

Amplify.configure(config);

const Datasets: React.FC<RootLayoutProps> = ({ params: { lng } }) => {
  const { user } = useAuthenticator((context) => [context.user]);

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

  useEffect(() => {
    const downloadFile = async (filename: string) => {
      try {
        const getUrlResult = await fetchUrl(filename);
        window.open(getUrlResult?.url.href);
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    };

    const fileToDownload = sessionStorage.getItem('fileToDownload');
    if (fileToDownload && user) {
      downloadFile(fileToDownload);
      sessionStorage.removeItem('fileToDownload');
    }
  }, [user]);

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
        <Heading level={2}>
          <Trans
            t={t}
            i18nKey='explore-data'
            components={{ span: <span className='highlight' /> }}
          />
        </Heading>
        <View className='inner-container'>
          <Text>{t('description')}</Text>
          <Text>
            <Trans t={t} i18nKey='index' components={{ strong: <strong /> }} />
          </Text>
          <Text>
            <Trans t={t} i18nKey='survey' components={{ strong: <strong /> }} />
          </Text>
          <Text>
            <Trans
              t={t}
              i18nKey='interview'
              components={{ strong: <strong /> }}
            />
          </Text>
        </View>
        <Flex className='inner-container'>
          <View className='cards-container'>
            <DataCard
              fetchUrl={fetchUrl}
              getFileProperties={getFileProperties}
            />
          </View>
        </Flex>
      </View>
    </Container>
  );
};

export default Datasets;
