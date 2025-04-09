'use client';

import Container from '@/app/components/Background';
import { Text, View } from '@aws-amplify/ui-react';
import { motion } from 'framer-motion';
import Error from 'next/error';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface GroceryItem {
  category: string;
  category_average: number | null;
  category_canada_average: number | null;
  category_not_canada_average: number | null;
  cities: {
    city: string;
    prepared_in_canada: number | null;
    not_prepared_in_canada: number | null;
    city_average: number | null;
  }[];
}

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 32px;
  padding: 2rem;
  justify-items: center;
`;

const ImageWrapper = styled(motion.div)<{ $error: boolean }>`
  display: ${(props) => (props.$error ? 'none' : 'block')};
  width: 120px;
  height: 120px;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }

  &:hover .info-box {
    display: flex;
  }
`;

const InfoBox = styled(motion.div)`
  position: absolute;
  bottom: -80px;
  left: 50%;
  transform: translateX(-50%);
  display: none;
  flex-direction: column;
  align-items: center;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.8rem;
  z-index: 10;
  white-space: nowrap;
`;

const getRandomOffset = () => ({
  rotate: Math.random() * 10 - 5, // -5 to +5 degrees
  x: Math.random() * 10 - 5, // -5 to +5 px
  y: Math.random() * 10 - 5,
});

const removeSpecialChars = (string: string) =>
  string.replace(/[^a-zA-Z ]/g, '').trim();

const GroceryList: React.FC = () => {
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [errorText, setErrorText] = useState<
    string | null | undefined | unknown
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [imgError, setImgError] = useState<{ [key: string]: boolean }>({});

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

  return (
    <Container>
      <View className='container padding'>
        <h1>Grocery Categories</h1>
        <GridWrapper>
          {groceryItems.map((item, i) => {
            const offset = getRandomOffset();
            const key = removeSpecialChars(item.category);
            return (
              <ImageWrapper
                $error={imgError[key]}
                key={key}
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
                <InfoBox className='info-box'>
                  <Text fontWeight='bold'>{item.category}</Text>
                  <Text>
                    🇨🇦 ${item.category_canada_average?.toFixed(2) ?? 'N/A'}
                  </Text>
                  <Text>
                    🇺🇸 ${item.category_not_canada_average?.toFixed(2) ?? 'N/A'}
                  </Text>
                </InfoBox>
              </ImageWrapper>
            );
          })}
        </GridWrapper>
      </View>
    </Container>
  );
};

export default GroceryList;
