import { Button, Card, Flex, Heading } from '@aws-amplify/ui-react';
import { motion } from 'framer-motion';
import React from 'react';
import styled from 'styled-components';

export interface ComparisonCardProps {
  title: string;
  children?: React.ReactNode;
  onRemove?: (id: string) => void;
}

const StyledMotionCard = styled(motion(Card))`
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
`;

const ComparisonCard: React.FC<ComparisonCardProps> = ({
  title,
  onRemove,
  children,
}) => (
  <StyledMotionCard
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.03 }}
    transition={{ duration: 0.2 }}
  >
    <Flex justifyContent='space-between' marginBottom='xl'>
      <Heading level={5} color='font.primary'>
        {title}
      </Heading>
      {onRemove && (
        <Button
          size='small'
          margin='small'
          variation='primary'
          onClick={() => onRemove(title)}
        >
          Remove
        </Button>
      )}
    </Flex>
    <Flex
      direction='column'
      justifyContent='space-between'
      alignItems='stretch'
      gap='xxs'
    >
      {children}
    </Flex>
  </StyledMotionCard>
);

export default ComparisonCard;
