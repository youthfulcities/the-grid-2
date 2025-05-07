import BarChartStacked from '@/app/components/dataviz/BarChartStacked';
import { Flex, Heading, Loader, View } from '@aws-amplify/ui-react';
import React, { useEffect, useMemo, useState } from 'react';

interface TooltipState {
  position: { x: number; y: number } | null;
  content?: string;
  group?: string;
}

interface AffordabilityOverviewProps {
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

const keys = ['rent', 'food', 'other', 'surplus'];

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

const AffordabilityOverview: React.FC<AffordabilityOverviewProps> = ({
  width,
  setTooltipState,
  cityTotals,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState(null);
  const [rent, setRent] = useState<RentData>([]);
  const [income, setIncome] = useState<IncomeData>([]);

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

  const data = useMemo(
    () =>
      rent.map((city) => ({
        city: city.city,
        food:
          cityTotals.find((item) => item.city === city.city)?.totalPrice ?? 0,
        rent: city.rent,
        income:
          (income.find((item) => item.city === city.city)
            ?.median_monthly_income_post_tax ||
            income.find(
              (item) =>
                item.province === province[city.city as keyof typeof province]
            )?.median_monthly_income) ??
          0,
        other: cityData.find((item) => item.city === city.city)?.other ?? 0,
      })),
    [cityTotals, rent, income]
  );
  const processedData = useMemo(
    () =>
      data.map((d) => {
        const totalExpenses = d.rent + d.food + d.other;
        return {
          city: d.city,
          rent: -d.rent,
          food: -d.food,
          other: -d.other,
          surplus: d.income - totalExpenses < 0 ? 0 : d.income - totalExpenses,
          totalExpenses,
        };
      }),
    [data]
  );

  processedData.sort((a, b) => {
    if (b.surplus !== a.surplus) {
      return b.surplus - a.surplus;
    }
    return b.totalExpenses - a.totalExpenses;
  });

  return (
    <View marginBottom='large'>
      <Heading level={1} marginBottom='large'>
        Canada&apos;s Most <span className='highlight'>Affordable City</span>
      </Heading>
      {cityTotals?.length > 0 && processedData?.length > 0 ? (
        <BarChartStacked
          setTooltipState={setTooltipState}
          data={processedData}
          labelAccessor={(d) => d.city as string}
          keys={keys}
          width={width}
          height={800}
          marginLeft={100}
        />
      ) : (
        <Flex alignItems='center' margin='small'>
          <Loader size='large' />
        </Flex>
      )}
    </View>
  );
};

export default AffordabilityOverview;
