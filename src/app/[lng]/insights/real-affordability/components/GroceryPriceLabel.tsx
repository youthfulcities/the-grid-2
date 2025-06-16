'use client';

import { Text } from '@aws-amplify/ui-react';
import { motion } from 'framer-motion';
import _ from 'lodash';
import styled from 'styled-components';

interface GroceryPriceLabelProps {
  label?: string;
  canadianPrice?: number | null;
  globalPrice?: number | null;
  baseUnit: string | null;
  baseQuantity: number | null;
  basePrice: number | null;
  city?: string | null;
}

const LabelWrapper = styled(motion.div)`
  position: relative;
  z-index: 10;
  display: none;
  background: #fffdf7;
  border: 2px dashed #222;
  border-radius: 10px;
  padding: 10px 16px;
  min-width: 160px;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Price = styled(Text)`
  font-size: 1.8rem;
  font-weight: 800;
  color: #111;
`;

const LabelTitle = styled(Text)`
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: #333;
`;

const Difference = styled.div<{ isPositive?: boolean }>`
  font-size: 0.9rem;
  margin-top: 4px;
  color: ${({ isPositive }) =>
    isPositive === undefined
      ? '#444'
      : isPositive
        ? 'var(--amplify-colors-red-100)'
        : 'var(--amplify-colors-green-100)'};
  font-weight: 600;
`;

const GroceryPriceLabel: React.FC<GroceryPriceLabelProps> = ({
  label,
  canadianPrice,
  globalPrice,
  baseUnit,
  baseQuantity,
  basePrice,
  city,
}) => {
  let diffText = null;
  const hasCanadian = typeof canadianPrice === 'number' && canadianPrice > 0;
  const hasAmerican = typeof globalPrice === 'number' && globalPrice > 0;

  if (hasCanadian && hasAmerican && globalPrice !== 0) {
    const diff = canadianPrice! - globalPrice!;
    const percentageDiff = ((diff / globalPrice!) * 100).toFixed(1);
    const isMoreExpensiveInCanada = diff > 0;

    diffText = diff !== 0 && (
      <Difference isPositive={isMoreExpensiveInCanada}>
        {isMoreExpensiveInCanada ? '+' : ''}
        {percentageDiff}% to buy Canadian
      </Difference>
    );
  } else if (hasCanadian && !hasAmerican) {
    diffText = <Difference>Canadian only</Difference>;
  } else if (!hasCanadian && hasAmerican) {
    diffText = <Difference>No Canadian options</Difference>;
  } else {
    diffText = <Difference>No price data</Difference>;
  }

  const getBaseQuanity = (
    quantity: number | null,
    unit: string | null,
    price: number
  ) => {
    if (unit === 'g' || unit === 'ml') {
      return `$${(price * 100).toFixed(2)} per ${quantity ?? 1}/${unit}`;
    }
    return `$${price.toFixed(2)} per ${quantity}/${unit}`;
  };

  return (
    <LabelWrapper
      className='label'
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      style={{ transform: 'translateX(-50%)', left: '50%' }}
    >
      {label && <LabelTitle>{_.startCase(label)}</LabelTitle>}

      {hasCanadian && <Price>${canadianPrice!.toFixed(2)}</Price>}
      {!hasCanadian && hasAmerican && <Price>${globalPrice!.toFixed(2)}</Price>}
      {basePrice !== null && basePrice > 0 && (
        <LabelTitle>
          {getBaseQuanity(baseQuantity, baseUnit, basePrice)}
        </LabelTitle>
      )}
      {diffText}
      {city && <LabelTitle>({city})</LabelTitle>}
    </LabelWrapper>
  );
};

export default GroceryPriceLabel;
