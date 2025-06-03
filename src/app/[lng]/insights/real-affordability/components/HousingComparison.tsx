import {
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Heading,
  SelectField,
  Text,
} from '@aws-amplify/ui-react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import styled from 'styled-components';
import { RentData } from '../types/RentTypes';

const StyledMotionCard = styled(motion(Card))`
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
`;

interface CityCardProps {
  cityName: string;
  data: RentData;
  activeCityName: string;
  onRemove: (cityName: string) => void;
}

const getRentDiffs = (
  data: RentData,
  baseCityName: string,
  compareCityName: string
) => {
  if (!baseCityName || !compareCityName) return;

  const base = data.find((d) => d.city === baseCityName);
  const compare = data.find((d) => d.city === compareCityName);

  if (!base || !compare) return;

  return Object.fromEntries(
    Object.entries(compare.bedrooms).map(([bedroom, rent]) => {
      const baseRent =
        base.bedrooms[Number(bedroom) as keyof typeof base.bedrooms];
      const delta =
        baseRent !== undefined
          ? Number((((rent - baseRent) / baseRent) * 100).toFixed(1))
          : null;
      return [Number(bedroom), delta];
    })
  );
};

const CityCard: React.FC<CityCardProps> = ({
  cityName,
  data,
  activeCityName,
  onRemove,
}) => {
  const entry = data.find((d) => d.city === cityName);
  const deltas = getRentDiffs(data, activeCityName, cityName);

  return (
    <StyledMotionCard
      variation='elevated'
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.25 }}
    >
      <Flex
        justifyContent='space-between'
        alignItems='center'
        marginBottom='xl'
      >
        <Text fontWeight='bold' fontSize='1.25rem' color='secondary.60'>
          {cityName}
        </Text>
        {onRemove && (
          <Button
            size='small'
            onClick={() => onRemove(cityName)}
            variation='primary'
          >
            Remove
          </Button>
        )}
      </Flex>
      {entry &&
        Object.entries(entry.bedrooms).map(([bedroom, rent]) => (
          <>
            <Flex
              key={bedroom}
              justifyContent='space-between'
              marginBottom='0'
              marginTop='small'
              width='100%'
            >
              <Text>{bedroom} beds</Text>
              <Flex direction='column' alignItems='flex-end' gap='xs'>
                <Text marginBottom='0'>${rent}</Text>
                {deltas?.[Number(bedroom)] !== undefined &&
                  activeCityName !== cityName && (
                    <Text
                      marginTop='0'
                      fontSize='0.875rem'
                      color={
                        (deltas?.[Number(bedroom)] ?? 0) > 0
                          ? 'red.60'
                          : 'green.60'
                      }
                    >
                      {deltas[Number(bedroom)]}% vs {activeCityName}
                    </Text>
                  )}
              </Flex>
            </Flex>
            <Divider width='100%' borderColor='neutral.80' borderWidth='1px' />
          </>
        ))}
    </StyledMotionCard>
  );
};

const HousingComparison: React.FC<{ rent: RentData }> = ({ rent }) => {
  const [selectedCities, setSelectedCities] = useState(['Toronto']);
  const [newCity, setNewCity] = useState('');

  const handleAddCity = (currentCity: string) => {
    setNewCity(currentCity);
    if (!selectedCities.includes(currentCity)) {
      setSelectedCities([...selectedCities, currentCity]);
      setNewCity('');
    }
  };

  const handleRemoveCity = (city: string) => {
    setSelectedCities((prev) => prev.filter((c) => c !== city));
  };

  const availableCities = rent
    .map((d) => d.city)
    .filter((city: string) => !selectedCities.includes(city));

  return (
    <>
      <Heading level={4}>Overview</Heading>
      <Grid
        templateColumns={{
          base: '1fr',
          medium: '1fr 1fr',
        }}
        gap='small'
      >
        <AnimatePresence initial={false}>
          {selectedCities.map((city) => (
            <CityCard
              key={city}
              cityName={city}
              data={rent}
              activeCityName={selectedCities[0]}
              onRemove={() => handleRemoveCity(city)}
            />
          ))}
        </AnimatePresence>
        <StyledMotionCard
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
          variation='elevated'
        >
          <Flex direction='column' gap='1rem'>
            <Text fontWeight='bold'>Add City</Text>
            <SelectField
              labelHidden
              label='Select City'
              value={newCity}
              onChange={(e) => handleAddCity(e.target.value)}
            >
              <option value=''>Select a city</option>
              {availableCities.map((city: string) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </SelectField>
          </Flex>
        </StyledMotionCard>
      </Grid>
    </>
  );
};

export default HousingComparison;
