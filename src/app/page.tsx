"use client"

import { WithAuthenticatorProps, withAuthenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { getUrl } from 'aws-amplify/storage';
import React, { useState } from 'react';
import config from '../amplifyconfiguration.json';

Amplify.configure(config);

interface AppProps extends WithAuthenticatorProps {
  signOut: () => void;
}

const App: React.FC<AppProps> = ({ signOut, user }) => {
  const filename = "UWI 2023 FINAL DATA FOR THE GRID — SCORES - ALL.csv"; // Replace with your actual filename
  const [signedUrl, setSignedUrl] = useState<{ url: URL; expiresAt: Date } | null>(null);

  const fetchData = async () => {
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
      console.log('URL expires at: ', getUrlResult.expiresAt);
    } catch (error) {
      console.error('Error fetching URL:', error);
    }
  };

  return (
    <>
      <h1>Hello {user?.username}</h1>
      <button onClick={signOut}>Sign out</button>
      <button onClick={fetchData}>Download file</button>
      {signedUrl && (
        <a href={signedUrl.url.toString()} target="_blank" rel="noreferrer">
          {filename}
        </a>
      )}
    </>
  );
};

export default withAuthenticator(App);
