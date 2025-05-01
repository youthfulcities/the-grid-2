import BarChartStacked from '@/app/components/dataviz/BarChartStacked';
import { Heading, View } from '@aws-amplify/ui-react';
import React from 'react';

interface TooltipState {
  position: { x: number; y: number } | null;
  content?: string;
  group?: string;
}

interface AffordabilityOverviewProps {
  width: number;
  tooltipState: TooltipState;
  setTooltipState: React.Dispatch<React.SetStateAction<TooltipState>>;
}

const cityData = [
  { city: 'Toronto', rent: 1500, food: 600, other: 400, income: 3000 },
  { city: 'Vancouver', rent: 1800, food: 700, other: 500, income: 3200 },
  { city: 'Calgary', rent: 1200, food: 500, other: 300, income: 2800 },
  { city: 'Montreal', rent: 1000, food: 450, other: 350, income: 2600 },
  { city: 'Halifax', rent: 900, food: 400, other: 250, income: 2400 },
];

// Preprocess
const processedData = cityData.map((d) => {
  const totalExpenses = d.rent + d.food + d.other;
  return {
    city: d.city,
    rent: -d.rent,
    food: -d.food,
    other: -d.other,
    surplus: d.income - totalExpenses,
  };
});

const keys = ['rent', 'food', 'other', 'surplus'];

const AffordabilityOverview: React.FC<AffordabilityOverviewProps> = ({
  width,
  tooltipState,
  setTooltipState,
}) => (
  <View>
    <Heading level={1} marginBottom='large'>
      Canada&apos;s Most Affordable City
    </Heading>
    <BarChartStacked
      tooltipState={tooltipState}
      setTooltipState={setTooltipState}
      data={processedData}
      labelAccessor={(d) => d.city as string}
      keys={keys}
      surplusKey='surplus'
      width={width}
      marginLeft={100}
    />
  </View>
);

export default AffordabilityOverview;
