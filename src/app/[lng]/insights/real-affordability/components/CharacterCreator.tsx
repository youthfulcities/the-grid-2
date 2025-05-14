// CharacterCreator.tsx
import {
  Button,
  Flex,
  Heading,
  Image,
  SelectField,
  StepperField,
  View,
} from '@aws-amplify/ui-react';
import { micah } from '@dicebear/collection';
import { createAvatar, schema } from '@dicebear/core';
import { motion } from 'framer-motion';
import React, { useMemo, useState } from 'react';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa6';
import styled from 'styled-components';
import { Options } from './CharacterCreatorTypes';

const OverlayButton = styled(View)`
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: var(--amplify-space-xxxs);
`;

const Background = styled(View)`
  box-shadow: var(--amplify-shadows-large);
  border-radius: var(--amplify-radii-large);
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  padding: var(--amplify-space-large);
  margin-bottom: var(--amplify-space-large);
`;

const StyledButton = styled(Button)`
  color: var(--amplify-colors-font-inverse);
  width: 30px;
  height: 30px;
  padding: 0;
`;

const StyledHeading = styled(Heading)`
  margin-bottom: 2rem;
  text-align: center;
`;

const StyledLabel = styled.label`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const Wrapper = styled(View)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 400px;
  margin: auto;
`;

const AvatarWrapper = styled(motion.div)`
  position: relative;
  width: 200px;
  height: 200px;
  svg {
    width: 100%;
    height: 100%;
  }
`;

const StyledStepperField = styled(StepperField)`
  button:hover {
    background-color: var(--amplify-colors-brand-primary-10);
  }
  label {
    font-size: var(--amplify-font-sizes-small);
    margin-bottom: var(--amplify-space-xxxs);
  }
`;

const StyledSelectField = styled(SelectField)`
  padding-bottom: var(--amplify-space-small);
  label {
    font-size: var(--amplify-font-sizes-small);
    margin-bottom: var(--amplify-space-xxxs);
  }
`;

const MotionImage = motion(Image);
const MotionButton = motion(Button);

interface CharacterCreatorProps {
  gender: string;
  setGender: (value: string) => void;
  occupation: number;
  setOccupation: (value: number) => void;
  age: number;
  setAge: (value: number) => void;
  setCustomized: (value: boolean) => void;
  currentIncome: number;
  manIncome: number;
  customized: boolean;
  seed: string;
  setSeed: (value: string) => void;
}

const options = {
  ...schema.properties,
  ...micah.schema.properties,
};

const CharacterCreator: React.FC<CharacterCreatorProps> = ({
  gender,
  setGender,
  occupation,
  setOccupation,
  age,
  setAge,
  setCustomized,
  customized,
  currentIncome,
  manIncome,
  seed,
  setSeed,
}) => {
  const [hair, setHair] = useState('full');
  const [eyes, setEyes] = useState('round');
  const [mouth, setMouth] = useState('smile');
  const [eyebrows, setEyebrows] = useState('up');
  const [nose, setNose] = useState('curve');
  const [glasses, setGlasses] = useState('none');
  const [skin, setSkin] = useState('ac6651');
  const [beard, setBeard] = useState('none');
  const [hairColour, setHairColour] = useState('6bd9e9');

  const mouthOptions =
    typeof options?.mouth !== 'boolean' && options?.mouth.default;
  const hairOptions =
    typeof options?.hair !== 'boolean' && options?.hair.default;
  const eyeOptions =
    typeof options?.eyes !== 'boolean' && options?.eyes.default;
  const eyebrowOptions =
    typeof options?.eyebrows !== 'boolean' && options?.eyebrows.default;
  const noseOptions =
    typeof options?.nose !== 'boolean' && options?.nose.default;
  const glassesOptions = typeof options?.glasses !== 'boolean' &&
    options?.glasses.default && [
      ...(options?.glasses.default as string[]),
      'none',
    ];
  const skinOptions =
    typeof options?.baseColor !== 'boolean' && options?.baseColor.default;
  const beardOptions = typeof options?.facialHair !== 'boolean' && [
    ...(options?.facialHair.default as string[]),
    'none',
  ];
  const hairColourOptions =
    typeof options?.hairColor !== 'boolean' && options?.hairColor.default;

  const cycleOption = (currentValue: string, currentOptions: string[]) => {
    const currentIndex = currentOptions.indexOf(currentValue);
    const nextIndex = (currentIndex + 1) % currentOptions.length;
    return currentOptions[nextIndex];
  };

  const previousOption = (currentValue: string, currentOptions: string[]) => {
    const currentIndex = currentOptions.indexOf(currentValue);
    const prevIndex =
      (currentIndex - 1 + currentOptions.length) % currentOptions.length;
    return currentOptions[prevIndex];
  };

  const avatarSvg = useMemo(() => {
    const avatar = createAvatar(micah, {
      seed,
      ears: ['attached'],
      mouth: [mouth] as Options['mouth'],
      glassesProbability: 100,
      earringsProbability: 0,
      glasses:
        glasses !== 'none' ? ([glasses] as Options['glasses']) : undefined,
      facialHairProbability: 100,
      facialHair:
        beard !== 'none' ? ([beard] as Options['facialHair']) : undefined,
      facialHairColor:
        hairColour !== 'none'
          ? ([hairColour] as Options['facialHairColor'])
          : undefined,
      hairColor:
        hairColour !== 'none'
          ? ([hairColour] as Options['hairColor'])
          : undefined,
      eyes: [eyes] as Options['eyes'],
      hair: [hair] as Options['hair'],
      eyebrows: [eyebrows] as Options['eyebrows'],
      nose: [nose] as Options['nose'],
      baseColor: [skin] as Options['baseColor'],
    });
    return avatar.toString();
  }, [
    seed,
    hair,
    eyes,
    mouth,
    eyebrows,
    nose,
    glasses,
    skin,
    beard,
    hairColour,
  ]);

  const reroll = () => {
    setSeed(Math.random().toString(36).substring(2, 10));
    setHairColour(
      hairColourOptions
        ? (hairColourOptions as string[])[
            Math.floor(Math.random() * (hairColourOptions as string[]).length)
          ]
        : ''
    );
  };

  return (
    <Background>
      <StyledHeading level={3}>Create Profile</StyledHeading>
      <Flex alignItems='stretch' gap='large'>
        <View>
          <View position='relative'>
            <AvatarWrapper
              key={seed + hair + eyes + mouth}
              transition={{ type: 'spring', stiffness: 120 }}
              dangerouslySetInnerHTML={{ __html: avatarSvg }}
            />
            <OverlayButton>
              <ButtonWrapper>
                <StyledButton
                  variation='primary'
                  colorTheme='info'
                  onClick={() =>
                    setHair(previousOption(hair, hairOptions as string[]))
                  }
                >
                  <FaCaretLeft />
                </StyledButton>
                <StyledButton
                  variation='primary'
                  colorTheme='info'
                  onClick={() => {
                    setHair(cycleOption(hair, hairOptions as string[]));
                  }}
                >
                  <FaCaretRight />
                </StyledButton>
              </ButtonWrapper>
              <ButtonWrapper>
                <StyledButton
                  variation='primary'
                  onClick={() =>
                    setGlasses(
                      previousOption(glasses, glassesOptions as string[])
                    )
                  }
                >
                  <FaCaretLeft />
                </StyledButton>
                <StyledButton
                  variation='primary'
                  onClick={() =>
                    setGlasses(cycleOption(glasses, glassesOptions as string[]))
                  }
                >
                  <FaCaretRight />
                </StyledButton>
              </ButtonWrapper>
              <ButtonWrapper>
                <StyledButton
                  variation='primary'
                  backgroundColor='yellow.60'
                  onClick={() =>
                    setEyes(previousOption(eyes, eyeOptions as string[]))
                  }
                >
                  <FaCaretLeft />
                </StyledButton>
                <StyledButton
                  variation='primary'
                  backgroundColor='yellow.60'
                  onClick={() =>
                    setEyes(cycleOption(eyes, eyeOptions as string[]))
                  }
                >
                  <FaCaretRight />
                </StyledButton>
              </ButtonWrapper>
              <ButtonWrapper>
                <StyledButton
                  variation='primary'
                  colorTheme='success'
                  onClick={() =>
                    setSkin(previousOption(skin, skinOptions as string[]))
                  }
                >
                  <FaCaretLeft />
                </StyledButton>
                <StyledButton
                  variation='primary'
                  colorTheme='success'
                  onClick={() =>
                    setSkin(cycleOption(skin, skinOptions as string[]))
                  }
                >
                  <FaCaretRight />
                </StyledButton>
              </ButtonWrapper>
              <ButtonWrapper>
                <StyledButton
                  variation='primary'
                  backgroundColor='pink.60'
                  onClick={() =>
                    setMouth(previousOption(mouth, mouthOptions as string[]))
                  }
                >
                  <FaCaretLeft />
                </StyledButton>
                <StyledButton
                  variation='primary'
                  backgroundColor='pink.60'
                  onClick={() =>
                    setMouth(cycleOption(mouth, mouthOptions as string[]))
                  }
                >
                  <FaCaretRight />
                </StyledButton>
              </ButtonWrapper>
              <ButtonWrapper>
                <StyledButton
                  variation='primary'
                  colorTheme='warning'
                  onClick={() =>
                    setBeard(previousOption(beard, beardOptions as string[]))
                  }
                >
                  <FaCaretLeft />
                </StyledButton>
                <StyledButton
                  variation='primary'
                  colorTheme='warning'
                  onClick={() =>
                    setBeard(cycleOption(beard, beardOptions as string[]))
                  }
                >
                  <FaCaretRight />
                </StyledButton>
              </ButtonWrapper>
            </OverlayButton>
          </View>
          <Button
            marginTop='xxs'
            width='100%'
            color='font.inverse'
            fontSize='small'
            onClick={reroll}
          >
            🎲 Randomize Colours
          </Button>
          <Button
            fontSize='small'
            width='100%'
            marginTop='xs'
            colorTheme='error'
            color='#fff'
            onClick={() => setCustomized(false)}
          >
            Reset Chart
          </Button>
        </View>
        <View width='100%'>
          <StyledSelectField
            id='gender'
            name='gender'
            label='Gender'
            value={gender}
            onChange={(e) => {
              setGender(e.target.value);
              setCustomized(true);
            }}
          >
            <option value='woman'>Woman</option>
            <option value='man'>Man</option>
            <option value='nonbinary'>Non-binary / gender diverse*</option>
          </StyledSelectField>
          <StyledSelectField
            id='occupation'
            name='occupation'
            label='Occupation'
            value={String(occupation)}
            onChange={(e) => {
              setOccupation(Number(e.target.value));
              setCustomized(true);
            }}
          >
            <option value={0}>Manager</option>
            <option value={1}>Business and finance</option>
            <option value={2}>Engineer</option>
            <option value={3}>Health care</option>
            <option value={4}>Teacher</option>
            <option value={5}>Arts & recreation</option>
            <option value={6}>Retail</option>
            <option value={7}>Construction worker</option>
            <option value={8}>Natural resources</option>
            <option value={9}>Factory worker</option>
          </StyledSelectField>
          <StyledStepperField
            min={19}
            max={29}
            step={5}
            id='age'
            label='Age'
            name='age'
            type='number'
            value={age}
            onStepChange={(n) => {
              setAge(n);
              setCustomized(true);
            }}
          />
        </View>
      </Flex>
      {manIncome !== 0 && customized && currentIncome !== 0 && (
        <Heading
          level={3}
          marginTop='medium'
          marginBottom='0'
          textAlign='center'
        >
          Average income: ${currentIncome.toFixed(2)} per month{' '}
          {gender !== 'man' && customized && (
            <span
              style={{
                color:
                  currentIncome > manIncome
                    ? 'var(--amplify-colors-green-40)'
                    : 'var(--amplify-colors-red-60)',
              }}
            >
              ({currentIncome > manIncome ? '+' : ''}
              {(((currentIncome - manIncome) / manIncome) * 100).toFixed(
                1
              )}% {currentIncome > manIncome ? 'more than' : 'less than'} men)
            </span>
          )}
        </Heading>
      )}
    </Background>
  );
};

export default CharacterCreator;
