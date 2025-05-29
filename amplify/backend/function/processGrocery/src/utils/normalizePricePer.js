import normalizeQuantity from './normalizeQuantity.js';

const normalizePricePer = (base_amount, base_unit, price_per_base_amount) => {
  const { value: normalizedQuantity, unit: normalizedUnit } = normalizeQuantity(
    base_amount,
    base_unit
  );
  if (!normalizedQuantity || normalizedQuantity === 0) return null;

  return {
    unit: normalizedUnit,
    price_per_base_amount: price_per_base_amount / normalizedQuantity,
  };
};

export default normalizePricePer;
