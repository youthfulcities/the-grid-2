'use client';

import Container from '@/app/components/Background';
import {
  Button,
  Flex,
  Grid,
  Heading,
  Loader,
  Text,
  View,
} from '@aws-amplify/ui-react';
import { motion } from 'framer-motion';
import _ from 'lodash';
import Error from 'next/error';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import BasketBar from './components/BasketBar';
import GroceryPriceLabel from './components/GroceryPriceLabel';

interface GroceryItem {
  category: string;
  latest_timestamp?: string | null;
  average_quantity: number | null;
  canada_average_price: number | null;
  not_canada_average_price: number | null;
  canada_average_price_per_base: number | null;
  not_canada_average_price_per_base: number | null;
  canada_normalized_average: number | null;
  not_canada_normalized_average: number | null;
  category_average: number | null;
  category_normalized_average: number | null;
  average_price_per_base: number | null;
  average_base_amount: number | null;
  base_unit: string | null;
  cities: {
    city: string;
    prepared_in_canada: number | null;
    not_prepared_in_canada: number | null;
    city_average: number | null;
    latest_timestamp?: string | null;
  }[];
}

const GridWrapper = styled(Grid)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 32px;
  padding: 2rem;
  justify-items: center;
`;

const ImageWrapper = styled.div<{ $error: boolean }>`
  display: ${(props) => (props.$error ? 'none' : 'block')};
  position: relative;
  width: 120px;
  height: 120px;
  cursor: pointer;

  img {
    z-index: -1;
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }

  &:hover .label {
    display: block;
  }
`;

const MotionImage = styled(motion.div)`
  width: 100%;
  height: 100%;
  z-index: 0;
  will-change: transform;
`;

const getRandomOffset = () => ({
  rotate: Math.random() * 10 - 5, // -5 to +5 degrees
  x: Math.random() * 10 - 5, // -5 to +5 px
  y: Math.random() * 10 - 5,
});

const removeSpecialChars = (string: string) =>
  string.replace(/[^a-zA-Z ]/g, '').trim();

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

// Define the BasketEntry type
interface BasketEntry {
  item: GroceryItem;
  quantity: number;
}

const GroceryList: React.FC = () => {
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [latestTimestamp, setLatestTimestamp] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<
    string | null | undefined | unknown
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [imgError, setImgError] = useState<{ [key: string]: boolean }>({});
  const [basket, setBasket] = useState<{
    [key: string]: { item: GroceryItem; quantity: number };
  }>({});

  useEffect(() => {
    const fetchGroceryItems = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/grocery/public/unique');
        const result = await response.json();
        console.log(result);

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

  const handleAddToBasket = (item: GroceryItem) => {
    const key = removeSpecialChars(item.category);
    setBasket((prev) => {
      const existing = prev[key];
      return {
        ...prev,
        [key]: {
          item,
          quantity: existing ? existing.quantity + 1 : 1,
        },
      };
    });
  };

  const handleAddAll = () => {
    const allItems: GroceryItem[] = groceryItems;
    const all = allItems.reduce(
      (acc, item) => {
        const key = removeSpecialChars(item.category);
        acc[key] = { item, quantity: 1 };
        return acc;
      },
      {} as Record<string, BasketEntry>
    );
    setBasket(all);
  };

  const removeAll = () => {
    setBasket({});
  };

  // console.log('groceryItems', groceryItems);

  return (
    <Container>
      <View className='container padding'>
        <Heading level={1} marginBottom='small'>
          Canadian Grocery Prices
        </Heading>
        <Text>
          Prices are calculated based on average quantity x average price per
          unit. For example, the average large egg costs $0.51. This means 12
          eggs would cost $6.12. However, eggs can also be purchased in packs of
          18 or 30. Averaging the most common quantities from our search
          results, the quantity ends up being about 17 eggs. Therefore, the
          final price displayed is $8.85 (16.76 eggs x $0.51).
        </Text>
        {latestTimestamp && (
          <Text>
            Last updated: {new Date(latestTimestamp).toLocaleDateString()}
          </Text>
        )}
        <Flex>
          <Button onClick={handleAddAll} variation='primary'>
            Add All
          </Button>
          <Button onClick={removeAll} variation='primary'>
            Reset
          </Button>
        </Flex>
        {loading && (
          <Flex alignItems='center' margin='small'>
            <Loader size='large' />
          </Flex>
        )}
        <GridWrapper marginBottom='xxxl'>
          {groceryItems.map((item) => {
            const offset = getRandomOffset();
            const key = removeSpecialChars(item.category);
            return (
              <ImageWrapper
                $error={imgError[key]}
                key={key}
                onClick={() => handleAddToBasket(item)}
              >
                <MotionImage
                  initial={{
                    rotate: offset.rotate,
                    x: offset.x,
                    y: offset.y,
                  }}
                  whileHover={{ scale: 1.1, rotate: 0, x: 0, y: 0 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <img
                    onError={() =>
                      setImgError((prev) => ({
                        ...prev,
                        [key]: false,
                      }))
                    }
                    src={`/assets/food-icons/${key}.png`}
                    alt={item.category}
                  />
                </MotionImage>
                <GroceryPriceLabel
                  canadianPrice={
                    item.canada_normalized_average || item.canada_average_price
                  }
                  globalPrice={
                    item.not_canada_normalized_average ||
                    item.not_canada_average_price
                  }
                  baseUnit={item.base_unit}
                  baseQuantity={item.average_base_amount}
                  basePrice={
                    item.canada_average_price_per_base ||
                    item.not_canada_average_price_per_base
                  }
                  label={item.category}
                />
              </ImageWrapper>
            );
          })}
        </GridWrapper>
        <BasketBar basket={basket} />
      </View>
    </Container>
  );
};

export default GroceryList;
