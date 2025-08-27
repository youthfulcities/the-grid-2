import { useLoading } from '@/app/context/LoadingContext';
import fetchUrl from '@/utils/fetchUrl';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const useDownloadFile = () => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const router = useRouter();
  const pathname = usePathname();
  const { setDownloadProgress } = useLoading();

  const handleDownload = async (file: string) => {
    try {
      setDownloadProgress(0);

      const getUrlResult = await fetchUrl(file);
      if (!getUrlResult?.url) {
        throw new Error('Failed to retrieve URL for the file.');
      }

      const response = await fetch(getUrlResult.url.href);
      if (!response.body) {
        throw new Error('Response body is null.');
      }

      const contentLength = response.headers.get('content-length');
      if (!contentLength) {
        window.open(getUrlResult.url.href, '_blank');
        setDownloadProgress(null);
        return;
      }

      const totalSize = parseInt(contentLength, 10);
      let loadedSize = 0;

      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];

      const readStream = async () => {
        const { done, value } = await reader.read();
        if (done) return;

        chunks.push(value);
        loadedSize += value.length;
        setDownloadProgress(Math.round((loadedSize / totalSize) * 100));
        await readStream();
      };

      await readStream();

      // Create Blob and trigger download
      const blob = new Blob(chunks);
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = file;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);

      setDownloadProgress(null);
    } catch (error) {
      console.error('Error downloading file:', error);
      setDownloadProgress(null);
    }
  };

  useEffect(() => {
    if (authStatus === 'authenticated') {
      const storedFilename = localStorage.getItem('downloadFilename');
      const storedRedirect = localStorage.getItem('postLoginRedirect');

      if (storedFilename) {
        localStorage.removeItem('downloadFilename');
        handleDownload(storedFilename);
      }
      if (storedRedirect) {
        localStorage.removeItem('postLoginRedirect');
        router.push(storedRedirect);
      }
    }
  }, [authStatus]);

  const downloadFile = (filename: string, bypassAuthCheck = false) => {
    if (!bypassAuthCheck && authStatus !== 'authenticated') {
      console.error('User is not authenticated.');
      localStorage.setItem('postLoginRedirect', pathname);
      localStorage.setItem('downloadFilename', filename);
      router.push('/authentication');
      return;
    }

    handleDownload(filename);
  };

  return { downloadFile };
};

export default useDownloadFile;
