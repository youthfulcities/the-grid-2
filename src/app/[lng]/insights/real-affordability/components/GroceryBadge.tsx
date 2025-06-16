'use client';

import styled from 'styled-components';

interface GroceryPriceLabelProps {
  canadianPrice?: number | null;
  globalPrice?: number | null;
}

const Badge = styled.div<{ $isCheaperInCanada: boolean }>`
  position: absolute;
  top: 4px;
  right: -10px;
  background-color: ${({ $isCheaperInCanada }) =>
    $isCheaperInCanada
      ? 'var(--amplify-colors-green-100)'
      : 'var(--amplify-colors-red-100)'};
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 0.25em 0.5em;
  border-radius: 8px;
  z-index: 2;
`;

const GroceryBadge: React.FC<GroceryPriceLabelProps> = ({
  canadianPrice,
  globalPrice,
}) => {
  const isCheaperToBuyCanadian = (
    canada?: number | null,
    global?: number | null
  ): boolean => {
    if (!canada) return false;
    if (!global) return true;
    if (canada === global) return false; // No difference, skip rendering
    return canada < global; // Cheaper in Canada
  };

  const isCheaperInCanada = isCheaperToBuyCanadian(canadianPrice, globalPrice);
  const getPriceText = (): string | null => {
    if (canadianPrice && globalPrice) {
      const diff = canadianPrice - globalPrice;
      if (diff === 0) return null; // No difference, skip rendering
      if (isCheaperInCanada) return '-$ 🇨🇦';
      if (!isCheaperInCanada) return '+$ 🇨🇦';
    }
    if (canadianPrice) return '🇨🇦';
    return null; // No badge if only global price or no prices
  };

  const priceText = getPriceText();
  if (!priceText) return null; // Do not render badge

  return <Badge $isCheaperInCanada={isCheaperInCanada}>{priceText}</Badge>;
};

export default GroceryBadge;
