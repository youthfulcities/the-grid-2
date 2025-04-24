'use client';

import Container from '@/app/components/Background';
import BarChart from '@/app/components/dataviz/BarChartGeneral';
import Tooltip from '@/app/components/dataviz/TooltipChart';
import { useDimensions } from '@/hooks/useDimensions';
import {
  Button,
  Flex,
  Heading,
  Loader,
  Text,
  View,
} from '@aws-amplify/ui-react';
import { motion } from 'framer-motion';
import _ from 'lodash';
import Error from 'next/error';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';
import styled from 'styled-components';
import BasketBar from './components/BasketBar';
import GroceryBadge from './components/GroceryBadge';
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

const containerVariants = {
  expanded: {
    height: 'auto',
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 20,
      when: 'afterChildren',
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  collapsed: {
    height: 400,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
      delayChildren: 0.1,
      duration: 0.8,
      type: 'spring',
      stiffness: 300,
      damping: 40,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.5 },
};

const GridWrapper = styled(motion.div)<{ expanded?: boolean }>`
  display: grid;
  position: relative;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 32px;
  padding: 2rem;
  justify-items: center;
  overflow: ${({ expanded }) => (expanded ? 'visible' : 'hidden')};
  min-height: 400px;
`;

const ImageWrapper = styled(motion.div)<{ $error: boolean }>`
  display: ${(props) => (props.$error ? 'none' : 'block')};
  position: relative;
  width: 120px;
  height: 120px;
  cursor: pointer;

  img {
    z-index: -1;
    width: 100%;
    height: 100%;
    aspect-ratio: 1 / 1;
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
  aspect-ratio: 1 / 1;
  z-index: 0;
  will-change: transform;
`;

const FadeOverlay = styled(View)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 150px;
  background: linear-gradient(
    to bottom,
    transparent,
    var(--amplify-colors-neutral-90)
  );
  pointer-events: none;
`;

const ExpandButton = styled(Button)`
  position: absolute;
  left: 10px;
  bottom: 10px;
  border-radius: 100%;
  width: 50px;
  height: 50px;
  padding: 0;
  z-index: 1;
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
  const [expanded, setExpanded] = useState(false);
  const { width } = useDimensions(containerRef);

  const visibleItems = useMemo(() => {
    if (expanded) return groceryItems;
    return groceryItems.slice(0, 18);
  }, [expanded, groceryItems]);

  const offsetRef = useRef<
    Record<string, { rotate: number; x: number; y: number }>
  >({});

  const offsetsByKey = useMemo(() => {
    const map = { ...offsetRef.current };
    visibleItems.forEach((item) => {
      const key = removeSpecialChars(item.category);
      if (!map[key]) {
        map[key] = getRandomOffset();
      }
    });
    offsetRef.current = map;
    return map;
  }, [visibleItems]);

  const calculatePrice = (
    item: any,
    city: any,
    canadian: boolean | null = null,
    defaultToGlobal: boolean = false
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
        city_canada_price_per_base ??
        canada_average_price_per_base ??
        (defaultToGlobal &&
          (city_not_canada_price_per_base ??
            not_canada_average_price_per_base)) ??
        0;

      if (pricePerBase > 0) {
        return pricePerBase * quantity;
      }

      return (
        city_canada_average_price ??
        canada_average_price ??
        (defaultToGlobal &&
          (city_not_canada_average_price ?? not_canada_average_price)) ??
        0
      );
    }

    const pricePerBase =
      city_not_canada_price_per_base ??
      not_canada_average_price_per_base ??
      (defaultToGlobal &&
        (city_canada_price_per_base ?? canada_average_price_per_base)) ??
      0;

    if (pricePerBase > 0) {
      return pricePerBase * quantity;
    }

    return (
      city_not_canada_average_price ??
      not_canada_average_price ??
      (defaultToGlobal &&
        (city_not_canada_average_price ?? not_canada_average_price)) ??
      0
    );
  };

  const precomputedData = useMemo(
    () =>
      visibleItems.map((item) => {
        const key = removeSpecialChars(item.category);
        const offset = offsetsByKey[key];
        return { item, key, offset };
      }),
    [visibleItems, activeCity]
  );

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
    setExpanded(false);
    setBasket({});
    setActiveCity(null);
  };

  const resetCity = () => {
    setActiveCity(null);
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
          <GridWrapper
            expanded={expanded}
            variants={containerVariants}
            initial='collapsed'
            animate={expanded ? 'expanded' : 'collapsed'}
          >
            {/* <AnimatePresence> */}
            {precomputedData.map(({ item, key, offset }) => {
              const cityData = item.cities.find(
                (city) => city.city === activeCity
              );
              return (
                <ImageWrapper
                  $error={imgError[key]}
                  key={key}
                  onClick={() => handleAddToBasket(item)}
                >
                  <GroceryBadge
                    canadianPrice={calculatePrice(item, cityData, true)}
                    globalPrice={calculatePrice(item, cityData, false)}
                  />
                  <MotionImage
                    layout
                    key={key}
                    variants={itemVariants}
                    initial='hidden'
                    animate='visible'
                    exit='exit'
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                    }}
                    style={{
                      rotate: `${offset.rotate}deg`,
                    }}
                    whileHover={{ scale: 1.1, rotate: 0, x: 0, y: 0 }}
                    whileTap={{ scale: 0.4 }}
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
            {/* </AnimatePresence> */}
            {!expanded && <FadeOverlay />}
            <ExpandButton
              variation='primary'
              onClick={() => setExpanded((prev) => !prev)}
            >
              {expanded ? <FaAngleUp /> : <FaAngleDown />}
            </ExpandButton>
          </GridWrapper>
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
              <Flex marginBottom='large'>
                <Button
                  onClick={handleAddAll}
                  variation='primary'
                  marginTop='small'
                >
                  Add All
                </Button>
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
          <Text>
            Food icons created by{' '}
            <a
              href='https://www.flaticon.com/free-icons/lentils'
              title='lentils icons'
            >
              Freepik
            </a>
            ,{' '}
            <a
              href='https://www.flaticon.com/free-icons/sunflower-seed'
              title='sunflower seed icons'
            >
              surang
            </a>
            ,{' '}
            <a
              href='https://www.flaticon.com/free-icons/soy-milk'
              title='soy milk icons'
            >
              Peerapak Takpho
            </a>
            ,{' '}
            <a href='https://www.flaticon.com/free-icons/oil' title='oil icons'>
              iconixar
            </a>
            ,{' '}
            <a
              href='https://www.flaticon.com/free-icons/bean'
              title='bean icons'
            >
              Nikita Golubev
            </a>
            ,{' '}
            <a
              href='https://www.flaticon.com/free-icons/ribs'
              title='ribs icons'
            >
              Kemalmoe
            </a>
            ,{' '}
            <a
              href='https://www.flaticon.com/free-icons/tuna'
              title='tuna icons'
            >
              Konkapp
            </a>
            ,{' '}
            <a
              href='https://www.flaticon.com/free-icons/coffee'
              title='coffee icons'
            >
              Smashicons
            </a>
            ,{' '}
            <a
              href='https://www.flaticon.com/free-icons/juice'
              title='juice icons'
            >
              nawicon
            </a>
            ,{' '}
            <a
              href='https://www.flaticon.com/free-icons/apple-juice'
              title='apple juice icons'
            >
              photo3idea_studio
            </a>
            ,{' '}
            <a
              href='https://www.flaticon.com/free-icons/lemon'
              title='lemon icons'
            >
              popo2021
            </a>
            ,{' '}
            <a
              href='https://www.flaticon.com/free-icons/lemon'
              title='lemon icons'
            >
              designbydai
            </a>
            ,{' '}
            <a
              href='https://www.flaticon.com/free-icons/cereal'
              title='cereal icons'
            >
              kliwir art
            </a>
            ,{' '}
            <a
              href='https://www.flaticon.com/free-icons/pasta'
              title='pasta icons'
            >
              Good Ware
            </a>
            , and{' '}
            <a
              href='https://www.flaticon.com/free-icons/breads'
              title='breads icons'
            >
              piksart
            </a>
            . Thank you!
          </Text>
          <Text>
            Note that the data is limited to what is available from major
            grocery store chains. There may be Canadian fruits and vegetables
            available that have not been marked as “Prepared in Canada” by the
            store.
          </Text>
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
