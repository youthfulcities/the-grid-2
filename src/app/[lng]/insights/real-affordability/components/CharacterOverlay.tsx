import { Heading, Text, View } from '@aws-amplify/ui-react';
import { AnimatePresence, motion } from 'framer-motion';
import _ from 'lodash';
import React from 'react';
import styled from 'styled-components';
import { useProfile } from '../context/ProfileContext';
import { IncomeData } from '../types/IncomeTypes';
import ageMap from '../utils/ageMap';
import getIncome from '../utils/calculateIncome';
import genderMap from '../utils/genderMap.json';
import occupationMap from '../utils/occupationMap.json';
import AvatarSvg from './AvatarSvg';

const AvatarWrapper = styled(motion.div)`
  position: fixed;
  bottom: 16px;
  left: 16px;
  z-index: 1000;
  cursor: pointer;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const HoverCard = styled(motion(View))`
  position: absolute;
  bottom: 90px;
  left: 0;
  background: white;
  width: 240px;
  pointer-events: none;
  box-shadow: var(--amplify-shadows-large);
  border-radius: var(--amplify-radii-large);
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  padding: var(--amplify-space-large);
  margin-bottom: var(--amplify-space-large);
`;

const CharacterOverlay: React.FC<{
  profileInView: boolean;
  income: IncomeData;
}> = ({ income, profileInView }) => {
  const [hovered, setHovered] = React.useState(false);

  const { age, gender, occupation, activeCity, currentIncome } = useProfile();

  return (
    <AnimatePresence>
      {!profileInView && (
        <AvatarWrapper
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          exit={{ y: 100 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <AvatarSvg width={100} height={100} radius={50} />
          {hovered && (
            <HoverCard
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Heading level={5} color='font.primary' textAlign='center'>
                Current Profile
              </Heading>
              <Text fontSize='small'>
                <span className='highlight'>Age:</span> {ageMap(age)}
              </Text>
              <Text fontSize='small'>
                <span className='highlight'>Gender: </span>
                {_.capitalize(gender)}
              </Text>
              <Text fontSize='small'>
                <span className='highlight'>Occupation:</span>{' '}
                {occupationMap[occupation as keyof typeof occupationMap]}
              </Text>
              <Text fontSize='small'>
                <span className='highlight'>Income:</span>
                {' $'}
                {currentIncome > 0
                  ? currentIncome.toFixed(2)
                  : getIncome({
                      currentAge: ageMap(age),
                      currentGender:
                        genderMap[gender as keyof typeof genderMap],
                      currentOccupation:
                        occupationMap[occupation as keyof typeof occupationMap],
                      income,
                    }).toFixed(2)}{' '}
                per month
              </Text>
              <Text fontSize='small'>
                <span className='highlight'>Current city:</span>{' '}
                {activeCity === null ? 'Not selected' : activeCity}
              </Text>
            </HoverCard>
          )}
        </AvatarWrapper>
      )}
    </AnimatePresence>
  );
};

export default CharacterOverlay;
