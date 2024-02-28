'use client';

import { Theme, ThemeProvider } from '@aws-amplify/ui-react';

const theme: Theme = {
  name: 'my-theme',
  tokens: {
    fonts: {
      default: {
        variable: { value: 'Gotham, Raleway, sans-serif' },
        static: { value: 'Gotham, Raleway, sans-serif' },
      },
    },
  },
};

console.log(theme);

export default function AWSThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
