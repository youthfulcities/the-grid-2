'use client';

import { useLoading } from '@/app/context/LoadingContext';
import { Loader } from '@aws-amplify/ui-react';

const LoadingBar = () => {
  const { downloadProgress } = useLoading();

  if (downloadProgress === null) return null;

  return (
    <Loader
      variation='linear'
      percentage={downloadProgress}
      isDeterminate
      position='fixed'
      top='0'
      left='0'
      width='100%'
      size='small'
      isPercentageTextHidden
      style={{ zIndex: 9999 }}
    />
  );
};

export default LoadingBar;
