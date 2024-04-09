'use client';

import Banner from '@/components/Banner';
import DataCard from '@/components/DataCard';
import GridInfo from '@/components/GridInfo';
import HomeHeader from '@/components/HomeHeader';
import { View } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { getUrl } from 'aws-amplify/storage';
import Papa from 'papaparse';
import React, { useEffect, useState } from 'react';
import awsExports from '../aws-exports';

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

  const fetchUrl = async (
    filename: string
  ): Promise<{ url: URL; expiresAt: Date } | null> => {
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
      console.log(getUrlResult);
      setSignedUrl(getUrlResult);
      setLoading(false);
      return getUrlResult;
    } catch (error) {
      console.error('Error fetching URL:', error);
      setLoading(false);
      return null; // Return null in case of error
    }
  };

  const labels = csvData.map((row) => String(row.City));
  const values = csvData.map((row) => Number(row.Value)); // Convert 'Value' to numbers

  return (
    <main>
      <HomeHeader />
      <Banner />
      <View as='section' className='container section-padding'>
        <h2>
          Explore <span className='alt-highlight'>Data</span>
        </h2>
        <div className='inner-container'>
          <div className='cards-container'>
            <DataCard fetchUrl={fetchUrl} />
          </div>
        </div>
      </View>
      <GridInfo />
    </main>
  );
};

export default App;
