import ComparisonCard from '@/app/[lng]/insights/real-affordability/components/ComparisonCard';
import useTranslation from '@/app/i18n/client';
import {
  Button,
  Flex,
  Grid,
  Heading,
  SelectField,
  StepperField,
  Text,
} from '@aws-amplify/ui-react';
import { AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useProfile } from '../context/ProfileContext';
import { ProfileData } from '../types/ProfileTypes';
import AvatarSvg from './AvatarSvg';

interface CompareCitiesProps {
  allCities: string[];
  profileSection?: boolean;
  renderCard: (
    profile: ProfileData,
    activeProfile: ProfileData,
    width?: number
  ) => React.ReactNode;
}

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

const CompareCities: React.FC<CompareCitiesProps> = ({
  allCities,
  renderCard,
  profileSection = false,
}) => {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'rai');
  const { gender, age, occupation, customized } = useProfile();
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [newCity, setNewCity] = useState('');
  const [profiles, setProfiles] = useState<ProfileData[]>([]);

  const [tempProfile, setTempProfile] = useState<{
    city: string | null;
    gender: string | null;
    occupation: string | null;
    age: number | null;
    customized: boolean;
  }>({ city: null, gender, occupation, age, customized });

  const setGender = (newGender: string) => {
    setTempProfile((prev) => ({ ...prev, gender: newGender }));
  };

  const setOccupation = (newOccupation: string) => {
    setTempProfile((prev) => ({ ...prev, occupation: newOccupation }));
  };

  const setCustomized = (newCustomized: boolean) => {
    setTempProfile((prev) => ({ ...prev, customized: newCustomized }));
  };

  const setAge = (newAge: number) => {
    setTempProfile((prev) => ({ ...prev, age: newAge }));
  };

  const handleAddCity = (currentCity: string) => {
    const updatedProfile = { ...tempProfile, city: currentCity };
    setNewCity(currentCity);
    setTempProfile(updatedProfile);
    setProfiles((prev) => [
      ...prev,
      {
        key: `${currentCity}-${updatedProfile.gender}-${updatedProfile.age}-${updatedProfile.occupation}`,
        ...updatedProfile,
      },
    ]);
    if (!selectedCities.includes(currentCity)) {
      setSelectedCities([...selectedCities, currentCity]);
      setNewCity('');
    }
  };

  const handleRemove = (city: string, key: string) => {
    setSelectedCities((prev) => prev.filter((c) => c !== city));
    setTempProfile({ city: null, gender, occupation, age, customized });
    setProfiles((prev) => prev.filter((p) => p.key !== key));
  };
  const availableCities = allCities.filter(
    (city: string) => !selectedCities.includes(city)
  );

  return (
    <Grid
      templateColumns={{
        base: '1fr',
        medium: '1fr 1fr',
      }}
      gap='small'
    >
      <AnimatePresence initial={false}>
        {profiles.map((profile, i) => (
          <ComparisonCard
            first={i === 0}
            key={profile.key}
            profile={profile}
            title={profile.city ?? t('profile')}
            onRemove={() => handleRemove(profile.city ?? '', profile.key)}
          >
            {(width) => renderCard(profile, profiles[0], width)}
          </ComparisonCard>
        ))}
      </AnimatePresence>
      <ComparisonCard title={t('compare_title')}>
        {(width) => (
          <>
            <SelectField
              labelHidden
              label={t('select_city')}
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
            >
              <option value=''>{t('select_city')}</option>
              {availableCities.map((city: string) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </SelectField>
            {profileSection && (
              <>
                <Text marginTop='small' textAlign='center'>
                  --- {t('or')} ---
                </Text>
                <Heading level={5} color='font.primary'>
                  {t('select_profile')}
                </Heading>
                {(gender || occupation || age) && (
                  <Button
                    width='100%'
                    minWidth='200px'
                    marginTop='xs'
                    marginBottom='small'
                    color='#fff'
                    onClick={() => {
                      setTempProfile({
                        city: newCity ?? selectedCities[0],
                        gender,
                        occupation,
                        age,
                        customized,
                      });
                    }}
                  >
                    <Flex justifyContent='space-between' alignItems='center'>
                      <AvatarSvg width={100} height={100} radius={100} />{' '}
                      {t('current_profile')}
                    </Flex>
                  </Button>
                )}
                <SelectField
                  id='gender'
                  name='gender'
                  label={t('gender')}
                  placeholder={t('select_gender')}
                  value={tempProfile.gender ?? ''}
                  onChange={(e) => {
                    setGender(e.target.value);
                  }}
                >
                  <option value='woman'>{t('woman')}</option>
                  <option value='man'>{t('man')}</option>
                  <option value='nonbinary'>{t('nonbinary')}</option>
                </SelectField>
                <SelectField
                  id='occupation'
                  name='occupation'
                  label={t('sector')}
                  value={String(tempProfile.occupation) ?? ''}
                  placeholder={t('select_sector')}
                  onChange={(e) => {
                    setOccupation(e.target.value);
                  }}
                >
                  <option value={0} disabled={(tempProfile.age ?? 19) < 29}>
                    {t('management')}
                  </option>
                  <option value={1}>{t('bus')}</option>
                  <option value={2}>{t('sci')}</option>
                  <option value={3}>{t('health')}</option>
                  <option value={4}>{t('edu')}</option>
                  <option value={5}>{t('art')}</option>
                  <option value={6}>{t('sales')}</option>
                  <option value={7}>{t('trade')}</option>
                  <option value={8}>{t('agri')}</option>
                  <option value={9}>{t('util')}</option>
                </SelectField>
                <StyledStepperField
                  min={19}
                  max={29}
                  step={5}
                  inputStyles={{
                    color: tempProfile.customized ? 'white' : 'neutral.80',
                  }}
                  id='age'
                  label={t('age')}
                  name='age'
                  $isDisabled={
                    tempProfile.occupation === '0' && tempProfile.age === 29
                  }
                  value={tempProfile.age ?? 19}
                  onStepChange={(n) => {
                    setAge(n);
                    setCustomized(true);
                  }}
                />
              </>
            )}
            <Button
              variation='primary'
              fontSize='small'
              width='100%'
              minWidth='200px'
              marginTop='xs'
              colorTheme='error'
              color='#fff'
              onClick={() => {
                handleAddCity(newCity === '' ? selectedCities[0] : newCity);
              }}
            >
              {t('add_profile')}
            </Button>
            <Button
              fontSize='small'
              width='100%'
              minWidth='200px'
              marginTop='xs'
              colorTheme='error'
              color='#fff'
              onClick={() => {
                setNewCity('');
                setAge(19);
                setCustomized(false);
                setOccupation('');
                setGender('');
                setTempProfile({
                  city: null,
                  gender: '',
                  occupation: '',
                  age: null,
                  customized: false,
                });
              }}
            >
              {t('reset')}
            </Button>
          </>
        )}
      </ComparisonCard>
    </Grid>
  );
};

export default CompareCities;
