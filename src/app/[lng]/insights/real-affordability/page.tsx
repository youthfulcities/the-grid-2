'use client';

import Container from '@/app/components/Background';
import ChapterNav from '@/app/components/ChapterNav';
import Tooltip from '@/app/components/dataviz/TooltipChart/TooltipChart';
import FadeInUp from '@/app/components/FadeInUp';
import { useDimensions } from '@/hooks/useDimensions';
import {
  calculateGroceryPrice,
  calculateGroceryTotals,
} from '@/utils/calculateGroceryTotals';
import { Heading, View } from '@aws-amplify/ui-react';
import _ from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import AffordabilityOverview from './components/AffordabilityOverview';
import BasketBar from './components/BasketBar';
import CharacterCreator from './components/CharacterCreator';
import CharacterOverlay from './components/CharacterOverlay';
import Grocery from './components/Grocery';
import Housing from './components/Housing';
import HousingJourney from './components/HousingJourney';
import { AvatarProvider } from './context/AvatarContext';
import useSectionInView from './hooks/useSectionInView';
import { BasketEntry, GroceryItem, TooltipState } from './types/BasketTypes';
import { IncomeData } from './types/IncomeTypes';
import { RentData } from './types/RentTypes';
const steps = [
  { title: 'Affordability', key: 'overviewInView' },
  { title: 'Profile', key: 'creatorInView' },
  { title: 'Grocery', key: 'groceryInView' },
  { title: 'Housing', key: 'housingInView' },
];
const getLatestTimestamp = (items: GroceryItem[]): string | null => {
  const allTimestamps = _.flatMap(items, (item) => {
    const topLevel = item.latest_timestamp ? [item.latest_timestamp] : [];
    const nested =
      item.cities?.map((city) => city.latest_timestamp).filter(Boolean) || [];
    return [...topLevel, ...nested];
  });

  const latest = _.maxBy(
    allTimestamps.filter((ts): ts is string => ts !== null && ts !== undefined),
    (ts) => new Date(ts).getTime()
  );
  return latest ?? null;
};
const GroceryList: React.FC = () => {
  const [gender, setGender] = useState('woman');
  const [occupation, setOccupation] = useState('0');
  const [age, setAge] = useState(19);
  const [customized, setCustomized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [income, setIncome] = useState<IncomeData>([]);
  const [incomeLoading, setIncomeLoading] = useState<boolean>(true);
  const [manIncome, setManIncome] = useState<number>(0);
  const [currentIncome, setCurrentIncome] = useState<number>(0);
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [groceryLoading, setGroceryLoading] = useState<boolean>(true);
  const [rent, setRent] = useState<RentData>([]);
  const [rentLoading, setRentLoading] = useState<boolean>(true);
  const [latestTimestamp, setLatestTimestamp] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<
    string | null | undefined | unknown
  >(null);
  const [basket, setBasket] = useState<Record<string, BasketEntry>>({});
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    position: null,
  });
  const [activeCity, setActiveCity] = useState<string | null>(null);
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
    <AvatarProvider>
      <Container>
        <View className='container padding' ref={containerRef}>
          <FadeInUp>
            <Heading level={1} marginBottom='large'>
              Canada&apos;s Most{' '}
              <span className='highlight'>Affordable City</span>
            </Heading>
            <View ref={overviewRef} data-section='overviewInView'>
              <AffordabilityOverview
                rent={rent}
                setCurrentIncome={setCurrentIncome}
                setManIncome={setManIncome}
                income={income}
                gender={gender}
                occupation={occupation}
                age={age}
                customized={customized}
                setCustomized={setCustomized}
                width={width}
                setTooltipState={setTooltipState}
                cityTotals={cityTotals}
              />
            </View>
          </FadeInUp>
          <FadeInUp>
            <View ref={creatorRef} data-section='creatorInView'>
              <CharacterCreator
                currentIncome={currentIncome}
                customized={customized}
                manIncome={manIncome}
                gender={gender}
                setGender={setGender}
                occupation={occupation}
                setOccupation={setOccupation}
                age={age}
                setAge={setAge}
                setCustomized={setCustomized}
              />
            </View>
          </FadeInUp>
          <FadeInUp>
            <View ref={groceryRef} data-section='groceryInView'>
              <Grocery
                basket={basket}
                activeCity={activeCity}
                setActiveCity={setActiveCity}
                cityTotals={cityTotals}
                groceryItems={groceryItems}
                latestTimestamp={latestTimestamp}
                setBasket={setBasket}
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
                loading={rentLoading}
                setTooltipState={setTooltipState}
                activeCity={activeCity}
                setActiveCity={setActiveCity}
              />
            </View>
          </FadeInUp>
          <View ref={housingJourneyRef} data-section='housingJourneyInView'>
            <HousingJourney
              processedData={processedRentData}
              loading={rentLoading}
              rent={rent}
              income={currentIncome}
              activeCity={activeCity}
            />
          </View>
        </View>
      </Container>
      <BasketBar
        calculateGroceryPrice={calculateGroceryPrice}
        basket={basket}
        setBasket={setBasket}
        activeCity={activeCity}
      />
      {tooltipState.position && (
        <Tooltip
          x={tooltipState.position.x}
          content={tooltipState.content}
          y={tooltipState.position.y}
          group={tooltipState.group}
          child={tooltipState.child}
          minWidth={tooltipState.minWidth}
        />
      )}
      <CharacterOverlay
        income={income}
        profileInView={currentInView.creatorInView}
        housingJourneyInView={currentInView.housingJourneyInView}
        character={{ age, gender, occupation, currentIncome }}
        activeCity={activeCity}
      />
      <ChapterNav currentInView={currentInView} steps={steps} />
    </AvatarProvider>
  );
};

export default GroceryList;
