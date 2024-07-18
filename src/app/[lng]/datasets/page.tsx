'use client';

import {
  Flex,
  Heading,
  Text,
  View,
  useAuthenticator,
} from '@aws-amplify/ui-react';
import { getUrl } from 'aws-amplify/storage';
import Papa from 'papaparse';
import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next/TransWithoutContext';
import Container from '../../components/Background';
import DataCard from '../../components/DataCards';
import useTranslation from '../../i18n/client';
import { useRouter } from 'next/navigation'; // Import useRouter from next/router

interface RootLayoutProps {
  params: { lng: string };
}

interface CSVRow {
  [key: string]: string | boolean | number;
}

const Datasets: React.FC<RootLayoutProps> = ({ params: { lng } }) => {
  const [signedUrl, setSignedUrl] = useState<{
    url: URL;
    expiresAt: Date;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize useRouter
  const { user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    const fileToDownload = sessionStorage.getItem('fileToDownload');
    if (fileToDownload && user) {
      downloadFile(fileToDownload);
      sessionStorage.removeItem('fileToDownload');
    }
  }, [user]);

  const downloadFile = async (filename: string) => {
    try {
      setLoading(true);
      const getUrlResult = await fetchUrl(filename);
      window.open(getUrlResult?.url.href);
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setLoading(false);
    }
  };

  // const parseCSV = async (url: URL) => {
  //   try {
  //     setLoading(true);
  //     const response = await fetch(url.href);
  //     const csvText = await response.text();
  //     const parsedCSV = Papa.parse(csvText, {
  //       header: true,
  //       preview: 10,
  //     });
  //     setCsvData(parsedCSV.data as CSVRow[]);
  //   } catch (error) {
  //     console.error('Error parsing CSV:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchUrl = async (filename: string) => {
    try {
      setLoading(true);
      const getUrlResult = await getUrl({
        key: filename,
        options: {
          accessLevel: 'guest',
          validateObjectExistence: true,
          expiresIn: 20,
          useAccelerateEndpoint: false,
        },
      });
      setSignedUrl(getUrlResult);
      return getUrlResult;
    } catch (error) {
      console.error('Error fetching URL:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (signedUrl) {
  //     parseCSV(signedUrl.url);
  //   }
  // }, [signedUrl]);

  const { t } = useTranslation(lng, 'datasets');

  return (
    <Container>
      <View as='section' className='container section-padding'>
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
          <Flex className='cards-container'>
            <DataCard fetchUrl={fetchUrl} />
          </Flex>
        </Flex>
      </View>
    </Container>
  );
};

export default Datasets;
