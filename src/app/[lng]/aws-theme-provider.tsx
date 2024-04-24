'use client';

import studioTheme from '@/ui-components/studioTheme';
import { createTheme, ThemeProvider } from '@aws-amplify/ui-react';

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
        button: {},
      },
    },
  },
  studioTheme
);

const AWSThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export default AWSThemeProvider;
