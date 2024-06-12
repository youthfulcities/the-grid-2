import { Button, Card, Heading, Text, useTheme } from '@aws-amplify/ui-react';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa6';
import styled from 'styled-components';

interface InsightCardProps {
  title: string;
  dataset: string;
  href: string;
  date: number;
  description: string;
  color: string;
}

const ItalicText = styled(Text)`
  font-style: italic;
  transform: translateY(-10px);
  position: absolute;
`;

const StyledButton = styled(Button)`
  justify-content: center;
  border: none;
  width: 50px;
  height: 50px;
  align-items: center;
  position: absolute;
  right: var(--amplify-space-medium);
  bottom: var(--amplify-space-medium);
  padding: 0;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.10000000149011612);
  border-radius: 35px;
  background-color: var(--amplify-colors-blue-60);
  margin-top: auto;
  color: var(--amplify-colors-font-inverse);
  z-index: 1;
  &:hover {
    background-color: inherit;
  }
`;

const InsightCard: React.FC<InsightCardProps> = ({
  title,
  href,
  dataset,
  date,
  description,
  color,
}) => {
  const { tokens } = useTheme();

  return (
    <Card
      variation='elevated'
      style={{
        backgroundColor: color,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        height: '115%',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Heading level={3}>{title}</Heading>
      <ItalicText
        as='em'
        fontSize='small'
        marginTop='auto'
        color='font.primary'
      >
        {dataset}
      </ItalicText>
      <Text
        fontWeight='bold'
        fontSize='medium'
        marginTop='xl'
        color='font.primary'
      >
        {date}
      </Text>
      <Text fontSize='small' marginTop='auto' color='font.primary'>
        {description}
      </Text>
      <Link href={href} passHref>
        <StyledButton>
          <FaArrowRight size={20} />
        </StyledButton>
      </Link>
    </Card>
  );
};

export default InsightCard;
