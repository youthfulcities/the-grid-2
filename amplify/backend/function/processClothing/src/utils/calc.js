const mode = (values) => {
  const frequency = {};
  values.forEach((value) => {
    frequency[value] = (frequency[value] || 0) + 1;
  });

  let mostFrequent = null;

  Object.entries(frequency).reduce(
    (acc, [val, count]) => {
      const num = parseFloat(val);
      if (count > acc.maxCount) {
        mostFrequent = num;
        acc.maxCount = count;
      }
      return acc;
    },
    { maxCount: 0 }
  );

  return mostFrequent;
};

const avg = (values) =>
  values.length > 0
    ? parseFloat(
        (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(5)
      )
    : null;

export { mode, avg };
