'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeContextType = {
  colorMode: 'light' | 'dark' | 'system';
  setColorMode: (mode: 'light' | 'dark' | 'system') => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getSystemColorMode = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return 'dark';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [colorMode, setColorMode] = useState<'light' | 'dark' | 'system'>(
    'dark'
  );

  useEffect(() => {
    if (colorMode === 'system') {
      const systemMode = getSystemColorMode();
      setColorMode(systemMode);
    }
  }, [colorMode]);

  const value = React.useMemo(
    () => ({ colorMode, setColorMode }),
    [colorMode, setColorMode]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
