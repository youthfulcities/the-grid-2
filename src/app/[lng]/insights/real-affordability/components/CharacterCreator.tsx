// CharacterCreator.tsx
import useTranslation from '@/app/i18n/client';
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
import { useParams } from 'next/navigation';
import React from 'react';
import { Trans } from 'react-i18next/TransWithoutContext';
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

const StyledStepperField = styled(StepperField)<{ $isDisabled?: boolean }>`
  button:hover {
    background-color: var(--amplify-colors-brand-primary-10);
  }
  label {
    font-size: var(--amplify-font-sizes-small);
    margin-bottom: var(--amplify-space-xxxs);
  }
  ${({ $isDisabled }) =>
    $isDisabled &&
    `
    pointer-events: none;
    opacity: 0.6;
  `}
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
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'rai');
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
      <StyledHeading level={3}>{t('profile_title')}</StyledHeading>
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
            {t('btn_random')}
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
                setAge(null);
                setOccupation('');
              }}
            >
              {t('reset_chart')}
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
                setGender(!gender ? 'woman' : gender);
              }}
            >
              {t('apply')}
            </Button>
          )}
        </View>
        <View width='100%'>
          <StyledSelectField
            id='gender'
            name='gender'
            label={t('gender')}
            placeholder={t('select_gender')}
            value={gender ?? ''}
            onChange={(e) => {
              setGender(e.target.value);
              setCustomized(true);
            }}
          >
            <option value='woman'>{t('woman')}</option>
            <option value='man'>{t('man')}</option>
            <option value='nonbinary'>{t('nonbinary')}</option>
          </StyledSelectField>
          <StyledSelectField
            id='occupation'
            name='occupation'
            label={t('sector')}
            value={String(occupation) ?? ''}
            placeholder={t('select_sector')}
            onChange={(e) => {
              setOccupation(e.target.value);
              setCustomized(true);
            }}
          >
            <option value={0} disabled={(age ?? 19) < 29}>
              {t('management')}
            </option>
            <option value={1}>{t('bus')}</option>
            <option value={2}>{t('sci')}</option>
            <option value={3}>{t('health')}</option>
            <option value={4}>{t('edu')}</option>
            <option value={5}>{t('art')}</option>
            <option value={6}>{t('sales')}</option>
            <option value={7}>{t('trades')}</option>
            <option value={8}>{t('agri')}</option>
            <option value={9}>{t('util')}</option>
          </StyledSelectField>
          <StyledStepperField
            min={19}
            max={29}
            step={5}
            inputStyles={{ color: customized ? 'white' : 'neutral.80' }}
            id='age'
            label={t('age')}
            name='age'
            $isDisabled={occupation === '0' && age === 29}
            // defaultValue={age}
            value={age ?? 19}
            onStepChange={(n) => {
              setAge(n);
              setCustomized(true);
            }}
          />
          <Flex
            marginTop='medium'
            alignItems='baseline'
            justifyContent='flex-start'
          >
            <StyledCheckboxField
              label={t('student')}
              name='student'
              value={student ? 'true' : 'false'}
              size='large'
              color='font.primary'
              onChange={(e) => setStudent(!!e.target.checked)}
            />
            <StyledCheckboxField
              name='car'
              label={t('car_own')}
              value={car ? 'true' : 'false'}
              size='large'
              color='font.primary'
              onChange={(e) => setCar(!!e.target.checked)}
            />
          </Flex>
          <Text fontSize='small' marginTop='small'>
            {t('disclaimer_profile')}
          </Text>
          {gender === 'nonbinary' && (
            <Trans
              t={t}
              i18nKey='disclaimer_gender'
              components={{
                p: <Text fontSize='small' />,
                a: (
                  <a
                    href='https://www.nber.org/papers/w33075'
                    target='_blank'
                  />
                ),
              }}
            />
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
          <Trans
            t={t}
            i18nKey='profile_income'
            values={{ income: currentIncome.toFixed(2) }}
          />
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
              )}%{' '}
              {currentIncome > manIncome
                ? t('more_than_men')
                : t('less_than_men')}
              )
            </span>
          )}
        </Heading>
      )}
    </Background>
  );
};

export default CharacterCreator;
