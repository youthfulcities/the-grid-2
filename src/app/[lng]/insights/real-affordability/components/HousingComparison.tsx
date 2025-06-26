import CompareCities from '@/app/components/CompareCities';
import { Card, Divider, Flex, Heading, Text } from '@aws-amplify/ui-react';
import { motion } from 'framer-motion';
import React from 'react';
import styled from 'styled-components';
import { RentData } from '../types/RentTypes';

interface CityCardProps {
  cityName: string;
  data: RentData;
  activeCityName: string;
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
}) => {
  const entry = data.find((d) => d.city === cityName);
  const deltas = getRentDiffs(data, activeCityName, cityName);

  return (
    entry &&
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
                    (deltas?.[Number(bedroom)] ?? 0) > 0 ? 'red.60' : 'green.60'
                  }
                >
                  {deltas[Number(bedroom)]}% vs {activeCityName}
                </Text>
              )}
          </Flex>
        </Flex>
        <Divider width='100%' borderColor='neutral.80' borderWidth='1px' />
      </>
    ))
  );
};

const HousingComparison: React.FC<{ rent: RentData }> = ({ rent }) => {
  const availableCities = rent.map((d) => d.city);

  return (
    <>
      <Heading level={4}>Overview</Heading>
      <CompareCities
        allCities={availableCities}
        renderCard={(city, activeCity) => (
          <CityCard cityName={city} activeCityName={activeCity} data={rent} />
        )}
      />
    </>
  );
};

export default HousingComparison;
