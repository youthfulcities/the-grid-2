import {
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  SelectField,
  Text,
} from '@aws-amplify/ui-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import styled from 'styled-components';

const StyledMotionCard = styled(motion(Card))`
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
`;

const getRentDiffs = (data, baseCityName, compareCityName) => {
  if (!baseCityName || !compareCityName) return;

  const base = data.find((d) => d.city === baseCityName);
  const compare = data.find((d) => d.city === compareCityName);

  if (!base || !compare) return;

  return Object.fromEntries(
    Object.entries(compare.bedrooms).map(([bedroom, rent]) => {
      const baseRent = base.bedrooms[Number(bedroom)];
      const delta =
        baseRent !== undefined
          ? Number((((rent - baseRent) / baseRent) * 100).toFixed(1))
          : null;
      return [Number(bedroom), delta];
    })
  );
};

const CityCard = ({ cityName, data, activeCityName, onRemove }) => {
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
      <Flex justifyContent='space-between' alignItems='center'>
        <Text fontWeight='bold' fontSize='1.25rem'>
          {cityName}
        </Text>
        {onRemove && (
          <Button
            size='small'
            onClick={onRemove}
            variation='link'
            color='red.60'
          >
            Remove
          </Button>
        )}
      </Flex>
      {entry &&
        Object.entries(entry.bedrooms).map(([bedroom, rent]) => (
          <Flex
            key={bedroom}
            justifyContent='space-between'
            marginBottom='0.5rem'
          >
            <Text>{bedroom}-bed</Text>
            <Flex direction='column' alignItems='flex-end'>
              <Text>${rent}</Text>
              {deltas?.[Number(bedroom)] !== undefined &&
                activeCityName !== cityName && (
                  <Text fontSize='0.875rem' color='neutral.60'>
                    {deltas[Number(bedroom)]}% vs {activeCityName}
                  </Text>
                )}
            </Flex>
          </Flex>
        ))}
    </StyledMotionCard>
  );
};

const HousingComparison = ({ rent }) => {
  const [selectedCities, setSelectedCities] = useState(['Toronto']);
  const [newCity, setNewCity] = useState('');

  const handleAddCity = () => {
    if (newCity && !selectedCities.includes(newCity)) {
      setSelectedCities([...selectedCities, newCity]);
      setNewCity('');
    }
  };

  const handleRemoveCity = (city) => {
    setSelectedCities((prev) => prev.filter((c) => c !== city));
  };

  const availableCities = rent
    .map((d) => d.city)
    .filter((city) => !selectedCities.includes(city));

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
          {selectedCities.map((city, idx) => (
            <CityCard
              key={city}
              cityName={city}
              data={rent}
              activeCityName={selectedCities[0]}
              onRemove={idx === 0 ? undefined : () => handleRemoveCity(city)}
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
              onChange={(e) => setNewCity(e.target.value)}
            >
              <option value=''>Select a city</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </SelectField>
            <Button onClick={handleAddCity} isDisabled={!newCity}>
              + Add City
            </Button>
          </Flex>
        </StyledMotionCard>
      </Grid>
    </>
  );
};

export default HousingComparison;
