import {
  Button,
  Card,
  Flex,
  Heading,
  Text,
  useTheme,
} from '@aws-amplify/ui-react';
import { FaFileArrowDown } from 'react-icons/fa6';

import styled from 'styled-components';

import datasetCards from '@/data/dataset-cards.json';
import { v4 as uuidv4 } from 'uuid';

const StyledButton = styled(Button)<{ $background: string; $inverse: string }>`
  justify-content: center;
  width: 40px;
  height: 40px;
  align-items: center;
  position: relative;
  padding: 0;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.10000000149011612);
  border-radius: 35px;
  background-color: ${(props) => props.$background};
  margin-top: auto;
  color: ${(props) => props.$inverse};
  &:hover {
    background-color: ${(props) => props.$inverse};
    color: ${(props) => props.$background};
  }
`;

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

  const download = async (file: string) => {
    try {
      const getUrlResult: { url: URL; expiresAt: Date } | null =
        await fetchUrl(file);
      window.open(getUrlResult?.url.href);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const getColor = (i) => {
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
        background: tokens.colors.pink[60].value,
        titleFont: tokens.colors.blue[60].value,
        font: tokens.colors.font.primary.value,
        button: tokens.colors.blue[60].value,
        buttonInverse: tokens.colors.pink[60].value,
      },
      {
        background: tokens.colors.green[60].value,
        titleFont: tokens.colors.blue[60].value,
        font: tokens.colors.font.primary.value,
        button: tokens.colors.blue[60].value,
        buttonInverse: tokens.colors.green[60].value,
      },
    ];

    const position = i % options.length;
    return options[position];
  };

  return datasetCards.datasetCards.map((card, i) => (
    <StyledCard
      $background={getColor(i).background}
      $font={getColor(i).font}
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
        <Heading level={3} fontSize='xl' color={getColor(i).titleFont}>
          {card.title}
        </Heading>
        <Text
          fontWeight='bold'
          fontSize='medium'
          marginTop='auto'
          color={getColor(i).titleFont}
        >
          {card.date}
        </Text>
        <Text fontSize='small' marginTop='auto' color='font.primary'>
          {card.description}
        </Text>
        <Flex grow={1}>
          <StyledButton
            $background={getColor(i).button}
            $inverse={getColor(i).buttonInverse}
            variation='primary'
            onClick={() => download(card.file)}
          >
            <FaFileArrowDown />
          </StyledButton>
        </Flex>
      </Flex>
    </StyledCard>
  ));
};

export default DataCard;
