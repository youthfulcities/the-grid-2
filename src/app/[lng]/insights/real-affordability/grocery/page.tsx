'use client';

import Container from '@/app/components/Background';
import FadeInUp from '@/app/components/FadeInUp';
import { useDimensions } from '@/hooks/useDimensions';
import { calculateGroceryTotals } from '@/utils/calculateGroceryTotals';
import { View } from '@aws-amplify/ui-react';
import _ from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import BasketBar from '../components/BasketBar';
import Grocery from '../components/Grocery';
import { useProfile } from '../context/ProfileContext';
import { GroceryItem } from '../types/BasketTypes';
import getLatestTimestamp from '../utils/getLatestTimestamp';

const GroceryPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [groceryLoading, setGroceryLoading] = useState<boolean>(true);
  const { basket } = useProfile();
  const { width } = useDimensions(containerRef);
  const [latestTimestamp, setLatestTimestamp] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<
    string | null | undefined | unknown
  >(null);

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

  const cityTotals = useMemo(() => {
    const totals = calculateGroceryTotals(groceryItems, basket);
    return totals.length > 0 ? _.orderBy(totals, ['totalPrice'], ['desc']) : [];
  }, [basket, groceryItems]);

  return (
    <Container>
      <View className='container padding' ref={containerRef}>
        <FadeInUp>
          <Grocery
            cityTotals={cityTotals}
            groceryItems={groceryItems}
            latestTimestamp={latestTimestamp}
            width={width}
            loading={groceryLoading}
          />
          <BasketBar />
        </FadeInUp>
      </View>
    </Container>
  );
};

export default GroceryPage;
