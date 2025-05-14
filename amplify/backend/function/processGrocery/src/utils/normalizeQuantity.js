const normalizeQuantity = (quantity, unit) => {
  if (!unit || isNaN(quantity)) {
    return { value: null, unit: null };
  }

  const lower = unit.toLowerCase();

  // Normalize weights to g
  const weightMap = {
    kg: 1000,
    g: 1,
  };

  // Normalize volumes to mL
  const volumeMap = {
    l: 1000,
    ml: 1,
  };

  if (weightMap[lower] !== undefined) {
    const normalizedValue = quantity * weightMap[lower]; // convert to grams
    const normalizedUnit = 'g';
    return {
      value: normalizedValue,
      unit: normalizedUnit,
    };
  }

  if (volumeMap[lower] !== undefined) {
    const normalizedValue = quantity * volumeMap[lower]; // convert to ml
    const normalizedUnit = 'ml';
    return {
      value: normalizedValue,
      unit: normalizedUnit,
    };
  }

  // If unknown unit, return original
  return { value: quantity, unit: lower };
};

export default normalizeQuantity;
