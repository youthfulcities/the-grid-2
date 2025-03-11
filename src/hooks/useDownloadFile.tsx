import fetchUrl from '@/lib/fetchUrl';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
// import config from '../amplifyconfiguration.json';

// Amplify.configure(config);

const useDownloadFile = (filename: string) => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const router = useRouter();
  const pathname = usePathname();

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
    if (authStatus === 'authenticated') {
      const storedFilename = sessionStorage.getItem('downloadFilename');
      const storedRedirect = sessionStorage.getItem('postLoginRedirect');

      if (storedFilename) {
        sessionStorage.removeItem('downloadFilename');
        handleDownload(storedFilename);
      }
      if (storedRedirect) {
        sessionStorage.removeItem('postLoginRedirect');
        router.push(storedRedirect);
      }
    }
  }, [authStatus]);

  const downloadFile = () => {
    if (authStatus !== 'authenticated') {
      console.error('User is not authenticated.');
      sessionStorage.setItem('postLoginRedirect', pathname);
      sessionStorage.setItem('downloadFilename', filename);

      router.push('/authentication');
      return;
    }

    // Proceed with download for authenticated users
    handleDownload(filename);
  };

  return downloadFile;
};

export default useDownloadFile;
