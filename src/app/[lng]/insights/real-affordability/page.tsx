'use client';

import Container from '@/app/components/Background';
import ChapterNav from '@/app/components/ChapterNav';
import Tooltip from '@/app/components/dataviz/TooltipChart/TooltipChart';
// import { TooltipState } from '@/app/components/dataviz/TooltipChart/TooltipState';
import FadeInUp from '@/app/components/FadeInUp';
import { useDimensions } from '@/hooks/useDimensions';
import { calculateGroceryTotals } from '@/utils/calculateGroceryTotals';
import fetchData from '@/utils/fetchData';
import { Heading, Text, View } from '@aws-amplify/ui-react';
import _ from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import AffordabilityOverview from './components/AffordabilityOverview';
import BasketBar from './components/BasketBar';
import CharacterCreator from './components/CharacterCreator';
import CharacterOverlay from './components/CharacterOverlay';
import Grocery from './components/Grocery';
import Housing from './components/Housing';
import HousingJourney from './components/HousingJourney';
import { useProfile } from './context/ProfileContext';
import useSectionInView from './hooks/useSectionInView';
import { GroceryItem, TooltipState } from './types/BasketTypes';
import { CategoryData } from './types/CostTypes';
import { IncomeData } from './types/IncomeTypes';
import { RentData } from './types/RentTypes';
import getLatestTimestamp from './utils/getLatestTimestamp';

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
  const [move, setMove] = useState({});
  const [play, setPlay] = useState({});
  const [work, setWork] = useState({});
  const [live, setLive] = useState({});
  const [incomeLoading, setIncomeLoading] = useState<boolean>(true);
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [groceryLoading, setGroceryLoading] = useState<boolean>(true);
  const [rent, setRent] = useState<RentData>([]);
  const [rentLoading, setRentLoading] = useState<boolean>(true);
  const [latestTimestamp, setLatestTimestamp] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<
    string | null | undefined | unknown
  >(null);
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    position: null,
  });

  const { basket } = useProfile();

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
      const path = 'internal/RAI/move';
      const activeFile = 'move_category.json';
      const text = await fetchData(path, activeFile);
      const jsonData = JSON.parse(text as string);
      setMove(jsonData);
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const path = 'internal/RAI/play';
      const activeFile = 'play_category.json';
      const text = await fetchData(path, activeFile);
      const jsonData = JSON.parse(text as string);
      setPlay(jsonData);
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const path = 'internal/RAI/work';
      const activeFile = 'work_category.json';
      const text = await fetchData(path, activeFile);
      const jsonData = JSON.parse(text as string);
      setWork(jsonData);
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const path = 'internal/RAI/live';
      const activeFile = 'live_category.json';
      const text = await fetchData(path, activeFile);
      const jsonData = JSON.parse(text as string);
      setLive(jsonData);
    };
    loadData();
  }, []);

  useEffect(() => {
    const fetchGroceryItems = async () => {
      setGroceryLoading(true);
      try {
        const response = await fetch('/api/grocery/public/all');
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to load grocery items');
        }

        setGroceryItems(result);
        setLatestTimestamp(getLatestTimestamp(result));
        setErrorText(null);
      } catch (fetchError: unknown) {
        const error = fetchError as Error;
        console.error('Error fetching grocery items:', error);
      } finally {
        setGroceryLoading(false);
      }
    };
    fetchGroceryItems();
  }, []);

  useEffect(() => {
    const fetchIncome = async () => {
      setIncomeLoading(true);
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
        setIncomeLoading(false);
      }
    };
    fetchIncome();
  }, []);

  useEffect(() => {
    const fetchRent = async () => {
      setRentLoading(true);
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
        setRentLoading(false);
      }
    };
    fetchRent();
  }, []);

  const cityTotals = useMemo(() => {
    const totals = calculateGroceryTotals(groceryItems, basket);
    return totals.length > 0 ? _.orderBy(totals, ['totalPrice'], ['desc']) : [];
  }, [basket, groceryItems]);

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
                loading={groceryLoading}
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
              loading={rentLoading}
              rent={rent}
            />
          </View>
        </View>
      </Container>
      <BasketBar />
      {tooltipState.position && (
        <Tooltip
          x={tooltipState.position.x}
          content={tooltipState.content}
          y={tooltipState.position.y}
          group={tooltipState.group}
          child={tooltipState.child}
        />
      )}
      <CharacterOverlay
        income={income}
        profileInView={currentInView.creatorInView}
      />
      <ChapterNav currentInView={currentInView} steps={steps} />
    </>
  );
};

export default AffordabilityPage;
