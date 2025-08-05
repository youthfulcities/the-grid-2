import useTranslation from '@/app/i18n/client';
import { useDimensions } from '@/hooks/useDimensions';
import { Button, Card, Flex, Heading, Text } from '@aws-amplify/ui-react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import React, { forwardRef, useRef } from 'react';
import styled from 'styled-components';
import { ProfileData } from '../types/ProfileTypes';
import ageMap from '../utils/ageMap';

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
    const { lng } = useParams<{ lng: string }>();
    const { t } = useTranslation(lng, 'rai');
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
                {t('remove')}
              </Button>
            )}
          </Flex>
          {profile?.gender && (
            <Text margin='0' fontSize='small'>
              {t('gender')}: {t(profile.gender)}
            </Text>
          )}
          {profile?.occupation && (
            <Text margin='0' fontSize='small'>
              {t('sector')}: {t(profile.occupation as string)}
            </Text>
          )}
          {profile?.age && (
            <Text fontSize='small'>
              {t('age')}: {ageMap(profile.age, lng)}
            </Text>
          )}
          {first && <Text fontSize='small'>{t('disclaimer_compare')}</Text>}
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

// Assign a display name to the component so React doesn't complain
ComparisonCard.displayName = 'ComparisonCard';

export default ComparisonCard;
