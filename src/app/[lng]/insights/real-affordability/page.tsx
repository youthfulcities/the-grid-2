'use client';

import Container from '@/app/components/Background';
import ChapterNav from '@/app/components/ChapterNav';
import Tooltip from '@/app/components/dataviz/TooltipChart/TooltipChart';
// import { TooltipState } from '@/app/components/dataviz/TooltipChart/TooltipState';
import { TooltipState } from '@/app/components/dataviz/TooltipChart/TooltipState';
import FadeInUp from '@/app/components/FadeInUp';
import { useDimensions } from '@/hooks/useDimensions';
import { calculateGroceryTotals } from '@/utils/calculateGroceryTotals';
import fetchData from '@/utils/fetchData';
import { Heading, Text, View } from '@aws-amplify/ui-react';
import _ from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import AffordabilityComparison from './components/AffordabilityComparison';
import AffordabilityOverview from './components/AffordabilityOverview';
import BasketBar from './components/BasketBar';
import CharacterCreator from './components/CharacterCreator';
import CharacterOverlay from './components/CharacterOverlay';
import Grocery from './components/Grocery';
import Housing from './components/Housing';
import HousingJourney from './components/HousingJourney';
import { useProfile } from './context/ProfileContext';
import useSectionInView from './hooks/useSectionInView';
import { GroceryItem } from './types/BasketTypes';
import { CategoryData, ProcessedDataItem } from './types/CostTypes';
import { IncomeData } from './types/IncomeTypes';
import { RentData } from './types/RentTypes';
import ageMap from './utils/ageMap';
import getIncome, { getIncomeSampleSize } from './utils/calculateIncome';
import genderMap from './utils/genderMap.json';
import getLatestTimestamp from './utils/getLatestTimestamp';
import occupationMap from './utils/occupationMap.json';
import provinceMap from './utils/provinceMap.json';

const steps = [
  { title: 'Affordability', key: 'overviewInView' },
  { title: 'Profile', key: 'creatorInView' },
  { title: 'Grocery', key: 'groceryInView' },
  { title: 'Housing', key: 'housingInView' },
];

const AffordabilityPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  // const [loading, setLoading] = useState<boolean>(true);
  const [income, setIncome] = useState<IncomeData>([]);
  const [move, setMove] = useState<CategoryData>({
    category: '',
    indicators: {},
    profiles: {},
    total: { monthly_cost_national: 0, monthly_cost_by_city: {} },
  });
  const [play, setPlay] = useState<CategoryData>({
    category: '',
    indicators: {},
    profiles: {},
    total: { monthly_cost_national: 0, monthly_cost_by_city: {} },
  });
  const [work, setWork] = useState<CategoryData>({
    category: '',
    indicators: {},
    profiles: {},
    total: { monthly_cost_national: 0, monthly_cost_by_city: {} },
  });
  const [live, setLive] = useState<CategoryData>({
    category: '',
    indicators: {},
    profiles: {},
    total: { monthly_cost_national: 0, monthly_cost_by_city: {} },
  });
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [rent, setRent] = useState<RentData>([]);
  const [latestTimestamp, setLatestTimestamp] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<
    string | null | undefined | unknown
  >(null);
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    position: null,
  });

  const { basket, customized, age, gender, student, car, occupation } =
    useProfile();

  const { width } = useDimensions(containerRef);
  const {
    creatorRef,
    overviewRef,
    groceryRef,
    housingRef,
    housingJourneyRef,
    inViewMap: currentInView,
  } = useSectionInView();

  useEffect(() => {
    const loadData = async () => {
      const path = 'internal/RAI/cache';
      const activeFile = 'cache.json';
      const text = await fetchData(path, activeFile);
      const jsonData = JSON.parse(text as string);
      setMove(jsonData.move);
      setLive(jsonData.live);
      setPlay(jsonData.play);
      setRent(jsonData.rent);
      setWork(jsonData.work);
      setGroceryItems(jsonData.groceryItems);
      setLatestTimestamp(getLatestTimestamp(jsonData.groceryItems));
      setIncome(jsonData.income);
    };
    loadData();
  }, []);

  const cityTotals = useMemo(() => {
    const totals = calculateGroceryTotals(groceryItems, basket);
    return totals.length > 0 ? _.orderBy(totals, ['totalPrice'], ['desc']) : [];
  }, [basket, groceryItems]);

  const data = useMemo<ProcessedDataItem[]>(() => {
    const averageValues = {
      food:
        cityTotals.reduce((sum, item) => sum + item.totalPrice, 0) /
        (cityTotals.length || 1),
      rent: rent.reduce((sum, item) => sum + item.rent, 0) / (rent.length || 1),
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

  const processedRentData = useMemo(
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

  return (
    <>
      <Container>
        <View className='container padding' ref={containerRef}>
          <FadeInUp>
            <Heading level={1} marginBottom='large'>
              Canada&apos;s Most{' '}
              <span className='highlight'>Affordable City</span>
            </Heading>
            <Heading level={4}>Real Afforability Index 2025</Heading>
            <Text marginBottom='xxl'>
              What does it really cost to live in cities across Canada? The Real
              Affordability Index goes beyond average rent or income figures to
              reveal the actual monthly surplus or deficit faced by youth. This
              interactive chart highlights how income, expenses, and lived
              experiences intersect to shape financial stability—or strain—in
              each city. Use it to uncover the gaps between perception and
              reality in Canada’s affordability landscape.
            </Text>
            <View ref={overviewRef} data-section='overviewInView'>
              <AffordabilityOverview
                data={data}
                work={work as CategoryData}
                move={move as CategoryData}
                play={play as CategoryData}
                live={live as CategoryData}
                rent={rent}
                income={income}
                width={width}
                setTooltipState={setTooltipState}
                cityTotals={cityTotals}
              />
            </View>
          </FadeInUp>
          <FadeInUp>
            <View ref={creatorRef} data-section='creatorInView'>
              <Text marginTop='xxl'>
                Try changing the income and expenses using the profile to see
                how affordability shifts across gender, occupation, and life
                stages.
              </Text>
              <CharacterCreator />
              <AffordabilityComparison
                data={data}
                income={income}
                tooltipState={tooltipState}
                setTooltipState={setTooltipState}
              />
            </View>
          </FadeInUp>
          <FadeInUp>
            <View
              ref={groceryRef}
              data-section='groceryInView'
              marginTop='xxxl'
            >
              <Grocery
                cityTotals={cityTotals}
                groceryItems={groceryItems}
                latestTimestamp={latestTimestamp}
                setTooltipState={setTooltipState}
                width={width}
                loading={groceryItems.length === 0}
              />
            </View>
          </FadeInUp>
          <FadeInUp>
            <View ref={housingRef} data-section='housingInView'>
              <Housing
                processedData={processedRentData}
                width={width}
                setTooltipState={setTooltipState}
              />
            </View>
          </FadeInUp>
          <View ref={housingJourneyRef} data-section='housingJourneyInView'>
            <HousingJourney
              processedData={processedRentData}
              loading={rent.length === 0}
              rent={rent}
            />
          </View>
        </View>
      </Container>
      <BasketBar />
      <Tooltip />
      <CharacterOverlay
        income={income}
        profileInView={currentInView.creatorInView}
      />
      <ChapterNav currentInView={currentInView} steps={steps} />
    </>
  );
};

export default AffordabilityPage;
