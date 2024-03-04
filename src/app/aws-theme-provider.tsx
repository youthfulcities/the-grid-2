'use client';

import { createTheme, ThemeProvider } from '@aws-amplify/ui-react';
import studioTheme from '../ui-components/studioTheme';

const theme = createTheme(
  {
    name: 'my-theme',
    tokens: {
      fonts: {
        default: {
          variable: { value: 'Gotham Narrow, Raleway, sans-serif' },
          static: { value: 'Gotham Narrow, Raleway, sans-serif' },
        },
      },
      components: {
        card: {
          backgroundColor: { value: '{colors.brand.primary.60.value}' },
          padding: { value: '{space.large.value}' },
        },
      },
    },
  },
  studioTheme
);

export default function AWSThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
