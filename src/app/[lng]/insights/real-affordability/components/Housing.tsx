import BarChartStacked from '@/app/components/dataviz/BarChartStacked';
import { Button, Heading, Text, View } from '@aws-amplify/ui-react';
import React, { useMemo } from 'react';
import { useProfile } from '../context/ProfileContext';
import { TooltipState } from '../types/BasketTypes';

interface FlexibleDataItem {
  [key: string]: number | string;
}

interface HousingProps {
  width: number;
  setTooltipState: React.Dispatch<React.SetStateAction<TooltipState>>;
  processedData: FlexibleDataItem[];
}

const keys = [
  'rent',
  'firstMonth',
  'furniture',
  'utilities',
  'keyDeposit',
  'laundry',
  'movers',
];

const Housing: React.FC<HousingProps> = ({
  processedData,
  width,
  setTooltipState,
}) => {
  const { activeCity, setActiveCity } = useProfile();

  const sortedData = useMemo(
    () =>
      [...processedData].sort((a, b) => {
        const totalA = keys.reduce(
          (sum, key) => sum + (a[key as keyof typeof a] as number),
          0
        );
        const totalB = keys.reduce(
          (sum, key) => sum + (b[key as keyof typeof b] as number),
          0
        );
        return totalB - totalA;
      }),
    [processedData]
  );

  const handleScroll = () => {
    const element = document.querySelector(
      `[data-section="housingJourneyInView"]`
    );
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const onBarClick = (label: string) => {
    setActiveCity(label);
    handleScroll();
  };

  const resetCity = () => {
    setActiveCity(null);
  };

  return (
    <View marginTop='xxxl'>
      <Heading level={1} marginBottom='large'>
        The Real Cost of <span className='highlight'>Moving Out</span>
      </Heading>
      <Text marginBottom='large' textAlign='center'>
        Click on a city to start your housing journey.
      </Text>
      <BarChartStacked
        filterLabel={activeCity}
        marginLeft={100}
        onBarClick={onBarClick}
        setTooltipState={setTooltipState}
        width={width}
        colors={[
          '#F2695D',
          '#FBD166',
          '#B8D98D',
          '#2f4eac',
          '#5125E8',
          '#F6D9D7',
          '#af6860',
        ]}
        data={sortedData}
        keys={keys}
        labelAccessor={(d) => d.city as string}
      />
      <Button
        onClick={resetCity}
        marginTop='small'
        size='small'
        color='font.primary'
        marginLeft='xs'
      >
        Reset City
      </Button>
    </View>
  );
};

export default Housing;
