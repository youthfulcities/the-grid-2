import BarChartStacked, {
  FlexibleDataItem,
} from '@/app/components/dataviz/BarChartStacked';
import { Button, Tabs, Text, View } from '@aws-amplify/ui-react';
import { SeriesPoint } from 'd3';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { TooltipState } from '../types/BasketTypes';
import { CategoryData } from '../types/CostTypes';
import { IncomeData } from '../types/IncomeTypes';
import { RentData } from '../types/RentTypes';
import ageMap from '../utils/ageMap';
import getIncome, { getIncomeSampleSize } from '../utils/calculateIncome';
import genderMap from '../utils/genderMap.json';
import occupationMap from '../utils/occupationMap.json';
import provinceMap from '../utils/provinceMap.json';

interface AffordabilityOverviewProps {
  width: number;
  setTooltipState: React.Dispatch<React.SetStateAction<TooltipState>>;
  cityTotals: { city: string; totalPrice: number }[];
  income: IncomeData;
  rent: RentData;
  move: CategoryData;
  play: CategoryData;
  work: CategoryData;
  live: CategoryData;
}

interface CityDataItem {
  city: string;
  income: number;
  other: number;
}

const cityData: CityDataItem[] = [];

type ChartView = {
  value: string;
  title: string;
  chartId: string;
  keys: string[];
  sort: (a: FlexibleDataItem, b: FlexibleDataItem) => number;
  colors?: string[];
};

const colors = [
  '#FBD166',
  '#00BFA9',
  '#2f4eac',
  '#8755AF',
  '#F6D9D7',
  '#B8D98D',
  '#339933',
];

const chartViews: ChartView[] = [
  {
    value: 'overview',
    title: 'Overview',
    chartId: 'affordability-overview',
    keys: ['deficit', 'total_expenses', 'surplus'],
    colors: [
      '#FBD166',
      '#B8D98D',
      '#00BFA9',
      '#2f4eac',
      '#8755AF',
      '#F6D9D7',
      '#F2695D',
    ],
    sort: (a, b) => {
      if (b.surplus !== a.surplus) {
        return (b.surplus as number) - (a.surplus as number);
      }
      return (b.deficit as number) - (a.deficit as number);
    },
  },
  {
    value: 'income',
    title: 'Income',
    chartId: 'affordability-income',
    keys: ['income'],
    sort: (a, b) => (b.income as number) - (a.income as number),
  },
  {
    value: 'costs',
    title: 'Costs',
    chartId: 'affordability-costs',
    keys: ['rent', 'move', 'live', 'work', 'play'],
    sort: (a, b) => (a.total_expenses as number) - (b.total_expenses as number),
  },
  {
    value: 'surplus',
    title: 'Surplus / Deficit',
    chartId: 'affordability-surplus-deficit',
    keys: ['surplus', 'deficit_'],
    colors: ['#B8D98D', '#F2695D'],
    sort: (a, b) => {
      if (b.surplus !== a.surplus) {
        return (b.surplus as number) - (a.surplus as number);
      }
      return (b.deficit as number) - (a.deficit as number);
    },
  },
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
  live,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState(null);
  const [drilldownLevel, setDrilldownLevel] = useState(0);
  const [customSortOrder, setCustomSortOrder] = useState<'asc' | 'desc' | null>(
    null
  );
  const [sortFn, setSortFn] = useState<
    ((a: FlexibleDataItem, b: FlexibleDataItem) => number) | null
  >(null);
  const [tab, setTab] = useState('overview');
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const {
    gender,
    setGender,
    age,
    customized,
    setCustomized,
    occupation,
    setOccupation,
    setCurrentIncome,
    setManIncome,
    student,
    setStudent,
    car,
    setCar,
  } = useProfile();

  const ageGroup = ageMap(age);
  const genderGroup = genderMap[gender as keyof typeof genderMap];
  const occupationGroup =
    occupationMap[occupation as keyof typeof occupationMap];

  income.sort(
    (a, b) =>
      b.median_monthly_income_post_tax - a.median_monthly_income_post_tax
  );

  const data = useMemo(() => {
    const averageValues = {
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
      live:
        gender === null
          ? (live.profiles?.all?.monthly_cost_by_city[city.city] ?? 0) +
            ((live.profiles?.women?.monthly_cost_by_city[city.city] ?? 0) +
              (live.profiles?.men?.monthly_cost_by_city[city.city] ?? 0)) /
              2
          : gender === 'man'
            ? (live.profiles?.all?.monthly_cost_by_city[city.city] ?? 0) +
              (live.profiles?.men.monthly_cost_by_city[city.city] ?? 0)
            : (live.profiles?.all?.monthly_cost_by_city[city.city] ?? 0) +
              (live.profiles?.women.monthly_cost_by_city[city.city] ?? 0),
      work:
        (student
          ? work.profiles?.student?.monthly_cost_by_city[city.city] ?? 0
          : 0) +
        (!student
          ? work.profiles?.all?.monthly_cost_by_city[city.city] ?? 0
          : 0),
      play: play.profiles?.all?.monthly_cost_by_city[city.city] ?? 0,
      move:
        (car
          ? move.profiles?.car_user?.monthly_cost_by_city[city.city] ?? 0
          : 0) +
        (student
          ? move.profiles?.student?.monthly_cost_by_city[city.city] ?? 0
          : 0) +
        (move.profiles?.all?.monthly_cost_by_city[city.city] ?? 0) +
        (!student
          ? move.profiles?.adult?.monthly_cost_by_city[city.city] ?? 0
          : 0),
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
      sample: getIncomeSampleSize({
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
      provincial: income.find((item) => item.city === city.city),
      other:
        cityData.find((item) => item.city === city.city)?.other ??
        averageValues.other,
    }));
  }, [
    cityTotals,
    rent,
    income,
    age,
    gender,
    occupation,
    customized,
    move,
    work,
    play,
    live,
    student,
    car,
  ]);

  const processedData = useMemo(
    () =>
      data.map((d) => {
        const totalExpenses = d.rent + d.play + d.work + d.move + d.live;
        return {
          city: `${d.city}${d.sample && d.sample < 50 ? '*' : ''}${!d.provincial ? '†' : ''}`,
          live: -d.live,
          work: -d.work,
          move: -d.move,
          play: -d.play,
          rent: -d.rent,
          sample: d.sample ?? '',
          income: d.income,
          income2020: d.income * 0.852,
          surplus: d.income - totalExpenses < 0 ? 0 : d.income - totalExpenses,
          deficit: d.income - totalExpenses > 0 ? 0 : d.income - totalExpenses,
          deficit_: d.income - totalExpenses > 0 ? 0 : d.income - totalExpenses,
          total_expenses: -totalExpenses,
        };
      }),
    [data]
  );

  const onBarClick = (d: FlexibleDataItem | SeriesPoint<FlexibleDataItem>) => {
    const { key } = d as FlexibleDataItem;
    if (
      key === 'move' ||
      key === 'work' ||
      key === 'play' ||
      key === 'live' ||
      key === 'total_expenses'
    ) {
      setSelectedSegments((prev) => [...(prev ?? []), key as string]);
      setDrilldownLevel((prev) => prev + 1);
    }
  };

  const sortedData = useMemo(() => {
    const currentView = chartViews.find((view) => view.value === tab);
    if (sortFn) {
      return [...processedData].sort(sortFn);
    }
    if (!currentView || !currentView.sort) return processedData;

    return [...processedData].sort(currentView.sort);
  }, [processedData, tab, sortFn]);

  const drilldownData = useMemo(() => {
    if (
      !selectedSegments ||
      !['move', 'work', 'play', 'live', 'total_expenses'].includes(
        selectedSegments[drilldownLevel - 1]
      )
    )
      return null;
    if (selectedSegments[drilldownLevel - 1] === 'total_expenses') {
      return sortedData;
    }

    const segment = { move, work, play, live }[
      selectedSegments[drilldownLevel - 1] as 'move' | 'work' | 'play' | 'live'
    ];
    const { indicators, total } = segment;
    const cities = Object.keys(total.monthly_cost_by_city || {});
    const unsorted = cities.map((city) => {
      const cityEntry: Record<string, string | number> = { city };
      let currentTotal = 0;
      Object.entries(indicators).forEach(([indicator, indicatorData]) => {
        const value = (() => {
          const { profiles } = indicatorData;
          const base = profiles?.all?.monthly_cost_by_city?.[city] ?? 0;

          if (selectedSegments[drilldownLevel - 1] === 'move') {
            return (
              base +
              (car
                ? profiles?.car_user?.monthly_cost_by_city?.[city] ?? 0
                : 0) +
              (student
                ? profiles?.student?.monthly_cost_by_city?.[city] ?? 0
                : 0) +
              (!student
                ? profiles?.adult?.monthly_cost_by_city?.[city] ?? 0
                : 0)
            );
          }

          if (selectedSegments[drilldownLevel - 1] === 'work') {
            return (
              (student
                ? profiles?.student?.monthly_cost_by_city?.[city] ?? 0
                : 0) + base
            );
          }

          if (selectedSegments[drilldownLevel - 1] === 'play') {
            return base; // No variants
          }

          if (selectedSegments[drilldownLevel - 1] === 'live') {
            const men = profiles?.men?.monthly_cost_by_city?.[city] ?? 0;
            const women = profiles?.women?.monthly_cost_by_city?.[city] ?? 0;
            if (gender === null) {
              return base + (men + women) / 2;
            }
            return gender === 'man' ? base + men : base + women;
          }

          return base;
        })();
        if (typeof value === 'number') {
          // Use negative value if needed (to match your existing logic)
          const negValue = -value;
          cityEntry[indicator] = negValue;
          currentTotal += negValue;
        }
      });
      cityEntry._total = currentTotal;
      return cityEntry;
    });

    const order = sortedData.map((d) => d.city);
    const originalOrder = [...unsorted].sort((a, b) => {
      const indexA = order.findIndex((city) => city.includes(a.city as string));
      const indexB = order.findIndex((city) => city.includes(b.city as string));
      return (
        (indexA === -1 ? Infinity : indexA) -
        (indexB === -1 ? Infinity : indexB)
      );
    });
    return originalOrder.map(({ _total, ...rest }) => rest);
  }, [
    selectedSegments,
    move,
    work,
    play,
    live,
    car,
    gender,
    student,
    processedData,
  ]);

  const drilldownKeys = useMemo(() => {
    if (
      !selectedSegments ||
      !['move', 'work', 'play', 'live', 'total_expenses'].includes(
        selectedSegments[drilldownLevel - 1] || ''
      )
    )
      return null;
    if (selectedSegments[drilldownLevel - 1] === 'total_expenses') {
      return ['rent', 'surplus', 'move', 'live', 'work', 'play', 'deficit'];
    }
    const segment = { move, work, play, live }[
      selectedSegments[drilldownLevel - 1] as 'move' | 'work' | 'play' | 'live'
    ];
    return Object.keys(segment.indicators);
  }, [selectedSegments, move, work, play, live, drilldownLevel]);

  const downloadJSON = () => {
    const json = JSON.stringify(processedData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'processedData.json';
    link.click();
    URL.revokeObjectURL(url);
  };

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

  useEffect(() => {
    setDrilldownLevel(0);
    setSelectedSegments([]);
  }, [tab]);

  const tooltipFormatter = useCallback(
    (
      d: FlexibleDataItem,
      key: string | undefined,
      value: number | undefined
    ) => {
      if (!key || !value) return null;
      return (
        <div>
          {`${d.city} ${key.replace('_', ' ')}: $${(value as number).toFixed(2)}`}
        </div>
      );
    },
    []
  );

  return (
    <View marginBottom='large'>
      <Tabs.Container value={tab} onValueChange={(t) => setTab(t)}>
        <Tabs.List marginBottom='large'>
          <Tabs.Item value='overview'>Overview</Tabs.Item>
          <Tabs.Item value='income'>Income</Tabs.Item>
          <Tabs.Item value='costs'>Costs</Tabs.Item>
          <Tabs.Item value='surplus'>Surplus / Deficit</Tabs.Item>
        </Tabs.List>
        {chartViews.map((view) => (
          <Tabs.Panel key={view.value} value={view.value}>
            <BarChartStacked
              id={view.chartId}
              loading={!(cityTotals?.length > 0 && processedData?.length > 0)}
              onBarClick={onBarClick}
              colors={view.colors ?? colors}
              setTooltipState={setTooltipState}
              tooltipFormatter={tooltipFormatter}
              data={
                drilldownLevel === 0
                  ? sortedData
                  : (drilldownData as FlexibleDataItem[])
              }
              keyAccessor={(d) => d.key as string}
              labelAccessor={(d) => d.city as string}
              keys={
                drilldownLevel === 0 ? view.keys : (drilldownKeys as string[])
              }
              width={width}
              height={800}
              marginLeft={100}
            >
              {drilldownLevel > 0 && (
                <Button
                  fontSize='small'
                  onClick={() => {
                    setDrilldownLevel((prev) => prev - 1);
                    setSelectedSegments((prev) => prev.splice(-1, 1));
                  }}
                >
                  Back
                </Button>
              )}
              <Button
                fontSize='small'
                color='#fff'
                onClick={() => {
                  setCustomized(false);
                  setGender(null);
                  setCar(false);
                  setStudent(false);
                  setOccupation('');
                }}
              >
                Reset customizations
              </Button>
              <Button fontSize='small' onClick={downloadJSON}>
                Download JSON
              </Button>
            </BarChartStacked>
          </Tabs.Panel>
        ))}
      </Tabs.Container>
      <Text fontSize='small' marginTop='small'>
        * represents income based on a sample size under 50. † represents income
        based on provincial average. Data comes from the Statistics Canada
        Labour Force Survey.
      </Text>
    </View>
  );
};

export default AffordabilityOverview;
