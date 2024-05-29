## Styling Guidelines

Global styles found in `global.css` include typography styles
Sections following this pattern of styling:

```
    <section className='container section-padding'>
      <h2>Some text
        <span className='highlight' || className='alt-highlight'>Highlighted text</span>
      </h2>
      <div className='inner-container'>
        {children}
      </div>
    </section>
```

When possible, use components from [Amplify UI Components](https://ui.docs.amplify.aws/react/components)

When styling components,

1. If the component needs to be changed universally, edit the custom theme in `aws-theme-provider.tsx`. To check the options for modifying components, reference `ui-components/studioTheme.js`
2. Use component props.
3. If more styling is needed beyond component props provided, use `styled-components` [reference](https://styled-components.com/docs/basics#styling-any-component)

### Tokens

The Amplify UI theme provides 'tokens' for commonly accessed values that are used accross the app. Some props accept these tokens directly (most commonly spacing and colors), but this varies from component to component. Check the documenation.

Tokens can be accessed anywhere using the following import:

```
import { useTheme } from '@aws-amplify/ui-react';
const { tokens } = useTheme();

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

Red = "Strawberry" = #F2695D = `tokens.colors.red[60].value`
Orange = "Pecan" = #673934 = `tokens.colors.orange[60].value`
Yellow = "Daisy" = #FBD166 = `tokens.colors.yellow[60].value`
Green = "Matcha" = #B8D98D = `tokens.colors.green[60].value`
Teal = "Blue" = #5125E8 = `tokens.colors.teal[60].value`
Blue = "Berry" = #253D88 = `tokens.colors.blue[60].value`
Purple = "Plum" = #550D35 = `tokens.colors.plum[60].value`
Pink = "Blush" = #F6D9D7 = `tokens.colors.pink[60].value`

Primary colour = #F2695D = `tokens.colors.primary[60].value`
Secondary colour = #FBD166 = `tokens.colors.secondary[60].value`

Main text colour for light background (#000): `tokens.colors.font.primary.value`

Main text colour for dark background (#fff): `tokens.colors.font.inverse.value`

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
