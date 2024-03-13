'use client';

import BarGraph from '@/components/BarGraph';
import DataCard from '@/components/DataCard';
import DataTable from '@/components/DataTable';
import NavBar from '@/components/NavBar';
import ComingSoon from '@/components/ComingSoon'
import {
  Authenticator,
  Button,
  Flex,
  Loader,
  View,
  withAuthenticator,
} from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { getUrl } from 'aws-amplify/storage';
import Papa from 'papaparse';
import React, { useEffect, useState } from 'react';
import awsExports from '../aws-exports';
import page from './page.module.css';

Amplify.configure(awsExports);

const App: React.FC = () => {
  const [signedUrl, setSignedUrl] = useState<{
    url: URL;
    expiresAt: Date;
  } | null>(null);

  // Define an interface for the structure of the CSV data
  interface CSVRow {
    [key: string]: string | boolean | number;
  }
  const [csvData, setCsvData] = useState<CSVRow[]>([] as CSVRow[]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Define a function to parse CSV
    const parseCSV = async () => {
      try {
        setLoading(true);
        if (!signedUrl) {
          console.error('No signed URL available');
          setLoading(false);
          return;
        }
        const response = await fetch(signedUrl.url.href);
        const csvText = await response.text();
        const parsedCSV = Papa.parse(csvText, {
          header: true, // Assuming CSV file has headers
          preview: 10, //only show the first 10 rows
        });
        setCsvData(parsedCSV.data as CSVRow[]); // Access parsed CSV data
        setLoading(false);
      } catch (error) {
        console.error('Error parsing CSV:', error);
        setLoading(false);
      }
    };

    // Call parseCSV function whenever signedUrl changes
    if (signedUrl) {
      parseCSV();
    }
  }, [signedUrl]); // useEffect will run whenever signedUrl changes

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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching URL:', error);
      setLoading(false);
    }
  };

  const labels = csvData.map((row) => String(row.City));
  const values = csvData.map((row) => Number(row.Value)); // Convert 'Value' to numbers

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <ComingSoon />
          {/* <NavBar />
          <View as='section' className='home-header'>
            <Flex as='div' direction='column' className='container'>
              <h1 className='header-text'>
                Democratizing Youth <span className='highlight'>Data</span>
              </h1>
              <h3 className='header-subtext'>
                An open data portal powered by{' '}
                <a href='https://youthfulcities.com/'>Youthful Cities</a>
              </h3>
              <View as='div' className='relative-container' shrink={3}>
                <img
                  className='clip hero-img'
                  src='https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
                  alt='New York City at sunset'
                />
                <img
                  className='hero-logo'
                  src='/assets/theme_image/THE_GRID_logo_RGB_yellow.png'
                  alt='THE GRID logo'
                />
              </View>
            </Flex>
          </View>

          <section className='highlight-bar soft-shadow'>
            <Flex className={page.container} justifyContent='space-between'>
              <div className='fact'>
                <div>
                  <h4 className='light-heading'>Datasets</h4>
                  <h3 className='outline-text'>0</h3>
                </div>
              </div>
              <div className='fact'>
                <div>
                  <h4 className='light-heading'>Downloads</h4>
                  <h3 className='outline-text'>0</h3>
                </div>
              </div>
              <div className='fact'>
                <div>
                  <h4 className='light-heading'>Downloads</h4>
                  <h3 className='outline-text'>0</h3>
                </div>
              </div>
            </Flex>
          </section>
          <View as='section' className='container section-padding'>
            <h2>
              Explore <span className='alt-highlight'>Data</span>
            </h2>
            <div className='inner-container'>
              <div className='cards-container'>
                <DataCard
                  fetchUrl={fetchUrl}
                  title='Urban Work Index 2023'
                  url='UWI 2023 FINAL DATA FOR THE GRID — SCORES - ALL.csv'
                />
                <DataCard
                  title='Pivot 2020 Interviews'
                  fetchUrl={fetchUrl}
                  url='pivot-2020-interview.csv'
                />
                <DataCard
                  fetchUrl={fetchUrl}
                  title='Pivot 2020 Survey'
                  url='pivot-2020-survey-aggregated.csv'
                />
              </div>
              {loading ? (
                <Loader />
              ) : (
                signedUrl && <DataTable csvData={csvData} />
              )}
              {signedUrl && <BarGraph labels={labels} values={values} />}
            </div>
          </View>

          <section className='container section-padding'>
            <h2>
              What is the <span className='alt-highlight'>Grid?</span>
            </h2>
            <div className='inner-container'>
              <p>
                A free, open-source, intuitive data portal for young people,
                communities, planners, organizations, governments, and more to
                improve our future, inspire further research and shape
                youth-informed policies.
              </p>
              <p>
                THE GRID highlights youth voices across 3,000+ survey responses,
                20,000 minutes of interviews, and an index containing over
                23,000+ data points, allowing users to compare and contrast
                qualitative and quantitative data across 47 Canadian cities and
                23 topics.
              </p>
              <Button onClick={signOut}>Sign out</Button>
            </div>
          </section> */}
        </main>
      )}
    </Authenticator>
  );
};

export default withAuthenticator(App);
