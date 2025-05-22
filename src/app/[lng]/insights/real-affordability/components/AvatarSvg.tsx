import { micah } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { motion } from 'framer-motion';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useAvatar } from '../context/AvatarContext';
import { Options } from '../types/CharacterCreatorTypes';

const AvatarWrapper = styled(motion.div)<{
  $width: number;
  $height: number;
  $radius: number;
}>`
  position: relative;
  background: #141414;
  border-radius: ${({ $radius }) => $radius}%;
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  margin: auto;
  overflow: hidden;
  svg {
    width: 100%;
    height: 100%;
  }
`;

interface AvatarSvgProps {
  width?: number;
  height?: number;
  radius?: number;
}

const AvatarSvg: React.FC<AvatarSvgProps> = ({
  width = 200,
  height = 200,
  radius = 0,
}) => {
  const { avatar } = useAvatar();

  const avatarSvg = useMemo(() => {
    const avatarImage = createAvatar(micah, {
      seed: avatar.seed,
      ears: ['attached'],
      mouth: [avatar.mouth] as Options['mouth'],
      glassesProbability: 100,
      earringsProbability: 0,
      glasses:
        avatar.glasses !== 'none'
          ? ([avatar.glasses] as Options['glasses'])
          : undefined,
      facialHairProbability: 100,
      facialHair:
        avatar.beard !== 'none'
          ? ([avatar.beard] as Options['facialHair'])
          : undefined,
      facialHairColor:
        avatar.hairColour !== 'none'
          ? ([avatar.hairColour] as Options['facialHairColor'])
          : undefined,
      hairColor:
        avatar.hairColour !== 'none'
          ? ([avatar.hairColour] as Options['hairColor'])
          : undefined,
      eyes: [avatar.eyes] as Options['eyes'],
      hair: [avatar.hair] as Options['hair'],
      eyebrows: [avatar.eyebrows] as Options['eyebrows'],
      nose: [avatar.nose] as Options['nose'],
      baseColor: [avatar.skin] as Options['baseColor'],
    });
    return avatarImage.toString();
  }, [avatar]);

  return (
    <AvatarWrapper
      key={avatar.seed}
      $radius={radius}
      $width={width}
      $height={height}
      transition={{ type: 'spring', stiffness: 120 }}
      dangerouslySetInnerHTML={{ __html: avatarSvg }}
    />
  );
};

export default AvatarSvg;
