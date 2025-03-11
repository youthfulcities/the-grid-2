## Getting Started

This is a Next.js (App router) Typescript application with AWS Amplify.

Note: The name of the portal has been changed to "Youth Data Lab" but is referred to on Github as the-grid-2.

To run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Organization

If you havent worked with Next.js (App router) before, take some time to familiarize yourself with its unique structure: [https://nextjs.org/docs/13/app/building-your-application/routing/colocation]().

Basically, the folder structure determines the routing paths, and any folder in the app directory with a `page.tsx` file will be routable. `layout.tsx` automatically wrap `page.tsx` files. This is a multilingual app facilitated by `react-i18next`. All routeable pages are found in the `[lng]` directory. Therefore, the equivalent of an `index.js` file would be `@/app/[lng]/page.tsx`.

Components which are **tightly coupled** with a specific page (i.e., they are not reused in multiple components) should be co-located in that page's folder.

The `@/app/[lng]/components` folder is for components unique to `@/app/[lng]/page.tsx `and `@/app/[lng]/layout.tsx.`

The `@/app/components` folder is for reusable components used in multiple pages.

The `@/app/api` folder is a Next.js specific folder for managing api routes. [https://nextjs.org/docs/13/app/building-your-application/routing/route-handlers]().

The `@/app/i18n` folder is where all the text/coy is stored for English and French.

Everything else is stored in src directory.

`@/data` is for small jsons mapping to component data.

`@/hooks` is for reusable React hooks.

`@/lib` is for other helper reusable helper functions.

## Styling Guidelines

Global styles found in `global.css` include typography styles, containers, and shadows. Some of these are legacy styles from the original site on Opendatasoft. Eventually, we want to pull out as many css classess as possible out of `global.css` into components, but this can be done on a gradual basis.

Sections currently follow this pattern of styling:

```
<Container>
<section className='container section-padding'>
    <h2>Some text
      <span className='highlight' || className='alt-highlight'>Highlighted text</span>
    </h2>
    <div className='inner-container'>
      {children}
    </div>
  </section>
<Container>
```

When possible, use components from [Amplify UI Components](https://ui.docs.amplify.aws/react/components)

When styling components,

1. If the component needs to be changed universally, edit the custom theme in `aws-theme-provider.tsx`. To check the options for modifying components, reference `ui-components/studioTheme.js`
2. Sometimes it makes sense to set global styles in `global.css`, for example for heading styles. Theme tokens can be accessed as css variables in `global.css`. [reference](https://ui.docs.amplify.aws/react/theming/default-theme/colors).
3. Use component props. [Amplify UI Components](https://ui.docs.amplify.aws/react/components)
4. If more styling is needed beyond component props provided, use `styled-components` [reference](https://styled-components.com/docs/basics#styling-any-component). Styled components can also reference theme tokens via css variables. [reference](https://ui.docs.amplify.aws/react/theming/default-theme/colors). Other dynamic values can be passed into styled components via props. [reference](https://styled-components.com/docs/advanced)

### Tokens

The Amplify UI theme provides 'tokens' for commonly accessed values that are used accross the app. Some props accept these tokens directly (most commonly spacing and colors), but this varies from component to component. Check the documenation.

Tokens can be accessed anywhere using the following import:

```
import { useTheme } from '@aws-amplify/ui-react';
const { tokens } = useTheme();

```

Tokens can also be accessed as css variables where `tokens.foo.bar.value` becomes `--amplify-foo-bar`.

#### Colours

These snippets can be used to access common theme variables.

```
import { useTheme } from '@aws-amplify/ui-react';
const { tokens } = useTheme();
```

The "pure" version of a colour will have a value of 60. Values 80, 90, 100 are shades (darker) and and 40, 20, 10 are tints (lighter).

[Quick hex codes for YC colours](https://docs.google.com/spreadsheets/d/1Q38sfTNMVMZ1TsNbtgvOZH-q9PJscXJFO8svO-AbLPo/edit#gid=0)
[YC Brand Guidelines](https://drive.google.com/file/d/16C9ISbyFnl8P_tc3L69w4G8JfN-CjIFM/view?usp=drive_link)
[THE GRID Brand Guidelines](https://drive.google.com/file/d/1BN1ssQV3_dpYDcpgx0jLPb7QHRHzeR-i/view?usp=drive_link)

Red = "Strawberry" = #F2695D = `tokens.colors.red[60].value` = `--amplify-colors-red-60`

Orange = "Pecan" = #673934 = `tokens.colors.orange[60].value `= `--amplify-colors-orange-60 `

Yellow = "Daisy" = #FBD166 =`tokens.colors.yellow[60].value `=`--amplify-colors-yellow-60 `

Green = "Matcha" = #B8D98D =`tokens.colors.green[60].value `=`--amplify-colors-green-60 `

Teal = "Blue" = #5125E8 =`tokens.colors.teal[60].value `=`--amplify-colors-teal-60 `

Blue = "Berry" = #253D88 =`tokens.colors.blue[60].value `=`--amplify-colors-blue-60 `

Purple = "Plum" = #550D35 =`tokens.colors.plum[60].value ` `--amplify-colors-plum-60 `

Pink = "Blush" = #F6D9D7 =`tokens.colors.pink[60].value `=`--amplify-colors-pink-60`

Primary colour = #F2695D = `tokens.colors.primary[60].value` = `--amplify-colors-primary-60`

Secondary colour = #FBD166 = `tokens.colors.secondary[60].value`= `--amplify-colors-secondary-60`

Main text colour for light background (#000): `tokens.colors.font.primary.value` = `--amplify-colors-font-primary`

Main text colour for dark background (#fff): `tokens.colors.font.inverse.value` = `--amplify-colors-font-inverse`

###### All accessible colours:

```
tokens: {
    colors: {
      red: {
        10: { value: "hsl(5, 66%, 90%)" },
        20: { value: "hsl(5, 74%, 84%)" },
        40: { value: "hsl(5, 89%, 76%)" },
        60: { value: "hsl(5, 85%, 66%)" },
        80: { value: "hsl(5, 71%, 59%)" },
        90: { value: "hsl(5, 63%, 52%)" },
        100: { value: "hsl(5, 70%, 42%)" },
      },
      orange: {
        10: { value: "hsl(6, 14%, 72%)" },
        20: { value: "hsl(6, 15%, 58%)" },
        40: { value: "hsl(6, 18%, 44%)" },
        60: { value: "hsl(6, 33%, 30%)" },
        80: { value: "hsl(6, 32%, 24%)" },
        90: { value: "hsl(6, 33%, 18%)" },
        100: { value: "hsl(6, 32%, 12%)" },
      },
      yellow: {
        10: { value: "hsl(43, 100%, 96%)" },
        20: { value: "hsl(43, 100%, 91%)" },
        40: { value: "hsl(43, 85%, 78%)" },
        60: { value: "hsl(43, 95%, 69%)" },
        80: { value: "hsl(43, 71%, 57%)" },
        90: { value: "hsl(43, 78%, 44%)" },
        100: { value: "hsl(43, 100%, 32%)" },
      },
      green: {
        10: { value: "hsl(86, 70%, 94%)" },
        20: { value: "hsl(86, 64%, 87%)" },
        40: { value: "hsl(86, 53%, 77%)" },
        60: { value: "hsl(86, 50%, 70%)" },
        80: { value: "hsl(86, 43%, 57%)" },
        90: { value: "hsl(86, 49%, 40%)" },
        100: { value: "hsl(86, 76%, 26%)" },
      },
      teal: {
        10: { value: "hsl(253, 81%, 81%)" },
        20: { value: "hsl(254, 81%, 72%)" },
        40: { value: "hsl(253, 81%, 62%)" },
        60: { value: "hsl(254, 81%, 53%)" },
        80: { value: "hsl(253, 72%, 42%)" },
        90: { value: "hsl(254, 73%, 32%)" },
        100: { value: "hsl(253, 72%, 21%)" },
      },
      blue: {
        10: { value: "hsl(226, 29%, 74%)" },
        20: { value: "hsl(225, 30%, 60%)" },
        40: { value: "hsl(226, 33%, 47%)" },
        60: { value: "hsl(225, 57%, 34%)" },
        80: { value: "hsl(226, 57%, 27%)" },
        90: { value: "hsl(225, 58%, 20%)" },
        100: { value: "hsl(226, 57%, 14%)" },
      },
      purple: {
        10: { value: "hsl(327, 40%, 67%)" },
        20: { value: "hsl(327, 33%, 45%)" },
        40: { value: "hsl(327, 50%, 31%)" },
        60: { value: "hsl(327, 73%, 19%)" },
        80: { value: "hsl(327, 84%, 14%)" },
        90: { value: "hsl(327, 91%, 11%)" },
        100: { value: "hsl(327, 100%, 5%)" },
      },
      pink: {
        10: { value: "hsl(5, 60%, 96%)" },
        20: { value: "hsl(3, 66%, 94%)" },
        40: { value: "hsl(5, 64%, 92%)" },
        60: { value: "hsl(4, 63%, 90%)" },
        80: { value: "hsl(5, 18%, 72%)" },
        90: { value: "hsl(3, 8%, 54%)" },
        100: { value: "hsl(5, 7%, 36%)" },
      },
      neutral: {
        10: { value: "hsl(38, 36%, 98%)" },
        20: { value: "hsl(38, 16%, 91%)" },
        40: { value: "hsl(38, 13%, 83%)" },
        60: { value: "hsl(38, 4%, 66%)" },
        80: { value: "hsl(38, 3%, 39%)" },
        90: { value: "hsl(38, 3%, 12%)" },
        100: { value: "hsl(0, 0%, 0%)" },
      },
      brand: {
        primary: {
          10: { value: "{colors.red.10.value}" },
          20: { value: "{colors.red.20.value}" },
          40: { value: "{colors.red.40.value}" },
          60: { value: "{colors.red.60.value}" },
          80: { value: "{colors.red.80.value}" },
          90: { value: "{colors.red.90.value}" },
          100: { value: "{colors.red.100.value}" },
        },
        secondary: {
          10: { value: "{colors.yellow.10.value}" },
          20: { value: "{colors.yellow.20.value}" },
          40: { value: "{colors.yellow.40.value}" },
          60: { value: "{colors.yellow.60.value}" },
          80: { value: "{colors.yellow.80.value}" },
          90: { value: "{colors.yellow.90.value}" },
          100: { value: "{colors.yellow.100.value}" },
        },
      },
      font: {
        primary: { value: "{colors.neutral.100.value}" },
        secondary: { value: "{colors.neutral.90.value}" },
        tertiary: { value: "{colors.neutral.80.value}" },
        disabled: { value: "{colors.font.tertiary.value}" },
        inverse: { value: "{colors.white.value}" },
        interactive: { value: "{colors.brand.primary.80.value}" },
        hover: { value: "{colors.brand.primary.90.value}" },
        focus: { value: "{colors.brand.primary.100.value}" },
        active: { value: "{colors.brand.primary.100.value}" },
        info: { value: "{colors.blue.90.value}" },
        warning: { value: "{colors.yellow.60.value}" },
        error: { value: "{colors.red.60.value}" },
        success: { value: "{colors.green.60.value}" },
      },
      background: {
        primary: { value: "hsl(0, 0%, 13%)" },
        secondary: { value: "{colors.neutral.10.value}" },
        tertiary: { value: "{colors.neutral.20.value}" },
        disabled: { value: "{colors.background.tertiary.value}" },
        info: { value: "{colors.blue.20.value}" },
        warning: { value: "{colors.yellow.20.value}" },
        error: { value: "{colors.red.20.value}" },
        success: { value: "{colors.green.20.value}" },
      },
      border: {
        primary: { value: "{colors.red.60.value}" },
        secondary: { value: "{colors.neutral.40.value}" },
        tertiary: { value: "{colors.neutral.20.value}" },
        disabled: { value: "{colors.border.tertiary.value}" },
        focus: { value: "{colors.brand.primary.60.value}" },
        error: { value: "{colors.red.60.value}" },
      },
      shadow: {
        primary: { value: "hsla(210, 50%, 10%, 0.25)" },
        secondary: { value: "hsla(210, 50%, 10%, 0.15)" },
        tertiary: { value: "hsla(210, 50%, 10%, 0.05)" },
      },
      overlay: {
        10: { value: "hsla(0, 0%, 0%, 0.1)" },
        20: { value: "hsla(0, 0%, 0%, 0.2)" },
        30: { value: "hsla(0, 0%, 0%, 0.3)" },
        40: { value: "hsla(0, 0%, 0%, 0.4)" },
        50: { value: "hsla(0, 0%, 0%, 0.5)" },
        60: { value: "hsla(0, 0%, 0%, 0.6)" },
        70: { value: "hsla(0, 0%, 0%, 0.7)" },
        80: { value: "hsla(0, 0%, 0%, 0.8)" },
        90: { value: "hsla(0, 0%, 0%, 0.9)" },
      },
      black: { value: "hsl(0, 0%, 0%)" },
      white: { value: "hsl(0, 0%, 100%)" },
      transparent: { value: "transparent" },
    },
}
```

#### Spacing

`tokens.space.zero.value`

```
  tokens: {
    space: {
      zero: { value: "0" },
      xxxs: { value: "0.25rem" },
      xxs: { value: "0.375rem" },
      xs: { value: "0.5rem" },
      small: { value: "0.75rem" },
      medium: { value: "1rem" },
      large: { value: "1.5rem" },
      xl: { value: "2.0rem" },
      xxl: { value: "3.0rem" },
      xxxl: { value: "4.5rem" }
    }
```

##### Pixels to REM

1px = 0.0625rem
2px = 0.125rem
3px = 0.1875rem
4px = 0.25rem
5px = 0.3125rem
6px = 0.375rem
8px = 0.5rem
10px = 0.625rem
12px = 0.75rem
14px = 0.875rem
15px = 0.9375rem
16px = 1rem
18px = 1.125rem
20px = 1.25rem
24px = 1.5rem
25px = 1.5625rem
28px = 1.75rem
32px = 2rem
36px = 2.25rem
40px =.5rem
44px = 2.75rem
48px = 3rem
50px = 3.125rem
56px = 3.5rem
64px = 4rem
72px = 4.5rem
75px = 4.6875rem
80px = 5rem
90px = 5.625rem
100px = 6.25rem

#### Other useful tokens

```
tokens: {
  borderWidths: {
        small: { value: "3px" },
        medium: { value: "5px" },
        large: { value: "7px" },
      },
      fontSizes: {
        xxxs: { value: "0.375rem" },
        xxs: { value: "0.5rem" },
        xs: { value: "0.75rem" },
        small: { value: "0.875rem" },
        medium: { value: "1.125rem" },
        large: { value: "1.5rem" },
        xl: { value: "1.875rem" },
        xxl: { value: "2.25rem" },
        xxxl: { value: "3.375rem" },
        xxxxl: { value: "5rem" },
      },
      fontWeights: {
        hairline: { value: "100" },
        thin: { value: "200" },
        light: { value: "300" },
        normal: { value: "400" },
        medium: { value: "500" },
        semibold: { value: "600" },
        bold: { value: "700" },
        extrabold: { value: "800" },
        black: { value: "900" },
      },
      lineHeights: {
        small: { value: "1.25" },
        medium: { value: "1.5" },
        large: { value: "2" },
      },
      opacities: {
        0: { value: "0" },
        10: { value: "0.1" },
        20: { value: "0.2" },
        30: { value: "0.3" },
        40: { value: "0.4" },
        50: { value: "0.5" },
        60: { value: "0.6" },
        70: { value: "0.7" },
        80: { value: "0.8" },
        90: { value: "0.9" },
        100: { value: "1" },
      },
      outlineOffsets: {
        small: { value: "1px" },
        medium: { value: "2px" },
        large: { value: "3px" },
      },
      outlineWidths: {
        small: { value: "1px" },
        medium: { value: "2px" },
        large: { value: "3px" },
      },
      radii: {
        xs: { value: "0" },
        small: { value: "0" },
        medium: { value: "0" },
        large: { value: "1rem" },
        xl: { value: "2rem" },
        xxl: { value: "4rem" },
        xxxl: { value: "8rem" },
      },
      shadows: {
        small: {
          value: {
            offsetX: "0px",
            offsetY: "2px",
            blurRadius: "4px",
            color: "{colors.shadow.tertiary.value}",
          },
        },
        medium: {
          value: {
            offsetX: "0px",
            offsetY: "2px",
            blurRadius: "6px",
            color: "{colors.shadow.secondary.value}",
          },
        },
        large: {
          value: {
            offsetX: "0px",
            offsetY: "4px",
            blurRadius: "12px",
            color: "{colors.shadow.primary.value}",
          },
        },
      },
      time: {
        short: { value: "100ms" },
        medium: { value: "250ms" },
        long: { value: "500ms" },
      },
      transforms: {
        slideX: {
          small: { value: "translateX(0.5em)" },
          medium: { value: "translateX(1em)" },
          large: { value: "translateX(2em)" },
        },
      },
    },
    breakpoints: {
      values: {
        base: 0,
        small: 480,
        medium: 768,
        large: 992,
        xl: 1280,
        xxl: 1536,
      },
      defaultBreakpoint: "base",
    },
  }
```

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Testing

This application uses Jest for the testing library.

Run `npm test -- --watch --silent --coverage` to run the test environment and pass flags to Jest.

Quirks:

Most mocks for SSR and hooks are global and found in `setupTests.js`. However, the `amplifyconfiguration.json` mock does not work unless it's imported into each test file that calls it. It will work in your local environment but not in a virutal environment since the `amplifyconfiguration.json` is not commited to source control. Using a relative path for this file does not work.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
