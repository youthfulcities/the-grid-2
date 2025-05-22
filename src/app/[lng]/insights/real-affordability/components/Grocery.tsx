import BarChartStacked from '@/app/components/dataviz/BarChartStacked';
import {
  calculateGroceryPrice,
  calculateGroceryTotals,
} from '@/utils/calculateGroceryTotals';
import {
  Button,
  Flex,
  Heading,
  Loader,
  Text,
  View,
} from '@aws-amplify/ui-react';
import { motion } from 'framer-motion';
import { useCallback, useMemo, useRef, useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';
import { styled } from 'styled-components';
import { BasketEntry, GroceryItem, TooltipState } from '../types/BasketTypes';
import GroceryBadge from './GroceryBadge';
import GroceryPriceLabel from './GroceryPriceLabel';

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

const keys = ['Canadian goods', 'Non-Canadian goods'];

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

const getRandomOffset = () => ({
  rotate: Math.random() * 10 - 5, // -5 to +5 degrees
  x: Math.random() * 10 - 5, // -5 to +5 px
  y: Math.random() * 10 - 5,
});

const removeSpecialChars = (string: string) =>
  string.replace(/[^a-zA-Z ]/g, '').trim();

const Grocery = ({
  groceryItems,
  latestTimestamp,
  setBasket,
  activeCity,
  setActiveCity,
  cityTotals,
  setTooltipState,
  width,
  loading,
  basket,
}: {
  groceryItems: GroceryItem[];
  latestTimestamp: string | null;
  setBasket: React.Dispatch<React.SetStateAction<Record<string, BasketEntry>>>;
  activeCity: string | null;
  setActiveCity: React.Dispatch<React.SetStateAction<string | null>>;
  cityTotals: { city: string; totalPrice: number }[];
  setTooltipState: React.Dispatch<React.SetStateAction<TooltipState>>;
  width: number;
  loading: boolean;
  basket: Record<string, BasketEntry>;
}) => {
  const [imgError, setImgError] = useState<{ [key: string]: boolean }>({});
  const [expanded, setExpanded] = useState(false);

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

  const precomputedData = useMemo(
    () =>
      visibleItems.map((item) => {
        const key = removeSpecialChars(item.category);
        const offset = offsetsByKey[key];
        return { item, key, offset };
      }),
    [visibleItems, offsetsByKey]
  );

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

  const canadianTotal = useMemo(
    () => calculateGroceryTotals(groceryItems, basket, true),
    [groceryItems, basket]
  );

  const processedData = useMemo(
    () =>
      cityTotals.map((city) => {
        const cityName = city.city;
        const canadian =
          canadianTotal.find((item) => item.city === cityName)?.totalPrice ?? 0;
        return {
          city: cityName,
          'Canadian goods': canadian,
          'Non-Canadian goods': city.totalPrice - canadian,
          totalPrice: city.totalPrice,
        };
      }),
    [cityTotals, canadianTotal]
  );

  const tooltipFormatter = useCallback(
    (d: any) =>
      `${d.city}: $${d.totalPrice.toFixed(2)} (${((d['Canadian goods'] / d.totalPrice) * 100).toFixed(1)}% Canadian goods)`,
    []
  );

  return (
    <>
      <Heading level={1} marginTop='xxxl' marginBottom='small'>
        What&apos;s in <span className='highlight'>your basket?</span>
      </Heading>
      <Text>
        Costs are in CAD. Prices reflect an average of non-discounted, in-stock
        items at common Canadian grocery stores. When available, the price
        represents the cost of goods prepared in Canada.
      </Text>
      {latestTimestamp && (
        <Text fontSize='small'>
          Last updated: {new Date(latestTimestamp).toLocaleDateString()}
        </Text>
      )}
      <Flex justifyContent='center' marginTop='xxl'>
        <Button onClick={handleAddAll}>Add All</Button>
        <Button onClick={removeAll}>Reset</Button>
      </Flex>
      {loading ? (
        <Flex alignItems='center' margin='small'>
          <Loader size='large' />
        </Flex>
      ) : (
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
                  canadianPrice={calculateGroceryPrice(item, cityData, true)}
                  globalPrice={calculateGroceryPrice(item, cityData, false)}
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
                  canadianPrice={calculateGroceryPrice(item, cityData, true)}
                  globalPrice={calculateGroceryPrice(item, cityData, false)}
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
      )}
      {!loading && (
        <>
          <Heading level={2} marginTop='xxl' textAlign='center'>
            Cost of basket <span className='highlight'>by City</span>
          </Heading>
          <BarChartStacked
            filterLabel={activeCity}
            onBarClick={(d) => setActiveCity(d)}
            data={processedData}
            keys={keys}
            labelAccessor={(d) => d.city as string}
            width={width}
            setTooltipState={setTooltipState}
            height={800}
            marginLeft={100}
            tooltipFormatter={tooltipFormatter}
          />
          <Button
            onClick={handleAddAll}
            size='small'
            color='font.inverse'
            marginTop='small'
            marginLeft='xs'
          >
            Add All
          </Button>
          <Button
            onClick={removeAll}
            marginTop='small'
            size='small'
            color='font.inverse'
            marginLeft='xs'
          >
            Reset basket
          </Button>
          <Button
            onClick={resetCity}
            marginTop='small'
            size='small'
            color='font.inverse'
            marginLeft='xs'
          >
            Reset City
          </Button>
        </>
      )}
      <Text fontSize='small' marginTop='large'>
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
        <a href='https://www.flaticon.com/free-icons/bean' title='bean icons'>
          Nikita Golubev
        </a>
        ,{' '}
        <a href='https://www.flaticon.com/free-icons/ribs' title='ribs icons'>
          Kemalmoe
        </a>
        ,{' '}
        <a href='https://www.flaticon.com/free-icons/tuna' title='tuna icons'>
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
        <a href='https://www.flaticon.com/free-icons/juice' title='juice icons'>
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
        <a href='https://www.flaticon.com/free-icons/lemon' title='lemon icons'>
          popo2021
        </a>
        ,{' '}
        <a href='https://www.flaticon.com/free-icons/lemon' title='lemon icons'>
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
        <a href='https://www.flaticon.com/free-icons/pasta' title='pasta icons'>
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
      <Text fontSize='small'>
        Note that the data is limited to what is available from major grocery
        store chains. There may be Canadian fruits and vegetables available that
        have not been marked as “Prepared in Canada” by the store.
      </Text>
    </>
  );
};

export default Grocery;
