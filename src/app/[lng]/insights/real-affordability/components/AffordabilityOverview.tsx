import BarChartStacked, {
  FlexibleDataItem,
} from '@/app/components/dataviz/BarChartStacked';
import { Button, Text, View } from '@aws-amplify/ui-react';
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

interface ClothingItem {
  city: string;
  totalPrice: number;
}

type ClothingData = ClothingItem[];

const keys = ['deficit', 'rent', 'move', 'live', 'work', 'play', 'surplus'];

const colors = [
  '#FBD166',
  '#00BFA9',
  '#2f4eac',
  '#8755AF',
  '#F6D9D7',
  '#B8D98D',
  '#af6860',
];

const colors5 = [
  '#F2695D', // 🔴 coral red (yours)
  '#F97C0B', // 🟠 vivid orange
  '#FBD166', // 🟡 golden yellow (yours)
  '#A3CB38', // 🟢 bright lime green
  '#B8D98D', // 🟢 muted green (yours)
  '#00BFA9', // 🔵 cyan teal
  '#2F4EAC', // 🔵 strong blue (yours)
  '#5125E8', // 🔵 deep violet (yours)
  '#8755AF', // 🟣 mid purple (harmonizes with 5125E8)
  '#FF5DA2', // 🟣 hot pink (replaces F6D9D7 for contrast)
];

const colors2 = [
  '#F2695D', // warm coral
  '#FBD166', // golden yellow
  '#B8D98D', // light olive green
  '#2F4EAC', // strong blue
  '#5125E8', // deep violet
  '#F6D9D7', // pale rose

  '#00BFA9', // teal
  '#FF8C42', // vivid orange
  '#CCCCFF', // soft lavender
  '#FF5DA2', // hot pink
  '#45D09E', // mint green
  '#82D4F2', // sky blue
  '#C678DD', // orchid purple
  '#FFD700', // bright gold
  '#38B000', // lime green
  '#E63946', // crimson
  '#6A4C93', // indigo
  '#0081A7', // cerulean
];

const colors20 = [
  '#F2695D', // vivid coral
  '#2F4EAC', // deep royal blue
  '#FBD166', // strong yellow
  '#6A4C93', // muted indigo
  '#00BFA9', // teal
  '#AF6860', // brick red
  '#45D09E', // mint green
  '#5125E8', // intense purple
  '#FF8C42', // vibrant orange
  '#0081A7', // cyan-cerulean
  '#E63946', // crimson
  '#38B000', // lime green
  '#C678DD', // orchid
  '#B8D98D', // soft olive
  '#FF5DA2', // hot pink
  '#1B998B', // dark aqua
  '#FFD700', // true gold
  '#4B3F72', // eggplant
  '#82D4F2', // sky blue
  '#C1292E', // dark cherry
];

const colors3 = [
  '#C1292E', // cherry red
  '#F2695D', // coral red-orange
  '#FF8C42', // vibrant orange
  '#FBD166', // golden yellow
  '#FFD700', // true gold
  '#B8D98D', // olive green
  '#38B000', // lime green
  '#45D09E', // mint green
  '#00BFA9', // teal
  '#1B998B', // dark aqua
  '#0081A7', // cerulean blue
  '#82D4F2', // sky blue (added for smoother transition)
  '#2F4EAC', // royal blue
  '#C9D5E9', // soft periwinkle (your pastel)
  '#5125E8', // strong indigo
  '#8755AF', // warm violet (your color)
  '#C678DD', // orchid purple
  '#7A2D59', // plum (adjusted from #550D35)
  '#FF5DA2', // hot pink
  '#4B3F72', // eggplant (neutral anchor)
];

const colors4 = [
  [
    '#D7263D', // 🔴 Strong red
    '#F46036', // 🟠 Vivid orange
    '#FFD23F', // 🟡 Bold yellow
    '#A3CB38', // 🟢 Bright lime green
    '#00BFA9', // 🔵 Cyan teal
    '#1089FF', // 🔵 Vivid blue
    '#3F51B5', // 🔵 Indigo blue
    '#8755AF', // 🟣 Medium violet (your color)
    '#C678DD', // 🟣 Orchid purple
    '#FF5DA2', // 🟣 Hot pink
  ],
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
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [clothing, setClothing] = useState<ClothingData>([]);
  const {
    gender,
    setGender,
    age,
    customized,
    setCustomized,
    occupation,
    setCurrentIncome,
    setManIncome,
    student,
    setStudent,
    car,
    setCar,
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
      // live:
      //   gender === null
      //     ? (live.profiles?.all?.monthly_cost_by_city[city.city] ?? 0) +
      //       ((live.profiles?.women?.monthly_cost_by_city[city.city] ?? 0) +
      //         (live.profiles?.men?.monthly_cost_by_city[city.city] ?? 0)) /
      //         2
      //     : gender === 'man'
      //       ? (live.profiles?.all?.monthly_cost_by_city[city.city] ?? 0) +
      //         (live.profiles?.men.monthly_cost_by_city[city.city] ?? 0)
      //       : (live.profiles?.all?.monthly_cost_by_city[city.city] ?? 0) +
      //         (live.profiles?.women.monthly_cost_by_city[city.city] ?? 0),
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
    clothing,
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
        const totalExpenses = d.rent + d.play + d.work + d.move;
        return {
          city: `${d.city}${d.sample && d.sample < 50 ? '*' : ''}${!d.provincial ? '†' : ''}`,
          // live: -d.live,
          work: -d.work,
          move: -d.move,
          play: -d.play,
          rent: -d.rent,
          sample: d.sample ?? '',
          income: d.income,
          surplus: d.income - totalExpenses < 0 ? 0 : d.income - totalExpenses,
          deficit: d.income - totalExpenses > 0 ? 0 : d.income - totalExpenses,
          totalExpenses,
        };
      }),
    [data]
  );

  const onBarClick = (d: FlexibleDataItem | SeriesPoint<FlexibleDataItem>) => {
    const { key } = d as FlexibleDataItem;
    if (key === 'move' || key === 'work' || key === 'play' || key === 'live') {
      setSelectedSegment(key as string);
      setDrilldownLevel(1);
    }
  };

  const drilldownData = useMemo(() => {
    if (
      !selectedSegment ||
      !['move', 'work', 'play', 'live'].includes(selectedSegment)
    )
      return null;

    const segment = { move, work, play, live }[
      selectedSegment as 'move' | 'work' | 'play' | 'live'
    ];
    const { indicators, total } = segment;

    const cities = Object.keys(total.monthly_cost_by_city || {});
    const unsorted = cities.map((city) => {
      const cityEntry: Record<string, string | number> = { city };
      let currentTotal = 0;
      Object.entries(indicators).forEach(([indicator, indicatorData]) => {
        const value = indicatorData.total.monthly_cost_by_city?.[city];
        if (typeof value === 'number') {
          cityEntry[indicator] = -value;
          currentTotal += -value;
        }
      });

      cityEntry._total = currentTotal;
      return cityEntry;
    });
    // Sort by total descending (most negative total first)
    const sorted = unsorted.sort(
      (a, b) => (b._total as number) - (a._total as number)
    );

    // Clean up temp property before returning
    return sorted.map(({ _total, ...rest }) => rest);
  }, [selectedSegment, move, work, play, live]);

  const drilldownKeys = useMemo(() => {
    if (
      !selectedSegment ||
      !['move', 'work', 'play', 'live'].includes(selectedSegment)
    )
      return null;
    const segment = { move, work, play, live }[
      selectedSegment as 'move' | 'work' | 'play' | 'live'
    ];
    return Object.keys(segment.indicators);
  }, [selectedSegment, move, work, play, live]);

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

  const tooltipFormatter = useCallback(
    (
      d: FlexibleDataItem,
      key: string | undefined,
      value: number | undefined
    ) => {
      if (!key || !value) return null;
      return (
        <div>
          {`${d.city} ${key}: $${(value as number).toFixed(2)}`}
          <br />
          {d.income &&
            `Total monthly income: $${(d.income as number).toFixed(2)}`}
        </div>
      );
    },
    []
  );

  return (
    <View marginBottom='large'>
      <BarChartStacked
        loading={!(cityTotals?.length > 0 && processedData?.length > 0)}
        onBarClick={onBarClick}
        colors={colors}
        setTooltipState={setTooltipState}
        tooltipFormatter={tooltipFormatter}
        data={
          drilldownLevel === 0
            ? processedData
            : (drilldownData as FlexibleDataItem[])
        }
        keyAccessor={(d) => d.key as string}
        labelAccessor={(d) => d.city as string}
        keys={drilldownLevel === 0 ? keys : (drilldownKeys as string[])}
        width={width}
        height={800}
        marginLeft={100}
      >
        {drilldownLevel > 0 && (
          <Button fontSize='small' onClick={() => setDrilldownLevel(0)}>
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
          }}
        >
          Reset customizations
        </Button>
      </BarChartStacked>
      <Text fontSize='small' marginTop='small'>
        * represents income based on a sample size under 50. † represents income
        based on provincial average. Data comes from the Statistics Canada
        Labour Force Survey.
      </Text>
    </View>
  );
};

export default AffordabilityOverview;
