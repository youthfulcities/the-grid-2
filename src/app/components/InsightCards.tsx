import insightCards from '@/data/insight-cards.json';
import {
  Button,
  Card,
  Flex,
  Heading,
  Text,
  View,
  useTheme,
} from '@aws-amplify/ui-react';

import _ from 'lodash';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa6';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
// import Dialogue from './Dialogue';

interface InsightCardProps {
  lng: string;
  maxLength?: number;
}

const ItalicText = styled(Text)`
  font-style: italic;
  transform: translateY(-10px);
  position: absolute;
  max-width: 100%;
`;

const StyledButton = styled(Button)<{
  $background: string;
  $inverse: string;
  $color: string;
}>`
  justify-content: center;
  border: none;
  width: 50px;
  height: 50px;
  align-items: center;
  right: var(--amplify-space-medium);
  bottom: var(--amplify-space-medium);
  padding: 0;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.10000000149011612);
  border-radius: 35px;
  background-color: ${(props) => props.$background};
  margin-top: auto;
  color: ${(props) => props.$color};
  z-index: 1;
  &:hover {
    background-color: ${(props) => props.$inverse};
    color: ${(props) => props.$background};
  }
`;

const StyledCard = styled(Card)<{ $background: string }>`
  background-color: ${(props) => props.$background};
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: '0 4px 8px rgba(0,0,0,0.1)';
`;

const InsightCards: React.FC<InsightCardProps> = ({ lng, maxLength }) => {
  const { tokens } = useTheme();
  const sortedInsightCards = _.orderBy(
    insightCards.cards,
    ['priority', 'date'],
    ['asc', 'desc']
  );
  const truncatedInsightCards = _.slice(
    sortedInsightCards,
    0,
    maxLength || sortedInsightCards.length
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
        titleFont: tokens.colors.font.primary.value,
        font: tokens.colors.font.primary.value,
        button: tokens.colors.blue[60].value,
        buttonInverse: tokens.colors.green[60].value,
      },
      {
        background: tokens.colors.pink[60].value,
        titleFont: tokens.colors.font.primary.value,
        font: tokens.colors.font.primary.value,
        button: tokens.colors.blue[60].value,
        buttonInverse: tokens.colors.pink[60].value,
      },
    ];

    const position = i % options.length;
    return options[position];
  };

  return (
    <View className='cards-container'>
      {truncatedInsightCards.map((card, index) => (
        <StyledCard
          key={uuidv4()}
          variation='elevated'
          $background={getColor(index).background}
        >
          <View>
            <Heading level={3} color={getColor(index).titleFont}>
              {lng === 'fr' ? card.titlefr || card.title : card.title}
            </Heading>
            <ItalicText
              as='em'
              fontSize='small'
              color={getColor(index).titleFont}
            >
              {lng === 'fr' ? card.datasetfr || card.dataset : card.dataset}
            </ItalicText>
            <Text
              fontWeight='bold'
              fontSize='medium'
              marginTop='xl'
              color={getColor(index).titleFont}
            >
              {lng === 'fr' ? card.datefr : card.date}
            </Text>
            <Text fontSize='small' color={getColor(index).titleFont}>
              {lng === 'fr' ? card.descfr || card.desc : card.desc}
            </Text>
          </View>
          <Flex justifyContent='flex-end' alignItems='flex-end'>
            {card.type === 'external' ? (
              <a href={card.link || '/'} target='_blank'>
                <StyledButton
                  $background={getColor(index).button}
                  $inverse={getColor(index).buttonInverse}
                  $color={getColor(index).buttonInverse}
                >
                  <FaArrowRight size={20} />
                </StyledButton>
              </a>
            ) : (
              <Link href={card.link || '/'} passHref>
                <StyledButton
                  $background={getColor(index).button}
                  $inverse={getColor(index).buttonInverse}
                  $color={getColor(index).buttonInverse}
                >
                  <FaArrowRight size={20} />
                </StyledButton>
              </Link>
            )}
          </Flex>
        </StyledCard>
      ))}
      {/* <Dialogue open={openDialogue} onClose={handleClose} /> */}
    </View>
  );
};

export default InsightCards;
