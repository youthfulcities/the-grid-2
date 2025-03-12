'use client';

import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

interface LoadingContextProps {
  downloadProgress: number | null;
  setDownloadProgress: (progress: number | null) => void;
}

const LoadingContext = createContext<LoadingContextProps | undefined>(
  undefined
);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  const value = useMemo(
    () => ({ downloadProgress, setDownloadProgress }),
    [downloadProgress]
  );

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextProps => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
