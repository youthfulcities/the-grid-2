import { useDimensions } from '@/hooks/useDimensions';
import { Button, Card, Flex, Heading, Text } from '@aws-amplify/ui-react';
import { motion } from 'framer-motion';
import React, { forwardRef, useRef } from 'react';
import styled from 'styled-components';
import { ProfileData } from '../types/ProfileTypes';
import ageMap from '../utils/ageMap';
import genderMap from '../utils/genderMap.json';
import occupationMap from '../utils/occupationMap.json';

export interface ComparisonCardProps {
  title: string;
  children?: (width: number) => React.ReactNode;
  onRemove?: (id: string) => void;
  first?: boolean;
  profile?: ProfileData;
}

const StyledMotionCard = styled(motion(Card))`
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  width: 100%;
`;

const ComparisonCard = forwardRef<HTMLDivElement, ComparisonCardProps>(
  ({ title, onRemove, children, first = false, profile }, externalRef) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (externalRef as React.RefObject<HTMLDivElement>) ?? internalRef;
    const { width } = useDimensions(ref);
    return (
      <StyledMotionCard
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        ref={ref}
      >
        <Flex
          marginBottom='xl'
          direction='column'
          gap='xxxs'
          width='100%'
          alignItems='stretch'
        >
          <Flex justifyContent='space-between' width='100%' alignItems='center'>
            <Heading
              marginBottom='0'
              level={5}
              color={first ? 'green.60' : 'font.primary'}
            >
              {title}
              {first && '*'}
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
          {profile?.gender && (
            <Text margin='0' fontSize='small'>
              Gender: {genderMap[profile.gender as keyof typeof genderMap]}
            </Text>
          )}
          {profile?.occupation && (
            <Text margin='0' fontSize='small'>
              Occupation:{' '}
              {occupationMap[profile.occupation as keyof typeof occupationMap]}
            </Text>
          )}
          {profile?.age && (
            <Text fontSize='small'>Age: {ageMap(profile.age)}</Text>
          )}
          {first && (
            <Text fontSize='small'>
              *All subsequent profiles will be compared to this one
            </Text>
          )}
        </Flex>
        <Flex
          direction='column'
          justifyContent='space-between'
          alignItems='stretch'
          gap='xxs'
        >
          {children && children(width)}
        </Flex>
      </StyledMotionCard>
    );
  }
);

// Assign a display name to the component
ComparisonCard.displayName = 'ComparisonCard';

export default ComparisonCard;
