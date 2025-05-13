import { Card, Text, View } from '@aws-amplify/ui-react';
import { micah } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { motion } from 'framer-motion';
import React from 'react';
import styled from 'styled-components';

interface CharacterFacts {
  name: string;
  imageUrl: string;
  age: number;
  gender: string;
  occupation: string;
  income: string;
}

const AvatarWrapper = styled.div`
  position: fixed;
  bottom: 16px;
  left: 16px;
  z-index: 1000;
  cursor: pointer;
`;

const HoverCard = styled(motion.div)`
  position: absolute;
  bottom: 80px;
  left: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  padding: 16px;
  width: 240px;
  pointer-events: none;
`;

const AvatarImage = styled(motion.div)`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const CharacterOverlay: React.FC<{
  character: CharacterFacts;
  seed: string;
}> = ({ character, seed }) => {
  const [hovered, setHovered] = React.useState(false);
  const avatarSvg = createAvatar(micah, { seed });

  return (
    <AvatarWrapper
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AvatarImage dangerouslySetInnerHTML={{ __html: avatarSvg }} />

      {hovered && (
        <HoverCard
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          <Card variation='elevated'>
            <Text fontWeight='bold'>{character.name}</Text>
            <View marginTop='4px'>
              <Text fontSize='small'>Age: {character.age}</Text>
              <Text fontSize='small'>Gender: {character.gender}</Text>
              <Text fontSize='small'>Occupation: {character.occupation}</Text>
              <Text fontSize='small'>Income: {character.income}</Text>
            </View>
          </Card>
        </HoverCard>
      )}
    </AvatarWrapper>
  );
};

export default CharacterOverlay;
