'use client';

import BarGraph from '@/components/BarGraph';
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
import { v4 as uuidv4 } from 'uuid';
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

  console.log(csvData);
  const labels = csvData.map((row) => String(row.City));
  const values = csvData.map((row) => Number(row.Value)); // Convert 'Value' to numbers

  // Function to render HTML table
  const renderTable = () => (
    <View style={{ maxHeight: '500px', overflow: 'auto', marginTop: '4rem' }}>
      <table>
        <thead>
          <tr>
            {csvData.length > 0 &&
              Object.keys(csvData[0]).map((key) => (
                <th style={{ padding: '0.5rem' }} key={key}>
                  {key}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {csvData.map((row) => (
            <tr key={uuidv4()}>
              {Object.values(row).map((value, columnIndex) => (
                <td style={{ padding: '0.5rem' }} key={uuidv4()}>
                  {String(value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </View>
  );

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
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
                <Button
                  className='card soft-shadow hvr-float hvr-push'
                  style={{
                    paddingInlineStart: 0,
                    paddingInlineEnd: 0,
                    paddingBlockEnd: 0,
                    paddingBlockStart: 0,
                    position: 'relative',
                  }}
                  onClick={() =>
                    fetchUrl(
                      'UWI 2023 FINAL DATA FOR THE GRID — SCORES - ALL.csv'
                    )
                  }
                >
                  <div
                    className='card-img clip image-card-topics'
                    style={{ position: 'absolute', top: 0 }}
                  />
                  <h4 className='card-text-bottom-corner'>
                    Urban Work Index 2023
                  </h4>
                </Button>
                <Button
                  className='card soft-shadow hvr-float hvr-push'
                  style={{
                    paddingInlineStart: 0,
                    paddingInlineEnd: 0,
                    paddingBlockEnd: 0,
                    paddingBlockStart: 0,
                    position: 'relative',
                  }}
                  onClick={() => fetchUrl('pivot-2020-interview.csv')}
                >
                  <div
                    className='card-img clip image-card-datasets'
                    style={{ position: 'absolute', top: 0 }}
                  />
                  <h4 className='card-text-bottom-corner'>
                    Pivot 2020 Interviews
                  </h4>
                </Button>
                <Button
                  className='card soft-shadow hvr-float hvr-push'
                  style={{
                    paddingInlineStart: 0,
                    paddingInlineEnd: 0,
                    paddingBlockEnd: 0,
                    paddingBlockStart: 0,
                    position: 'relative',
                  }}
                  onClick={() => fetchUrl('pivot-2020-survey-aggregated.csv')}
                >
                  <div
                    className='card-img clip image-card-cities'
                    style={{ position: 'absolute', top: 0 }}
                  />
                  <h4 className='card-text-bottom-corner'>Pivot 2020 Survey</h4>
                </Button>
              </div>
              {loading ? <Loader /> : signedUrl && renderTable()}
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
          </section>
        </main>
      )}
    </Authenticator>
  );
};

export default withAuthenticator(App);
