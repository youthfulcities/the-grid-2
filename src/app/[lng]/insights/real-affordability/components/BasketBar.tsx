'use client';

import { Flex, Text, View } from '@aws-amplify/ui-react';
import { motion } from 'framer-motion';
import React from 'react';
import styled from 'styled-components';

interface GroceryItem {
  category: string;
  category_average: number | null;
}

interface BasketEntry {
  item: GroceryItem;
  quantity: number;
}

interface BasketBarProps {
  basket: Record<string, BasketEntry>;
}

const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  text-align: center;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  width: 100%;
  padding-top: 40px;
`;

const BasketContainer = styled(Flex)`
  position: relative;
  width: 100%;
`;

const BasketWrapper = styled(View)`
  position: relative;
  z-index: 2; /* basket on top */
  width: 300px;
  height: 210px;
`;

const BasketItems = styled(View)`
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

const QuantityBadge = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  background: #d11a2a;
  color: white;
  border-radius: 50%;
  padding: 2px 5px;
  font-size: 0.65rem;
  font-weight: bold;
`;

const Total = styled.div`
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0.5rem;
`;

const removeSpecialChars = (string: string) =>
  string.replace(/[^a-zA-Z ]/g, '').trim();

const getRandomOffset = () => ({
  rotate: Math.random() * 10 - 5, // -5 to +5 degrees
});

const BasketBar: React.FC<BasketBarProps> = ({ basket }) => {
  const total = Object.values(basket).reduce(
    (sum, b) => sum + (b.item.category_average ?? 0) * b.quantity,
    0
  );

  return (
    <Wrapper>
      <BasketContainer justifyContent='center' alignItems='center'>
        <BasketWrapper>
          <BasketItems>
            {Object.entries(basket).map(([key, { item, quantity }], i) => {
              const offset = getRandomOffset();
              const count = 0;
              return (
                <Item
                  key={key}
                  style={{
                    left: `${(i % 5) * 30}px`,
                    bottom: `${(i % 3) * 12}px`,
                    rotate: `${offset.rotate}deg`,
                    zIndex: i,
                  }}
                >
                  <motion.img
                    layoutId={`icon-${removeSpecialChars(item.category)}`}
                    src={`/assets/food-icons/${removeSpecialChars(item.category)}.png`}
                    alt={item.category}
                  />
                </Item>
              );
            })}
          </BasketItems>
          <img
            src='/assets/food-icons/basket.png'
            alt='Basket'
            width='250px'
            height='auto'
          />
        </BasketWrapper>
        <Total>
          <Text>
            Total: <strong>${total.toFixed(2)}</strong>
          </Text>
        </Total>
      </BasketContainer>
    </Wrapper>
  );
};

export default BasketBar;
