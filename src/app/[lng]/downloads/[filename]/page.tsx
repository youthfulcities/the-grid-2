'use client';

import Container from '@/app/components/Background';
import useDownloadPublicFile from '@/hooks/useDownloadPublicFile';
import { Button, Text, View } from '@aws-amplify/ui-react';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

const DatasetDownloadPage = () => {
  const { filename } = useParams();
  const { downloadFile } = useDownloadPublicFile();

  useEffect(() => {
    if (typeof filename === 'string') {
      downloadFile(filename); // bypass auth since file is public
    }
  }, [filename]);

  return (
    <Container>
      <View className='container' marginTop='xxxl'>
        <Text>Starting download for {filename}...</Text>
        <Text>
          If nothing happens,{' '}
          <Button
            data-ga-download={`direct-download-button-${filename}`}
            id={`direct-download-button-${filename}`}
            variation='link'
            margin='0'
            padding='xxxs'
            onClick={() => downloadFile(filename as string)}
          >
            click here
          </Button>
          .
        </Text>
      </View>
    </Container>
  );
};

export default DatasetDownloadPage;
