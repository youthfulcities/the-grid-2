import datasetCards from '@/data/dataset-cards.json';
import { Card, Flex, Heading, Text, useTheme } from '@aws-amplify/ui-react';
import _ from 'lodash';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import DataCardButton from './DataCardButton';

interface DatasetCard {
  title: string;
  date: string;
  description: string;
  file: string;
  className: string;
}

const StyledCard = styled(Card)<{ $background: string; $font: string }>`
  min-height: 300px;
  position: relative;
  display: flex;
  background-color: ${(props) => props.$background};
  color: ${(props) => props.$font};
`;

interface AppProps {
  fetchUrl: (url: string) => Promise<{ url: URL; expiresAt: Date } | null>;
}

const DataCard = ({ fetchUrl }: AppProps) => {
  const { tokens } = useTheme();

  const sortedDatasetCards = _.orderBy(
    datasetCards.datasetCards,
    'date',
    'desc'
  );

  const getColor = (i: number) => {
    //array of all the different card color patterns
    const options = [
      {
        background: tokens.colors.red[60].value,
        titleFont: tokens.colors.font.primary.value,
        font: tokens.colors.font.primary.value,
        button: tokens.colors.yellow[60].value,
        buttonInverse: tokens.colors.red[60].value,
      },
      {
        background: tokens.colors.yellow[60].value,
        titleFont: tokens.colors.font.primary.value,
        font: tokens.colors.font.primary.value,
        button: tokens.colors.red[60].value,
        buttonInverse: tokens.colors.yellow[60].value,
      },
      {
        background: tokens.colors.green[60].value,
        titleFont: tokens.colors.blue[60].value,
        font: tokens.colors.font.primary.value,
        button: tokens.colors.blue[60].value,
        buttonInverse: tokens.colors.green[60].value,
      },
      {
        background: tokens.colors.pink[60].value,
        titleFont: tokens.colors.blue[60].value,
        font: tokens.colors.font.primary.value,
        button: tokens.colors.blue[60].value,
        buttonInverse: tokens.colors.pink[60].value,
      },
    ];

    const position = i % options.length;
    return options[position];
  };

  return sortedDatasetCards.map((card: DatasetCard, index: number) => (
    <StyledCard
      $background={getColor(index).background}
      $font={getColor(index).font}
      key={uuidv4()}
      variation='elevated'
    >
      <div
        className={`card-img clip ${card.className}`}
        style={{
          position: 'absolute',
          top: '-1px',
          transform: `translateX(-${tokens.space.large.value})`,
        }}
      />
      <Flex direction='column' paddingTop={150}>
        <Heading level={3} fontSize='xl' color={getColor(index).titleFont}>
          {card.title}
        </Heading>
        <Text
          fontWeight='bold'
          fontSize='medium'
          marginTop='auto'
          color={getColor(index).titleFont}
        >
          {card.date}
        </Text>
        <Text fontSize='small' marginTop='auto' color='font.primary'>
          {card.description}
        </Text>
        <Flex grow={1}>
          <DataCardButton
            getColor={getColor}
            index={index}
            fetchUrl={fetchUrl}
            card={card}
          />
        </Flex>
      </Flex>
    </StyledCard>
  ));
};

export default DataCard;
