// CharacterCreator.tsx
import {
  Button,
  CheckboxField,
  Flex,
  Heading,
  SelectField,
  StepperField,
  Text,
  View,
} from '@aws-amplify/ui-react';
import { micah } from '@dicebear/collection';
import { schema } from '@dicebear/core';
import React from 'react';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa6';
import styled from 'styled-components';
import { useProfile } from '../context/ProfileContext';
import { AvatarOptions } from '../types/AvatarOptions';
import AvatarSvg from './AvatarSvg';

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
  color: var(--amplify-colors-font-primary);
  width: 30px;
  height: 30px;
  padding: 0;
`;

const StyledHeading = styled(Heading)`
  margin-bottom: 2rem;
  text-align: center;
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

const StyledCheckboxField = styled(CheckboxField)`
  .amplify-text {
    margin: 0;
  }
`;

interface CharacterCreatorProps {}

const options = {
  ...schema.properties,
  ...micah.schema.properties,
};

const CharacterCreator: React.FC<CharacterCreatorProps> = () => {
  const {
    avatar,
    setAvatar,
    gender,
    setGender,
    age,
    setAge,
    customized,
    setCustomized,
    occupation,
    setOccupation,
    currentIncome,
    manIncome,
    student,
    car,
    setCar,
    setStudent,
  } = useProfile();

  const mouthOptions =
    typeof options?.mouth !== 'boolean' && options?.mouth.default;
  const hairOptions =
    typeof options?.hair !== 'boolean' && options?.hair.default;
  const eyeOptions =
    typeof options?.eyes !== 'boolean' && options?.eyes.default;
  // const eyebrowOptions =
  //   typeof options?.eyebrows !== 'boolean' && options?.eyebrows.default;
  // const noseOptions =
  //   typeof options?.nose !== 'boolean' && options?.nose.default;
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

  const reroll = () => {
    setAvatar((prev: AvatarOptions) => ({
      ...prev,
      seed: Math.random().toString(36).substring(2, 10),
      hairColour: hairColourOptions
        ? (hairColourOptions as string[])[
            Math.floor(Math.random() * (hairColourOptions as string[]).length)
          ]
        : '',
    }));
  };

  const setAvatarOption = (key: string, newValue: string) =>
    setAvatar((prev: AvatarOptions) => ({ ...prev, [key]: newValue }));

  return (
    <Background>
      <StyledHeading level={3}>Create Profile</StyledHeading>
      <Flex
        alignItems='stretch'
        gap='large'
        direction={{ base: 'column', medium: 'row' }}
      >
        <View>
          <View position='relative'>
            <AvatarSvg />
            <OverlayButton>
              <ButtonWrapper>
                <StyledButton
                  variation='primary'
                  colorTheme='info'
                  onClick={() =>
                    setAvatarOption(
                      'hair',
                      previousOption(avatar.hair, hairOptions as string[])
                    )
                  }
                >
                  <FaCaretLeft />
                </StyledButton>
                <StyledButton
                  variation='primary'
                  colorTheme='info'
                  onClick={() => {
                    setAvatarOption(
                      'hair',
                      cycleOption(avatar.hair, hairOptions as string[])
                    );
                  }}
                >
                  <FaCaretRight />
                </StyledButton>
              </ButtonWrapper>
              <ButtonWrapper>
                <StyledButton
                  variation='primary'
                  onClick={() =>
                    setAvatarOption(
                      'glasses',
                      previousOption(avatar.glasses, glassesOptions as string[])
                    )
                  }
                >
                  <FaCaretLeft />
                </StyledButton>
                <StyledButton
                  variation='primary'
                  onClick={() =>
                    setAvatarOption(
                      'glasses',
                      cycleOption(avatar.glasses, glassesOptions as string[])
                    )
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
                    setAvatarOption(
                      'eyes',
                      previousOption(avatar.eyes, eyeOptions as string[])
                    )
                  }
                >
                  <FaCaretLeft />
                </StyledButton>
                <StyledButton
                  variation='primary'
                  backgroundColor='yellow.60'
                  onClick={() =>
                    setAvatarOption(
                      'eyes',
                      cycleOption(avatar.eyes, eyeOptions as string[])
                    )
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
                    setAvatarOption(
                      'skin',
                      previousOption(avatar.skin, skinOptions as string[])
                    )
                  }
                >
                  <FaCaretLeft />
                </StyledButton>
                <StyledButton
                  variation='primary'
                  colorTheme='success'
                  onClick={() =>
                    setAvatarOption(
                      'skin',
                      cycleOption(avatar.skin, skinOptions as string[])
                    )
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
                    setAvatarOption(
                      'mouth',
                      previousOption(avatar.mouth, mouthOptions as string[])
                    )
                  }
                >
                  <FaCaretLeft />
                </StyledButton>
                <StyledButton
                  variation='primary'
                  backgroundColor='pink.60'
                  onClick={() =>
                    setAvatarOption(
                      'mouth',
                      cycleOption(avatar.mouth, mouthOptions as string[])
                    )
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
                    setAvatarOption(
                      'beard',
                      previousOption(avatar.beard, beardOptions as string[])
                    )
                  }
                >
                  <FaCaretLeft />
                </StyledButton>
                <StyledButton
                  variation='primary'
                  colorTheme='warning'
                  onClick={() =>
                    setAvatarOption(
                      'beard',
                      cycleOption(avatar.beard, beardOptions as string[])
                    )
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
            color='font.primary'
            fontSize='small'
            onClick={reroll}
          >
            🎲 Randomize Colours
          </Button>
          {customized ? (
            <Button
              fontSize='small'
              width='100%'
              minWidth='200px'
              marginTop='xs'
              colorTheme='error'
              color='#fff'
              onClick={() => {
                setCustomized(false);
                setGender(null);
                setStudent(false);
                setCar(false);
              }}
            >
              Reset Chart
            </Button>
          ) : (
            <Button
              fontSize='small'
              width='100%'
              minWidth='200px'
              marginTop='xs'
              colorTheme='error'
              color='#fff'
              onClick={() => {
                setCustomized(true);
                setGender(!gender ? 'woman' : gender);
              }}
            >
              Apply selections to income
            </Button>
          )}
        </View>
        <View width='100%'>
          <StyledSelectField
            id='gender'
            name='gender'
            label='Gender'
            placeholder='Select gender'
            value={gender ?? 'undetermined'}
            onChange={(e) => {
              setGender(e.target.value);
            }}
          >
            <option value='woman'>Woman</option>
            <option value='man'>Man</option>
            <option value='nonbinary'>Nonbinary / gender diverse*</option>
          </StyledSelectField>
          <StyledSelectField
            id='occupation'
            name='occupation'
            label='Occupation'
            value={String(occupation)}
            onChange={(e) => {
              setOccupation(e.target.value);
              setGender(!gender ? 'woman' : gender);
              setCustomized(true);
            }}
          >
            <option value={0}>Manager</option>
            <option value={1}>Business and finance</option>
            <option value={2}>Applied sciences</option>
            <option value={3}>Health care</option>
            <option value={4}>
              Education, law, social, & community services
            </option>
            <option value={5}>Arts & recreation</option>
            <option value={6}>Sales & service</option>
            <option value={7}>Trades, transport, or equipment operator</option>
            <option value={8}>Natural resources & agriculture</option>
            <option value={9}>Manufacturing & utilities</option>
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
              setGender(!gender ? 'woman' : gender);
              setCustomized(true);
            }}
          />
          <Flex
            marginTop='medium'
            alignItems='baseline'
            justifyContent='flex-start'
          >
            <StyledCheckboxField
              label='I am a student'
              name='student'
              value='true'
              size='large'
              color='font.primary'
              onChange={(e) => setStudent(!!e.target.checked)}
            />
            <StyledCheckboxField
              name='car'
              label='I own a car'
              value='true'
              size='large'
              color='font.primary'
              onChange={(e) => setCar(!!e.target.checked)}
            />
          </Flex>
          {gender === 'nonbinary' && (
            <>
              <Text fontSize='small' marginTop='small'>
                *Our income data comes from Statistics Canada, which states the
                following regarding gender: &apos;Given that the non-binary
                population is small, data aggregation to a two-category gender
                variable is necessary to protect the confidentiality of
                responses provided. Individuals in the category &quot;non-binary
                persons&quot; are distributed into the other two gender
                categories.&apos;
              </Text>
              <Text fontSize='small'>
                According to the{' '}
                <a href='https://www.nber.org/papers/w33075' target='_blank'>
                  National Bureau of Economic Research
                </a>
                , &apos;nonbinary individuals assigned male at birth,
                transgender men, transgender women, and cisgender women all earn
                significantly less than comparable cisgender men.&apos; As such,
                we have used the income of &apos;Women+&apos; as a baseline for
                non-binary individuals. However, this may not fully reflect
                individual realities.
              </Text>
              <Text fontSize='small'>
                The NBER study found that &apos;nonbinary people assigned female
                at birth–despite being more highly educated than other
                groups–earn significantly less than cisgender men, cisgender
                women, and all other gender minority groups. These gaps are
                larger at the bottom of the annual earnings distribution than at
                the top. [...] Lower-income transgender and nonbinary people may
                face something like a “sticky floor” (see Christofides et al.
                (2013)). Sticky floors represent a magnification of disadvantage
                for the most marginalized members of already disadvantaged
                groups. They may also be due to heterogeneity in the degree to
                which gender minority people are actually seen as cisgender
                people by the society surrounding them. If some members of
                gender minority groups are not perceived by others as gender
                minorities, we may expect those people to face smaller
                disparities.&apos;
              </Text>
            </>
          )}
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
