import BarChartStacked from '@/app/components/dataviz/BarChartStacked';
import { TooltipState } from '@/app/components/dataviz/TooltipChart/TooltipState';
import { Heading, View } from '@aws-amplify/ui-react';
import React, { useMemo } from 'react';
import { RentData } from '../types/RentTypes';
import AvatarSvg from './AvatarSvg';

interface HousingProps {
  rent: RentData;
  width: number;
  setTooltipState: React.Dispatch<React.SetStateAction<TooltipState>>;
  loading?: boolean;
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
  rent,
  width,
  setTooltipState,
  loading,
}) => {
  const processedData = useMemo(
    () =>
      rent.map((d) => ({
        city: d.city,
        rent: d.rent,
        firstMonth: d.rent,
        furniture: 400,
        utilities: 200,
        keyDeposit: 100,
        laundry: 100,
        movers: 500,
      })),
    [rent]
  );

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

  const finalData = sortedData;

  return (
    <View marginTop='xxxl'>
      <Heading level={1} marginBottom='xxl'>
        The Real Cost of <span className='highlight'>Moving Out</span>
      </Heading>
      <BarChartStacked
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
        data={finalData}
        keys={keys}
        labelAccessor={(d) => d.city as string}
      />
      <AvatarSvg radius={50} />
    </View>
  );
};

export default Housing;
