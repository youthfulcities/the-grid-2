import BarChartStacked from '@/app/components/dataviz/BarChartStacked';
import { Button, Flex, Loader, View } from '@aws-amplify/ui-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { IncomeData } from '../types/IncomeTypes';
import { RentData } from '../types/RentTypes';
import ageMap from '../utils/ageMap';
import getIncome from '../utils/calculateIncome';
import genderMap from '../utils/genderMap.json';
import occupationMap from '../utils/occupationMap.json';
import provinceMap from '../utils/provinceMap.json';

interface TooltipState {
  position: { x: number; y: number } | null;
  content?: string;
  group?: string;
}

interface AffordabilityOverviewProps {
  width: number;
  setTooltipState: React.Dispatch<React.SetStateAction<TooltipState>>;
  cityTotals: { city: string; totalPrice: number }[];
  income: IncomeData;
  rent: RentData;
}

interface CityDataItem {
  city: string;
  income: number;
  other: number;
}

const cityData: CityDataItem[] = [];

interface ClothingItem {
  city: string;
  totalPrice: number;
}

type ClothingData = ClothingItem[];

const keys = [
  'deficit',
  'rent',
  'move',
  'work',
  'play',
  'food',
  'clothing',
  'surplus',
];

const colors = [
  '#253D88',
  '#673934',
  '#FBD166',
  '#5125E8',
  '#F6D9D7',
  '#550D35',
  '#B8D98D',
];

const AffordabilityOverview: React.FC<AffordabilityOverviewProps> = ({
  width,
  setTooltipState,
  cityTotals,
  income,
  rent,
  move,
  work,
  play,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState(null);
  const [clothing, setClothing] = useState<ClothingData>([]);
  const {
    gender,
    age,
    customized,
    setCustomized,
    occupation,
    setCurrentIncome,
    setManIncome,
  } = useProfile();

  useEffect(() => {
    const fetchClothing = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/clothing/totals');
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || 'Failed to load income');
        }
        setClothing(result);
        setErrorText(null);
      } catch (fetchError: unknown) {
        const error = fetchError as Error;
        console.error('Error fetching income:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClothing();
  }, []);

  const ageGroup = ageMap(age);
  const genderGroup = genderMap[gender as keyof typeof genderMap];
  const occupationGroup =
    occupationMap[occupation as keyof typeof occupationMap];

  income.sort(
    (a, b) =>
      b.weighted_avg_monthly_income_post_tax -
      a.weighted_avg_monthly_income_post_tax
  );

  const data = useMemo(() => {
    const averageValues = {
      clothing:
        clothing.reduce((sum, item) => sum + item.totalPrice, 0) /
        (clothing.length || 1),
      food:
        cityTotals.reduce((sum, item) => sum + item.totalPrice, 0) /
        (cityTotals.length || 1),
      rent: rent.reduce((sum, item) => sum + item.rent, 0) / (rent.length || 1),
      other:
        cityData.reduce((sum, item) => sum + item.other, 0) /
        (cityData.length || 1),
    };

    return cityTotals.map((city) => ({
      city: city.city,
      work: work.total_monthly_cost_by_city[city.city] ?? 0,
      play: play.total_monthly_cost_by_city[city.city] ?? 0,
      move: move.total_monthly_cost_by_city[city.city] ?? 0,
      clothing:
        clothing.find((item) => item.city === city.city)?.totalPrice ?? 0 / 12,
      food:
        cityTotals.find((item) => item.city === city.city)?.totalPrice ??
        averageValues.food,
      rent:
        rent.find((item) => item.city === city.city)?.rent ??
        averageValues.rent,
      income: getIncome({
        city: city.city,
        currentProvince: provinceMap[city.city as keyof typeof provinceMap],
        currentAge: customized ? ageMap(age) : undefined,
        currentGender: customized
          ? genderMap[gender as keyof typeof genderMap]
          : undefined,
        currentOccupation: customized
          ? occupationMap[occupation as keyof typeof occupationMap]
          : undefined,
        income,
      }),
      other:
        cityData.find((item) => item.city === city.city)?.other ??
        averageValues.other,
    }));
  }, [
    cityTotals,
    rent,
    income,
    clothing,
    age,
    gender,
    occupation,
    customized,
    move,
    work,
    play,
  ]);

  const processedData = useMemo(
    () =>
      data.map((d) => {
        const totalExpenses =
          d.rent + d.food + d.clothing + d.play + d.work + d.move;
        return {
          city: d.city,
          work: -d.work,
          move: -d.move,
          play: -d.play,
          rent: -d.rent,
          food: -d.food,
          clothing: -d.clothing,
          surplus: d.income - totalExpenses < 0 ? 0 : d.income - totalExpenses,
          deficit: d.income - totalExpenses > 0 ? 0 : d.income - totalExpenses,
          totalExpenses,
        };
      }),
    [data]
  );

  processedData.sort((a, b) => {
    if (b.surplus !== a.surplus) {
      return b.surplus - a.surplus;
    }
    return b.deficit - a.deficit;
  });

  useEffect(() => {
    setManIncome(
      getIncome({
        currentAge: ageGroup,
        currentGender: 'Men+',
        currentOccupation: occupationGroup,
        income,
      })
    );
    setCurrentIncome(
      getIncome({
        currentAge: ageGroup,
        currentGender: genderGroup,
        currentOccupation: occupationGroup,
        income,
      })
    );
  }, [ageGroup, occupationGroup, genderGroup, income]);

  return (
    <View marginBottom='large'>
      {cityTotals?.length > 0 && processedData?.length > 0 ? (
        <>
          <BarChartStacked
            colors={colors}
            setTooltipState={setTooltipState}
            data={processedData}
            labelAccessor={(d) => d.city as string}
            keys={keys}
            width={width}
            height={800}
            marginLeft={100}
          />
          <Button
            fontSize='small'
            marginLeft='small'
            color='#fff'
            onClick={() => setCustomized(false)}
          >
            Reset customizations
          </Button>
        </>
      ) : (
        <Flex alignItems='center' margin='small'>
          <Loader size='large' />
        </Flex>
      )}
    </View>
  );
};

export default AffordabilityOverview;
