import BarChartStacked from '@/app/components/dataviz/BarChartStacked';
import { Button, Flex, Loader, View } from '@aws-amplify/ui-react';
import React, { useEffect, useMemo, useState } from 'react';
import { IncomeData } from '../types/IncomeTypes';
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
  age: number;
  gender: string;
  occupation: string;
  customized: boolean;
  setCustomized: React.Dispatch<React.SetStateAction<boolean>>;
  setManIncome: React.Dispatch<React.SetStateAction<number>>;
  setCurrentIncome: React.Dispatch<React.SetStateAction<number>>;
  width: number;
  setTooltipState: React.Dispatch<React.SetStateAction<TooltipState>>;
  cityTotals: { city: string; totalPrice: number }[];
  income: IncomeData;
}

interface RentItem {
  city: string;
  rent: number;
  bedrooms?: {
    0?: number;
    1?: number;
    2?: number;
    3?: number;
  };
}

type RentData = RentItem[];

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

// Preprocess

const keys = ['deficit', 'rent', 'food', 'clothing', 'surplus'];

const AffordabilityOverview: React.FC<AffordabilityOverviewProps> = ({
  gender,
  occupation,
  age,
  customized,
  setCustomized,
  setCurrentIncome,
  setManIncome,
  width,
  setTooltipState,
  cityTotals,
  income,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState(null);
  const [rent, setRent] = useState<RentData>([]);
  const [clothing, setClothing] = useState<ClothingData>([]);

  useEffect(() => {
    const fetchRent = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/rent');
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || 'Failed to load rent');
        }
        setRent(result);
        setErrorText(null);
      } catch (fetchError: unknown) {
        const error = fetchError as Error;
        console.error('Error fetching rent:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRent();
  }, []);

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

  const averageValues = {
    clothing:
      clothing.reduce((sum, item) => sum + item.totalPrice, 0) /
      (clothing.length || 1),
    food:
      cityTotals.reduce((sum, item) => sum + item.totalPrice, 0) /
      (cityTotals.length || 1),
    rent: rent.reduce((sum, item) => sum + item.rent, 0) / (rent.length || 1),
    income:
      income.reduce(
        (sum, item) => sum + item.median_monthly_income_post_tax,
        0
      ) / (income.length || 1),
    other:
      cityData.reduce((sum, item) => sum + item.other, 0) /
      (cityData.length || 1),
  };

  const data = useMemo(
    () =>
      rent.map((city) => ({
        city: city.city,
        clothing:
          (clothing.find((item) => item.city === city.city)?.totalPrice ??
            averageValues.clothing) / 12,
        food:
          cityTotals.find((item) => item.city === city.city)?.totalPrice ??
          averageValues.food,
        rent: city.rent ?? averageValues.rent,
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
      })),
    [cityTotals, rent, income, clothing, age, gender, occupation, customized]
  );

  const processedData = useMemo(
    () =>
      data.map((d) => {
        const totalExpenses = d.rent + d.food + d.other + d.clothing;
        return {
          city: d.city,
          rent: -d.rent,
          food: -d.food,
          clothing: -d.clothing,
          other: -d.other,
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
  }, [ageGroup, occupationGroup, genderGroup]);

  return (
    <View marginBottom='large'>
      {cityTotals?.length > 0 && processedData?.length > 0 ? (
        <>
          <BarChartStacked
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
