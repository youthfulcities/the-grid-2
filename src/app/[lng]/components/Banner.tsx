import FadeInUp from '@/app/components/FadeInUp';
import useTranslation from '@/app/i18n/client';
import datasetCards from '@/data/dataset-cards.json';
import { Flex, Heading, Text, View, useTheme } from '@aws-amplify/ui-react';
import styled from 'styled-components';

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
  font-size: 5rem;
  line-height: 5.5rem;
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
          <Heading level={4} color={tokens.colors.font.primary.value}>
            {t('datasets-literal')}
          </Heading>
          <FadeInUp>
            <OutlineText
              as='h3'
              $innerColor={tokens.colors.primary[60].value}
              $outlineColor={tokens.colors.font.primary.value}
            >
              {datasetCards.datasetCards.length}
            </OutlineText>
          </FadeInUp>
        </Fact>
        <Fact $space={tokens.space.medium.value}>
          <Heading level={4} color={tokens.colors.font.primary.value}>
            {t('cities')}
          </Heading>
          <FadeInUp>
            <OutlineText
              as='h3'
              $innerColor={tokens.colors.primary[60].value}
              $outlineColor={tokens.colors.font.primary.value}
            >
              31 000
            </OutlineText>
          </FadeInUp>
        </Fact>
        <Fact $space={tokens.space.medium.value}>
          <Heading level={4} color={tokens.colors.font.primary.value}>
            {t('records')}
          </Heading>
          <FadeInUp>
            <OutlineText
              as='h3'
              $innerColor={tokens.colors.primary[60].value}
              $outlineColor={tokens.colors.font.primary.value}
            >
              400 000
            </OutlineText>
          </FadeInUp>
        </Fact>
      </Flex>
    </BarBackground>
  );
};

export default Banner;
