import cityCards from '@/data/city-cards.json';
import { Flex, Heading, Text, View, useTheme } from '@aws-amplify/ui-react';
import styled from 'styled-components';
import useTranslation from '../../i18n/client';

// .outline-text {
// color: var(--light-blue);
// font-family: 'Gotham Narrow Black';
// font-style: normal;
// font-size: 6.5rem;
// line-height: 6.5rem;
// -webkit-text-fill-color: var(--blue);
// -webkit-text-stroke-width: 2px;
// -webkit-text-stroke-color: var(--light-blue);
// }

// .large-text {
//   color: var(--blue);
//   font-family: 'Gotham Narrow Black';
//   font-style: normal;
//   font-size: 6.5rem;
//   line-height: 6.5rem;
// }

// @media screen and (max-width: 992px) {
//   .outline-text {
//     font-size: 5rem;
//     line-height: 5rem;
//   }

//   .large-text {
//     font-size: 5rem;
//     line-height: 5rem;
//   }
// }

const BarBackground = styled(View)<{ $background: string; $space: string }>`
  width: 100%;
  padding: ${(props) => props.$space} 0;
  background-color: ${(props) => props.$background};
`;

const Fact = styled(View)<{ $space: string }>`
  margin: ${(props) => props.$space} 0;
`;

const OutlineText = styled(Text)<{
  $outlineColor: string;
  $innerColor: string;
}>`
  color: ${(props) => props.$outlineColor};
  font-family: 'Gotham Narrow Black';
  font-style: normal;
  font-size: 6.5rem;
  line-height: 6.5rem;
  -webkit-text-fill-color: ${(props) => props.$innerColor};
  -webkit-text-stroke-width: 2px;
  -webkit-text-stroke-color: ${(props) => props.$outlineColor};
`;

const Banner: React.FC<{ lng: string }> = ({ lng }) => {
  const { t } = useTranslation(lng, 'translation');
  const { tokens } = useTheme();

  return (
    <BarBackground
      className='soft-shadow'
      $space={tokens.space.medium.value}
      $background={tokens.colors.primary[60].value}
      as='section'
    >
      <Flex
        className='short-container'
        justifyContent='space-between'
        alignItems='center'
        direction='row'
        wrap='wrap'
        gap='1rem'
      >
        <Fact $space={tokens.space.medium.value}>
          <Heading level={4}>{t('datasets')}</Heading>
          <OutlineText
            as='h3'
            $innerColor={tokens.colors.primary[60].value}
            $outlineColor={tokens.colors.font.primary.value}
          >
            11
          </OutlineText>
        </Fact>
        <Fact $space={tokens.space.medium.value}>
          <Heading level={4}>{t('cities')}</Heading>
          <OutlineText
            as='h3'
            $innerColor={tokens.colors.primary[60].value}
            $outlineColor={tokens.colors.font.primary.value}
          >
            {cityCards.cityCards.length}
          </OutlineText>
        </Fact>
        <Fact $space={tokens.space.medium.value}>
          <Heading level={4}>{t('records')}</Heading>
          <OutlineText
            as='h3'
            $innerColor={tokens.colors.primary[60].value}
            $outlineColor={tokens.colors.font.primary.value}
          >
            454k
          </OutlineText>
        </Fact>
      </Flex>
    </BarBackground>
  );
};

export default Banner;
