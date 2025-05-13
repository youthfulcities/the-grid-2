import BarChartStacked from '@/app/components/dataviz/BarChartStacked';
import { Button, Flex, Loader, View } from '@aws-amplify/ui-react';
import React, { useEffect, useMemo, useState } from 'react';

interface TooltipState {
  position: { x: number; y: number } | null;
  content?: string;
  group?: string;
}

interface AffordabilityOverviewProps {
  age: number;
  gender: string;
  occupation: number;
  customized: boolean;
  setCustomized: React.Dispatch<React.SetStateAction<boolean>>;
  setManIncome: React.Dispatch<React.SetStateAction<number>>;
  setCurrentIncome: React.Dispatch<React.SetStateAction<number>>;
  width: number;
  setTooltipState: React.Dispatch<React.SetStateAction<TooltipState>>;
  cityTotals: { city: string; totalPrice: number }[];
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

interface IncomeItem {
  city: string;
  province: string;
  avg_monthly_income: number;
  avg_monthly_income_post_tax: number;
  median_monthly_income: number;
  median_monthly_income_post_tax: number;
  weighted_avg_monthly_income: number;
  weighted_avg_monthly_income_post_tax: number;
  data: [
    {
      Age_12_Group: string;
      Gender_Label: string;
      NOC_Class: string;
      'Province Name': string;
      avg_hrlyearn: number;
      avg_hrlyearn_post_tax: number;
      avg_monthly_income: number;
      avg_monthly_income_post_tax: number;
      median_hrlyearn: number;
      median_hrlyearn_post_tax: number;
      median_monthly_income: number;
      median_monthly_income_post_tax: number;
      sample_size: number;
    },
  ];
}

type IncomeData = IncomeItem[];

// Preprocess

const keys = ['deficit', 'rent', 'food', 'clothing', 'surplus'];

const province = {
  'Ottawa-Gatineau': 'Ontario',
  'Kitchener-Waterloo': 'Ontario',
  Quebec: 'Quebec',
  "St. John's": 'Newfoundland and Labrador',
  Saskatoon: 'Saskatchewan',
  Vancouver: 'British Columbia',
  Mississauga: 'Ontario',
  Coquitlam: 'British Columbia',
  Richmond: 'British Columbia',
  Burnaby: 'British Columbia',
  Surrey: 'British Columbia',
  Toronto: 'Ontario',
  Langley: 'British Columbia',
  Oshawa: 'Ontario',
  Delta: 'British Columbia',
  Saanich: 'British Columbia',
  Halifax: 'Nova Scotia',
  Victoria: 'British Columbia',
  Hamilton: 'Ontario',
  London: 'Ontario',
  Calgary: 'Alberta',
  Sudbury: 'Ontario',
  Brampton: 'Ontario',
  Moncton: 'New Brunswick',
  Fredericton: 'New Brunswick',
  Laval: 'Quebec',
  Kelowna: 'British Columbia',
  Montreal: 'Quebec',
  Lethbridge: 'Alberta',
  Charlottetown: 'Prince Edward Island',
  Regina: 'Saskatchewan',
  Edmonton: 'Alberta',
  Winnipeg: 'Manitoba',
};

const ageMap = (age: number): string | undefined => {
  if (age >= 15 && age <= 19) {
    return '15 to 19 years';
  }
  if (age >= 20 && age <= 24) {
    return '20 to 24 years';
  }
  if (age >= 15 && age <= 19) {
    return '15 to 19 years';
  }
  if (age >= 25 && age <= 29) {
    return '25 to 29 years';
  }
};

const occupationMap = {
  0: 'Management occupations',
  1: 'Business, finance & admin occupations, except management',
  2: 'Natural & applied sciences occupations, except management',
  3: 'Health occupations, except management',
  4: 'Education, law & social, community & government services occupations',
  5: 'Art, culture, recreation & sport occupations, except management',
  6: 'Sales & service occupations, except management',
  7: 'Trades, transport & equipment operators & related occupations',
  8: 'Natural resources, agriculture & related production occupations',
  9: 'Manufacturing & utilities occupations, except management',
};

const genderMap = {
  woman: 'Women+',
  man: 'Men+',
  nonbinary: 'Women+',
};

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
}) => {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState(null);
  const [rent, setRent] = useState<RentData>([]);
  const [income, setIncome] = useState<IncomeData>([]);
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
    const fetchIncome = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/income');
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || 'Failed to load income');
        }
        setIncome(result);
        setErrorText(null);
      } catch (fetchError: unknown) {
        const error = fetchError as Error;
        console.error('Error fetching income:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIncome();
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

  const getIncome = ({
    city,
    currentProvince,
    currentAge,
    currentGender,
    currentOccupation,
  }: {
    city?: string;
    currentProvince?: string;
    currentAge?: string;
    currentGender?: string;
    currentOccupation?: string;
  }): number => {
    const normalizeMatch = (entry: any) =>
      (!customized || !currentAge || entry.Age_12_Group === currentAge) &&
      (!customized || !currentGender || entry.Gender_Label === currentGender) &&
      (!customized ||
        !currentOccupation ||
        entry.NOC_Class === currentOccupation);

    if (city) {
      const cityEntry = income.find(
        (item) =>
          item.city === city || item.city === `Other CMA - ${currentProvince}`
      );

      const nestedMatch = cityEntry?.data?.find(normalizeMatch);

      return (
        nestedMatch?.median_monthly_income_post_tax ??
        cityEntry?.median_monthly_income_post_tax ??
        income.find(
          (item) => item.province === province[city as keyof typeof province]
        )?.median_monthly_income ??
        averageValues.income
      );
    }

    // Fallback: average across all entries matching the filters
    const allIncomes = income
      .flatMap(
        (item) =>
          item.data
            ?.filter(normalizeMatch)
            .map((entry) => entry.median_monthly_income_post_tax) || []
      )
      .filter((val) => typeof val === 'number');

    console.log(city, allIncomes);

    if (allIncomes.length > 0) {
      const avg =
        allIncomes.reduce((sum, val) => sum + val, 0) / allIncomes.length;
      return avg;
    }
    // Final fallback if no matches at all
    return averageValues.income;
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
          currentProvince: province[city.city as keyof typeof province],
          currentAge: customized ? ageMap(age) : undefined,
          currentGender: customized
            ? genderMap[gender as keyof typeof genderMap]
            : undefined,
          currentOccupation: customized
            ? occupationMap[occupation as keyof typeof occupationMap]
            : undefined,
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
      })
    );
    setCurrentIncome(
      getIncome({
        currentAge: ageGroup,
        currentGender: genderGroup,
        currentOccupation: occupationGroup,
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
