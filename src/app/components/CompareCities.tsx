import ComparisonCard from '@/app/components/ComparisonCard';
import { Grid, SelectField } from '@aws-amplify/ui-react';
import { AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';

interface CompareCitiesProps {
  allCities: string[];
  renderCard: (city: string, activeCity: string) => React.ReactNode;
}

const CompareCities: React.FC<CompareCitiesProps> = ({
  allCities,
  renderCard,
}) => {
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
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
        {selectedCities.map((city) => (
          <ComparisonCard title={city} key={city} onRemove={handleRemoveCity}>
            {renderCard(city, selectedCities[0] || city)}
          </ComparisonCard>
        ))}
      </AnimatePresence>
      <ComparisonCard title='Add City'>
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
      </ComparisonCard>
    </Grid>
  );
};

export default CompareCities;
