import normalizeQuantity from './normalizeQuantity.js';

const normalizePricePer = (base_amount, base_unit, price_per_base_amount) => {
  const { value: quantity, unit } = normalizeQuantity(base_amount, base_unit);
  if (!quantity || quantity === 0) return null;
  else if (base_unit === 'kg' || base_unit === 'l') {
    return {
      value: quantity / quantity,
      unit: unit,
      price_per_base_amount: price_per_base_amount / 1000 / quantity,
    };
  }
  return {
    value: quantity / quantity,
    unit: unit,
    price_per_base_amount: price_per_base_amount / quantity,
  };
};

export default normalizePricePer;
