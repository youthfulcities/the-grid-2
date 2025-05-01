const averageMostCommonUnit = (values) => {
  if (!values.length) return { unit: null, average: null };

  // Count frequency of each unit
  const unitCounts = {};
  for (const { unit } of values) {
    unitCounts[unit] = (unitCounts[unit] || 0) + 1;
  }

  // Find the most common unit
  let mostCommonUnit = null;
  let maxCount = 0;
  for (const unit in unitCounts) {
    if (unitCounts[unit] > maxCount) {
      mostCommonUnit = unit;
      maxCount = unitCounts[unit];
    }
  }

  // Filter values by most common unit
  const matchingValues = values
    .filter((v) => v.unit === mostCommonUnit)
    .map((v) => v.value);

  const average =
    matchingValues.reduce((sum, val) => sum + val, 0) / matchingValues.length;

  return {
    unit: mostCommonUnit,
    average: parseFloat(average.toFixed(5)),
  };
};

export default averageMostCommonUnit;
