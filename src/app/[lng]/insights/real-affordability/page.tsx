'use client';

import Container from '@/app/components/Background';
import BarChart from '@/app/components/dataviz/BarChartGeneral';
import Tooltip from '@/app/components/dataviz/TooltipChart';
import { useDimensions } from '@/hooks/useDimensions';
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
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  most_frequent_quantity: number | null;
  category_average: number | null;
  category_normalized_average: number | null;
  average_price_per_base: number | null;
  average_base_amount: number | null;
  base_unit: string | null;
  cities: {
    city: string;
    base_unit: string | null;
    canada_average_price_per_base: number | null;
    not_canada_average_price_per_base: number | null;
    quantity_unit?: number | null;
    latest_timestamp?: string | null;
    canada_average_price: number | null;
    canada_normalized_average: number | null;
    not_canada_average_price: number | null;
    not_canada_normalized_average: number | null;
    average_base_amount: number | null;
  }[];
}

interface BasketEntry {
  item: GroceryItem;
  quantity: number;
}

interface TooltipState {
  position: { x: number; y: number } | null;
  value?: number | null;
  topic?: string;
  content?: string;
  group?: string;
  cluster?: string;
  child?: React.ReactNode | null;
  minWidth?: number;
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

const GroceryList: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [latestTimestamp, setLatestTimestamp] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<
    string | null | undefined | unknown
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [imgError, setImgError] = useState<{ [key: string]: boolean }>({});
  const [basket, setBasket] = useState<Record<string, BasketEntry>>({});
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    position: null,
  });
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const { width } = useDimensions(containerRef);

  const calculatePrice = (
    item: any,
    city: any,
    canadian: boolean | null = null
  ): number => {
    const {
      canada_average_price: city_canada_average_price,
      not_canada_average_price: city_not_canada_average_price,
      canada_average_price_per_base: city_canada_price_per_base,
      not_canada_average_price_per_base: city_not_canada_price_per_base,
    } = city || {};

    const {
      statscan_quantity,
      most_frequent_quantity,
      canada_average_price_per_base,
      not_canada_average_price_per_base,
      canada_average_price,
      not_canada_average_price,
    } = item;

    const quantity = statscan_quantity ?? most_frequent_quantity ?? 1;

    if (canadian === null) {
      const pricePerBase =
        city_canada_price_per_base ??
        city_not_canada_price_per_base ??
        canada_average_price_per_base ??
        not_canada_average_price_per_base ??
        0;

      if (pricePerBase > 0) {
        return pricePerBase * quantity;
      }

      // Fallback to raw average prices
      return (
        city_canada_average_price ??
        city_not_canada_average_price ??
        canada_average_price ??
        not_canada_average_price ??
        0
      );
    }

    if (canadian) {
      const pricePerBase =
        city_canada_price_per_base ?? canada_average_price_per_base ?? 0;

      if (pricePerBase > 0) {
        return pricePerBase * quantity;
      }

      return city_canada_average_price ?? canada_average_price ?? 0;
    }

    const pricePerBase =
      city_not_canada_price_per_base ?? not_canada_average_price_per_base ?? 0;

    if (pricePerBase > 0) {
      return pricePerBase * quantity;
    }

    return city_not_canada_average_price ?? not_canada_average_price ?? 0;
  };

  const calculateCityTotals = React.useCallback(() => {
    const cityTotals: Record<string, number> = {};

    if (groceryItems.length === 0) return [];

    if (Object.keys(basket).length === 0) {
      // Calculate totals for all cities and all items
      const allCities = new Set(
        groceryItems.flatMap((item) => item.cities.map((c) => c.city))
      );

      allCities.forEach((cityName) => {
        groceryItems.forEach((item) => {
          const cityData = item.cities.find((c) => c.city === cityName);
          const value = calculatePrice(item, cityData ?? null, null);
          cityTotals[cityName] = (cityTotals[cityName] || 0) + value;
        });
      });
    } else {
      // Loop over all cities in items, and calculate based on what's in the basket
      const allCities = new Set(
        groceryItems.flatMap((item) => item.cities.map((c) => c.city))
      );

      allCities.forEach((cityName) => {
        Object.values(basket).forEach(({ item, quantity }) => {
          const cityData = item.cities.find((c) => c.city === cityName);
          const value = calculatePrice(item, cityData ?? null, null);
          cityTotals[cityName] = (cityTotals[cityName] || 0) + value * quantity;
        });
      });
    }

    return Object.entries(cityTotals).map(([city, totalPrice]) => ({
      city,
      totalPrice: parseFloat(totalPrice.toFixed(2)),
    }));
  }, [basket, groceryItems]);

  const cityTotals = useMemo(() => {
    const totals = calculateCityTotals();
    return totals.length > 0 ? _.orderBy(totals, ['totalPrice'], ['desc']) : [];
  }, [calculateCityTotals]);

  useEffect(() => {
    const fetchGroceryItems = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/grocery/public/unique');
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
    setActiveCity(null);
  };

  const resetCity = () => {
    setBasket({});
  };

  console.log(groceryItems);

  return (
    <>
      <Container>
        <View className='container padding' ref={containerRef}>
          <Heading level={1} marginBottom='small'>
            Canadian Grocery Prices
          </Heading>
          <Text>
            Costs are in CAD. Prices reflect an average of non-discounted,
            in-stock items at common Canadian grocery stores. When available,
            the price represents the cost of goods prepared in Canada.
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
          <GridWrapper marginBottom='xl'>
            {groceryItems.map((item) => {
              const offset = getRandomOffset();
              const key = removeSpecialChars(item.category);
              const cityData = item.cities.find(
                (city) => city.city === activeCity
              );
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
                    whileTap={{ scale: 0.4 }}
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
                    canadianPrice={calculatePrice(item, cityData, true)}
                    globalPrice={calculatePrice(item, cityData, false)}
                    basePrice={
                      cityData?.canada_average_price_per_base ??
                      cityData?.not_canada_average_price_per_base ??
                      item.canada_average_price_per_base ??
                      item.not_canada_average_price_per_base
                    }
                    baseUnit={item.base_unit}
                    baseQuantity={item.average_base_amount}
                    label={item.category}
                    city={activeCity}
                  />
                </ImageWrapper>
              );
            })}
          </GridWrapper>
          <Text>
            Note that the data is limited to what is available from major
            grocery store chains. There may be Canadian fruits and vegetables
            available that have not been marked as “Prepared in Canada” by the
            store.
          </Text>
          {!loading && (
            <>
              <Heading level={2} marginTop='xl' textAlign='center'>
                Cost of basket by City
              </Heading>
              <BarChart
                data={cityTotals}
                filterLabel={activeCity}
                onBarClick={(city) => setActiveCity(city)}
                width={width}
                tooltipState={tooltipState}
                setTooltipState={setTooltipState}
                mode='absolute'
                labelAccessor={(d) => d.city as string}
                valueAccessor={(d) => d.totalPrice as number}
                tooltipFormatter={(d) =>
                  `${d.city}: $${(d.totalPrice as number).toFixed(2) ?? 0}`
                }
                xLabel='$CAD'
              />
              <Flex>
                <Button
                  onClick={removeAll}
                  variation='primary'
                  marginTop='small'
                >
                  Reset basket
                </Button>
                <Button
                  onClick={resetCity}
                  variation='primary'
                  marginTop='small'
                >
                  Reset City
                </Button>
              </Flex>
            </>
          )}
        </View>
      </Container>
      <BasketBar
        calculatePrice={calculatePrice}
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
