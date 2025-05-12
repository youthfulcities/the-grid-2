'use client';

import DataCard from '@/app/[lng]/datasets/components/DataCards';
import Container from '@/app/components/Background';
import useTranslation from '@/app/i18n/client';
import useDownloadFile from '@/hooks/useDownloadFile';
import {
  Button,
  Card,
  Flex,
  Heading,
  Text,
  View,
  useAuthenticator,
} from '@aws-amplify/ui-react';
// import { Amplify } from 'aws-amplify';
import FadeInUp from '@/app/components/FadeInUp';
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

  // useEffect(() => {
  //   const downloadFile = async (filename: string) => {
  //     try {
  //       const getUrlResult = await fetchUrl(filename);
  //       window.open(getUrlResult?.url.href);
  //     } catch (error) {
  //       console.error('Error downloading file:', error);
  //     }
  //   };

  //   const fileToDownload = sessionStorage.getItem('fileToDownload');
  //   if (fileToDownload && user) {
  //     downloadFile(fileToDownload);
  //     sessionStorage.removeItem('fileToDownload');
  //   }
  // }, [user]);

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
            <Card
              backgroundColor='blue.60'
              variation='elevated'
              borderRadius='xl'
              padding='xl'
              marginBottom='xxl'
            >
              <Flex gap='xl'>
                <img
                  src='https://www.youthfulcities.com/wp-content/uploads/2025/05/insight-part-1.3.png'
                  alt='Building Bridges: Connecting Youth Skills to the Future
                of Work'
                  width='50%'
                />
                <Flex direction='column' justifyContent='center'>
                  <View>
                    <Heading level={5} color='yellow.60'>
                      FEATURED
                    </Heading>
                    <Heading level={3}>
                      Building Bridges: Connecting Youth Skills to the Future of
                      Work
                    </Heading>
                  </View>
                  <Text>
                    Download part one of the DEVlab insights report, taking a
                    deep dive into youth data insights and stories from the
                    DEVlab project.
                  </Text>
                  <Button
                    onClick={() =>
                      downloadFile('insight-part-1-final-small.pdf', true)
                    }
                    variation='primary'
                  >
                    Download Now
                  </Button>
                </Flex>
              </Flex>
            </Card>
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
