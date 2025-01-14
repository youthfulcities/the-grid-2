'use client';

import { useThemeContext } from '@/app/context/ThemeContext';
import studioTheme from '@/ui-components/studioTheme';
import { createTheme, ThemeProvider } from '@aws-amplify/ui-react';

const theme = createTheme(
  {
    name: 'my-theme',
    overrides: [
      {
        colorMode: 'light',
        tokens: {
          colors: {
            background: {
              primary: { value: '#ffffff' },
            },
            font: {
              primary: { value: '#000000' },
              inverse: { value: '#ffffff' },
            },
            brand: {
              primary: {
                10: { value: '{colors.red.10.value}' },
                20: { value: '{colors.red.20.value}' },
                40: { value: '{colors.red.40.value}' },
                60: { value: '{colors.red.60.value}' },
                80: { value: '{colors.red.80.value}' },
                90: { value: '{colors.red.90.value}' },
                100: { value: '{colors.red.100.value}' },
              },
              secondary: {
                10: { value: '{colors.blue.10.value}' },
                20: { value: '{colors.blue.20.value}' },
                40: { value: '{colors.blue.40.value}' },
                60: { value: '{colors.blue.60.value}' },
                80: { value: '{colors.blue.80.value}' },
                90: { value: '{colors.blue.90.value}' },
                100: { value: '{colors.blue.100.value}' },
              },
            },
          },
          components: {
            text: {
              color: { value: '{colors.font.primary.value}' },
            },
          },
        },
      },
      {
        colorMode: 'dark',
        tokens: {
          components: {
            togglebutton: {
              borderColor: { value: '{colors.border.primary.value}' },
              color: { value: '{colors.font.primary.value}' },
              _hover: {
                backgroundColor: { value: '{colors.neutral.60.value}' },
              },
              _focus: {
                borderColor: { value: '{colors.brand.secondary.80.value}' },
                color: { value: '{colors.font.primary.value}' },
              },
              _active: {
                backgroundColor: { value: '{colors.transparent.value}' },
              },
              _disabled: {
                backgroundColor: { value: '{colors.transparent.value}' },
                borderColor: { value: '{colors.border.secondary.value}' },
                color: { value: '{colors.font.disabled.value}' },
              },
            },
          },
          colors: {
            font: {
              primary: { value: '#ffffff' },
              inverse: { value: '#ffffff' },
            },
          },
        },
      },
    ],
    tokens: {
      space: {
        xxxl: { value: '7rem' },
        relative: {
          xxxl: { value: '7rem' },
        },
      },
      fonts: {
        default: {
          variable: { value: 'Gotham Narrow Book, Raleway, sans-serif' },
          static: { value: 'Gotham Narrow Book, Raleway, sans-serif' },
        },
      },
      components: {
        field: {
          gap: { value: '{space.xxxxs.value}' },
          label: { color: { value: '{colors.font.inverse.value}' } },
        },
        card: {
          backgroundColor: { value: '{colors.brand.primary.60.value}' },
          padding: { value: '{space.large.value}' },
        },
        alert: {
          success: {
            color: { value: '{colors.green.90.value}' },
          },
          warning: {
            color: { value: 'colors.red.90.value' },
          },
        },
        button: {
          primary: {
            _hover: {
              backgroundColor: {
                value: '{colors.brand.primary.100.value}',
              },
              color: { value: '{colors.font.inverse.value}' },
            },
          },
        },
        tabs: {
          item: {
            color: { value: '{colors.font.inverse.value}' },
            _active: {
              color: { value: '{colors.brand.primary.60.value}' },
            },
          },
        },
        placeholder: {
          transitionDuration: { value: '1250ms' },
          borderRadius: { value: '{radii.large}' },
          startColor: { value: '{colors.neutral.90}' },
          endColor: { value: '{colors.neutral.80}' },
        },
        fieldcontrol: {
          borderColor: { value: '{components.button.border.color.value}' },
        },
        select: {
          color: { value: '{colors.font.inverse.value}' },
          option: {
            color: { value: '{colors.font.inverse.value}' },
          },
        },
      },
      // these colour definitions had to be made because typescript wasn't accepting the colors.brand notation in styled components, and for some reason the default primary and secondary colours weren't matching the brand theme
      colors: {
        primary: {
          '10': {
            value: '{colors.brand.primary.10.value}',
          },
          '20': {
            value: '{colors.brand.primary.20.value}',
          },
          '40': {
            value: '{colors.brand.primary.40.value}',
          },
          '60': {
            value: '{colors.brand.primary.60.value}',
          },
          '80': {
            value: '{colors.brand.primary.80.value}',
          },
          '90': {
            value: '{colors.brand.primary.90.value}',
          },
          '100': {
            value: '{colors.brand.primary.100.value}',
          },
        },
        secondary: {
          '10': {
            value: '{colors.brand.secondary.10.value}',
          },
          '20': {
            value: '{colors.brand.secondary.20.value}',
          },
          '40': {
            value: '{colors.brand.secondary.40.value}',
          },
          '60': {
            value: '{colors.brand.secondary.60.value}',
          },
          '80': {
            value: '{colors.brand.secondary.80.value}',
          },
          '90': {
            value: '{colors.brand.secondary.90.value}',
          },
          '100': {
            value: '{colors.brand.secondary.100.value}',
          },
        },
      },
    },
  },
  studioTheme
);

const AWSThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { colorMode } = useThemeContext();
  return (
    <ThemeProvider theme={theme} colorMode={colorMode}>
      {children}
    </ThemeProvider>
  );
};

export default AWSThemeProvider;
