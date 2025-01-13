import fetchUrl from '@/lib/fetchUrl';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import config from '../amplifyconfiguration.json';

Amplify.configure(config);

const useDownloadFile = (filename: string) => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const router = useRouter();

  const handleDownload = async (file: string) => {
    try {
      const getUrlResult = await fetchUrl(file);

      if (getUrlResult?.url) {
        window.open(getUrlResult.url.href, '_blank');
      } else {
        console.error('Failed to retrieve URL for the file.');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  useEffect(() => {
    // Check for post-login download intent
    const storedFilename = sessionStorage.getItem('downloadFilename');
    if (authStatus === 'authenticated' && storedFilename) {
      sessionStorage.removeItem('downloadFilename'); // Clear the stored intent
      handleDownload(storedFilename); // Trigger the download
    }
  }, [authStatus]);

  const downloadFile = () => {
    const redirectPath = '/insights/housing/open-ended';

    if (authStatus !== 'authenticated') {
      console.error('User is not authenticated.');
      sessionStorage.setItem('postLoginRedirect', redirectPath);
      sessionStorage.setItem('downloadFilename', filename); // Save the download intent
      router.push('/authentication');
      return;
    }

    // Proceed with download for authenticated users
    handleDownload(filename);
  };

  return downloadFile;
};

export default useDownloadFile;
