type CityData = {
  city: string;
  [key: string]: number | string;
};

const getCityTotal = (city: string | null, data: CityData[]): number => {
  const isNumber = (val: unknown): val is number =>
    typeof val === 'number' && !Number.isNaN(val);

  const totalFor = (entry: CityData): number =>
    Object.entries(entry)
      .filter(([key, val]) => key !== 'city' && isNumber(val))
      .reduce((sum, [, val]) => sum + (val as number), 0);

  if (city) {
    const match = data.find((d) => d.city === city);
    if (match) return totalFor(match);
  }

  const totals = data.map(totalFor);
  const average = totals.reduce((sum, t) => sum + t, 0) / totals.length;

  return Math.round(average);
};

export default getCityTotal;
