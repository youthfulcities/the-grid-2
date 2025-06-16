'use client';

import Drawer from '@/app/components/Drawer';
import { calculateGroceryPrice } from '@/utils/calculateGroceryTotals';
import { Flex, Text, View } from '@aws-amplify/ui-react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useProfile } from '../context/ProfileContext';
import { BasketEntry } from '../types/BasketTypes';

interface BasketBarProps {}

const BasketContainer = styled(Flex)`
  width: 100%;
`;

const BasketWrapper = styled(View)`
  position: relative;
  z-index: 2; /* basket on top */
  padding-top: var(--amplify-space-xxl);
`;

const BasketItems = styled(motion.div)`
  background: yellow;
  position: absolute;
  bottom: 50%;
  width: 210px;
  left: 50%;
  transform: translateX(-50%);
  z-index: -1;
`;

const Item = styled(View)`
  position: absolute;

  img {
    z-index: 1;
    width: 100px;
    height: 100px;
    object-fit: contain;
    transition: transform 0.2s;
  }
`;

const BasketTab = styled.div`
  position: relative;
  width: 40px;
  height: 40px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const QuantityBadge = styled(motion.div)`
  position: absolute;
  top: -6px;
  right: -6px;
  background: var(--amplify-colors-red-60);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: bold;
  line-height: 1;
`;
const Total = styled.div`
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0.5rem;
`;

const BasketList = styled.ul`
  list-style: none;
  width: 100%;
  padding: 0;
  margin: 1rem 0 0;
`;

const BasketListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #eee;
  padding: 0.5rem 0;
  cursor: pointer;
`;

const BasketListText = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  font-size: 0.85rem;

  span {
    color: #666;
    font-size: 0.75rem;
  }
`;

const RemoveButton = styled.button`
  background: transparent;
  border: none;
  color: var(--amplify-colors-red-60);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;

  &:hover {
    color: var(--amplify-colors-red-100);
  }
`;

const removeSpecialChars = (string: string) =>
  string.replace(/[^a-zA-Z ]/g, '').trim();

const getRandomOffset = () => ({
  rotate: Math.random() * 10 - 5, // -5 to +5 degrees
});

const BasketBar: React.FC<BasketBarProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { activeCity, basket, setBasket } = useProfile();
  const [filteredBasket, setFilteredBasket] =
    useState<Record<string, BasketEntry>>(basket);

  useEffect(() => {
    if (activeCity && Object.keys(basket).length > 0) {
      setIsOpen(true);
      setFilteredBasket(basket);
    } else {
      setFilteredBasket(basket);
    }
  }, [activeCity, basket]);

  const total = Object.values(filteredBasket).reduce(
    (sum, { item, quantity }) => {
      const cityData = item.cities.find((c) => c.city === activeCity);
      return sum + calculateGroceryPrice(item, cityData, null) * quantity;
    },
    0
  );

  const totalQuantity = Object.values(filteredBasket).reduce(
    (sum, { quantity }) => sum + quantity,
    0
  );

  const totalCanadianCost = Object.values(filteredBasket).reduce(
    (sum, { item, quantity }) => {
      const cityData = item.cities.find((c) => c.city === activeCity);

      const canadian = calculateGroceryPrice(
        item,
        cityData ?? null,
        true,
        !cityData
      );

      const global = calculateGroceryPrice(
        item,
        cityData ?? null,
        false,
        !cityData
      );
      return sum + (canadian && global ? canadian : 0) * quantity;
    },
    0
  );

  const totalNotCanadianCost = Object.values(filteredBasket).reduce(
    (sum, { item, quantity }) => {
      const cityData = item.cities.find((c) => c.city === activeCity);
      const canadian = calculateGroceryPrice(
        item,
        cityData ?? null,
        true,
        !cityData
      );

      const global = calculateGroceryPrice(
        item,
        cityData ?? null,
        false,
        !cityData
      );
      return sum + (canadian && global ? global : 0) * quantity;
    },
    0
  );

  const handleRemoveItem = (key: string) => {
    setBasket((prev: Record<string, BasketEntry>) => {
      const updated: Record<string, BasketEntry> = { ...prev };

      if (!updated[key]) return prev;

      if (updated[key].quantity > 1) {
        updated[key] = {
          ...updated[key],
          quantity: updated[key].quantity - 1,
        };
      } else {
        delete updated[key];
      }

      return updated;
    });
  };

  const costDifference = totalCanadianCost - totalNotCanadianCost;
  const costDifferenceFormatted = costDifference.toFixed(2);
  const isMoreExpensive = costDifference > 0;

  return (
    <Drawer
      isopen={isOpen}
      onOpen={() => setIsOpen((prev) => !prev)}
      onClose={() => setIsOpen((prev) => !prev)}
      tabComponent={
        <BasketTab>
          <img src='/assets/food-icons/basket.png' alt='Basket' />
          {totalQuantity > 0 && (
            <QuantityBadge
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {totalQuantity}
            </QuantityBadge>
          )}
        </BasketTab>
      }
    >
      <BasketContainer
        direction='column'
        justifyContent='center'
        alignItems='center'
      >
        <BasketWrapper>
          <BasketItems>
            <AnimatePresence>
              {Object.entries(filteredBasket).map(([key, { item }], i) => {
                const offset = getRandomOffset();
                return (
                  <Item
                    key={key}
                    style={{
                      left: `${(i % 5) * 30}px`,
                      bottom: `${(i % 4) * 5}px`,
                      rotate: `${offset.rotate}deg`,
                      zIndex: i,
                    }}
                  >
                    <motion.img
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                      }}
                      layoutId={`icon-${removeSpecialChars(item.category)}`}
                      src={`/assets/food-icons/${removeSpecialChars(item.category)}.png`}
                      alt={item.category}
                    />
                  </Item>
                );
              })}
            </AnimatePresence>
          </BasketItems>
          <img
            src='/assets/food-icons/basket.png'
            alt='Basket'
            width='250px'
            height='auto'
          />
        </BasketWrapper>
        <Total>
          <Text marginTop='-50px'>
            Total: <strong>${total.toFixed(2)}</strong>
          </Text>
          {totalQuantity > 0 &&
            totalCanadianCost > 0 &&
            totalNotCanadianCost > 0 &&
            costDifference !== 0 && (
              <>
                <Text fontSize='0.9rem' marginTop='0.5rem'>
                  {isMoreExpensive
                    ? `It costs $${costDifferenceFormatted} more to buy Canadian!`
                    : `You're saving $${Math.abs(costDifference).toFixed(2)} by buying Canadian!`}
                </Text>
                {activeCity && (
                  <Text fontSize='0.9rem'>City: {activeCity}</Text>
                )}
              </>
            )}
        </Total>
        <BasketList>
          {Object.entries(filteredBasket).map(([key, { item, quantity }]) => {
            const cityData = item.cities.find((c) => c.city === activeCity);

            const canadianPrice = calculateGroceryPrice(
              item,
              cityData ?? null,
              true,
              !cityData
            );
            const globalPrice = calculateGroceryPrice(
              item,
              cityData ?? null,
              false,
              !cityData
            );
            return (
              <BasketListItem key={key} onClick={() => handleRemoveItem(key)}>
                <Flex>
                  <img
                    src={`/assets/food-icons/${removeSpecialChars(item.category)}.png`}
                    alt={item.category}
                    width='40px'
                    height='40px'
                  />
                  <BasketListText>
                    <strong>{item.category}</strong>
                    <span>
                      {`${quantity} × ${canadianPrice ? `🍁 $${canadianPrice.toFixed(2)}` : '🍁 N/A'} | ${
                        globalPrice ? `🌎 $${globalPrice.toFixed(2)}` : '🌎 N/A'
                      }`}
                    </span>
                    <span>
                      per{' '}
                      {item.statscan_quantity ?? item.most_frequent_quantity}{' '}
                      {item.statscan_unit ?? item.base_unit}
                    </span>
                  </BasketListText>
                </Flex>
                <RemoveButton onClick={() => handleRemoveItem(key)}>
                  ×
                </RemoveButton>
              </BasketListItem>
            );
          })}
        </BasketList>
      </BasketContainer>
    </Drawer>
  );
};

export default BasketBar;
