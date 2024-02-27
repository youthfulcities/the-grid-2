'use client';

import { ThemeProvider, Theme } from '@aws-amplify/ui-react';

const theme: Theme = {
  name: 'my-theme',
  tokens: {
    colors: {
      font: {
        primary: { value: '#008080' },
        // ...
      },
    },
  },
};

export default function AWSThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
