'use client';

import {
  Authenticator,
  Flex,
  View,
  withAuthenticator,
} from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { getUrl } from 'aws-amplify/storage';
import React, { useState } from 'react';
import awsExports from '../aws-exports';
import page from './page.module.css';
Amplify.configure(awsExports);

const App: React.FC = () => {
  const filename = 'UWI 2023 FINAL DATA FOR THE GRID — SCORES - ALL.csv'; // Replace with your actual filename
  const [signedUrl, setSignedUrl] = useState<{
    url: URL;
    expiresAt: Date;
  } | null>(null);

  const fetchUrl = async () => {
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

      setSignedUrl(getUrlResult);
    } catch (error) {
      console.error('Error fetching URL:', error);
    }
  };

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <button onClick={signOut}>Sign out</button>

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
                <a
                  href='/pages/topics'
                  className='card soft-shadow hvr-float hvr-push'
                >
                  <div className='card-img clip image-card-topics'></div>
                  <h4 className='card-text-bottom-corner'>Topics</h4>
                </a>
                <a href='#' className='card soft-shadow hvr-float hvr-push'>
                  <div className='card-img clip image-card-datasets'></div>
                  <h4 className='card-text-bottom-corner'>TBD</h4>
                </a>
                <a href='#' className='card soft-shadow hvr-float hvr-push'>
                  <div className='card-img clip image-card-cities'></div>
                  <h4 className='card-text-bottom-corner'>TBD</h4>
                </a>
              </div>
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
            </div>
          </section>
        </main>
      )}
    </Authenticator>
  );
};

export default withAuthenticator(App);
