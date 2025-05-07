'use client';

import Container from '@/app/components/Background';
import Tooltip from '@/app/components/dataviz/TooltipChart';
import { useDimensions } from '@/hooks/useDimensions';
import {
  calculateGroceryPrice,
  calculateGroceryTotals,
} from '@/utils/calculateGroceryTotals';
import { View } from '@aws-amplify/ui-react';
import _ from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import AffordabilityOverview from './components/AffordabilityOverview';
import BasketBar from './components/BasketBar';
import CharacterCreator from './components/CharacterCreator';
import Grocery from './components/Grocery';
import { BasketEntry, GroceryItem, TooltipState } from './types';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
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

  useEffect(() => {
    const fetchGroceryItems = async () => {
      setLoading(true);
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
        setLoading(false);
      }
    };
    fetchGroceryItems();
  }, []);

  const cityTotals = useMemo(() => {
    const totals = calculateGroceryTotals(groceryItems, basket);
    return totals.length > 0 ? _.orderBy(totals, ['totalPrice'], ['desc']) : [];
  }, [basket, groceryItems]);

  return (
    <>
      <Container>
        <View className='container padding' ref={containerRef}>
          <CharacterCreator />
          <AffordabilityOverview
            width={width}
            setTooltipState={setTooltipState}
            cityTotals={cityTotals}
          />
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
            loading={loading}
          />
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
    </>
  );
};

export default GroceryList;
