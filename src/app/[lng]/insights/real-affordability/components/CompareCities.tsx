import ComparisonCard from '@/app/[lng]/insights/real-affordability/components/ComparisonCard';
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
            title={profile.city ?? 'Profile'}
            onRemove={() => handleRemove(profile.city ?? '', profile.key)}
          >
            {(width) => renderCard(profile, profiles[0], width)}
          </ComparisonCard>
        ))}
      </AnimatePresence>
      <ComparisonCard title='Add Comparison'>
        {(width) => (
          <>
            <SelectField
              labelHidden
              label='Select City'
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
            >
              <option value=''>Select a city</option>
              {availableCities.map((city: string) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </SelectField>
            {profileSection && (
              <>
                <Text marginTop='small' textAlign='center'>
                  --- or ---
                </Text>
                <Heading level={5} color='font.primary'>
                  Select Profile
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
                      <AvatarSvg width={100} height={100} radius={100} /> Use
                      Current Profile
                    </Flex>
                  </Button>
                )}
                <SelectField
                  id='gender'
                  name='gender'
                  label='Gender'
                  placeholder='Select gender'
                  value={tempProfile.gender ?? ''}
                  onChange={(e) => {
                    setGender(e.target.value);
                  }}
                >
                  <option value='woman'>Woman</option>
                  <option value='man'>Man</option>
                  <option value='nonbinary'>Nonbinary / gender diverse*</option>
                </SelectField>
                <SelectField
                  id='occupation'
                  name='occupation'
                  label='Sector'
                  value={String(tempProfile.occupation) ?? ''}
                  placeholder='Select sector'
                  onChange={(e) => {
                    setOccupation(e.target.value);
                  }}
                >
                  <option value={0} disabled={(tempProfile.age ?? 19) < 29}>
                    Management
                  </option>
                  <option value={1}>Business and finance</option>
                  <option value={2}>Applied sciences</option>
                  <option value={3}>Health care</option>
                  <option value={4}>
                    Education, law, social, & community services
                  </option>
                  <option value={5}>Arts & recreation</option>
                  <option value={6}>Sales & service</option>
                  <option value={7}>
                    Trades, transport, or equipment operator
                  </option>
                  <option value={8}>Natural resources & agriculture</option>
                  <option value={9}>Manufacturing & utilities</option>
                </SelectField>
                <StyledStepperField
                  min={19}
                  max={29}
                  step={5}
                  inputStyles={{
                    color: tempProfile.customized ? 'white' : 'neutral.80',
                  }}
                  id='age'
                  label='Age'
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
              Add Profile
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
              Reset
            </Button>
          </>
        )}
      </ComparisonCard>
    </Grid>
  );
};

export default CompareCities;
