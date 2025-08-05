import * as d3 from 'd3';
import { IncomeData } from '../types/IncomeTypes';
import { ProfileData } from '../types/ProfileTypes';
import ageMap from './ageMap';
import getIncome from './calculateIncome';
import genderMap from './genderMap.json';
import occupationMap from './occupationMap.json';
import provinceMap from './provinceMap.json';

const colors = [
  '#FBD166',
  '#2f4eac',
  '#F2695D',
  '#339933',
  '#00BFA9',
  '#F6D9D7',
  '#FF6633',
  '#B8D98D',
  '#8755AF',
  '#66CCFF',
];

const colorScale = d3
  .scaleOrdinal<string, string>()
  .domain(Object.values(occupationMap))
  .range(colors);

const memoCache = new Map<string, any>();

const computeIncomeComparisons = (income: IncomeData, profile: ProfileData) => {
  const { city, gender, occupation, age, customized } = profile;
  const cacheKey = `${city}-${gender}-${occupation}-${age}-${JSON.stringify(income)}`;
  if (memoCache.has(cacheKey)) {
    return memoCache.get(cacheKey);
  }
  const key = `${city}-${gender}-${occupation}-${age}`;
  const currentProvince = provinceMap[city as keyof typeof provinceMap];

  // Compute industries sorted by income for the given occupation in this city.
  const industries = Object.entries(occupationMap)
    .map(([object_key, value]) => ({
      occupation: value,
      occupationKey: object_key,
      income: getIncome({
        city: city ?? '',
        currentProvince,
        currentAge: customized ? ageMap(age) : undefined,
        currentGender: genderMap[gender as keyof typeof genderMap] ?? undefined,
        currentOccupation: value,
        income,
      }),
    }))
    .sort((a, b) => b.income - a.income);

  // Compute overall income for Men+ and Women+
  const overallMen = getIncome({
    city: city ?? '',
    currentProvince,
    currentAge: customized ? ageMap(age) : undefined,
    currentGender: 'Men+',
    currentOccupation:
      occupationMap[occupation as keyof typeof occupationMap] ?? undefined,
    income,
  });
  const overallWomen = getIncome({
    city: city ?? '',
    currentProvince,
    currentAge: customized ? ageMap(age) : undefined,
    currentGender: 'Women+',
    currentOccupation:
      occupationMap[occupation as keyof typeof occupationMap] ?? undefined,
    income,
  });

  const overall19 = getIncome({
    city: city ?? '',
    currentProvince,
    currentAge: '15 to 19 years',
    currentGender: genderMap[gender as keyof typeof genderMap] ?? undefined,
    currentOccupation:
      occupationMap[occupation as keyof typeof occupationMap] ?? undefined,
    income,
  });

  const overall24 = getIncome({
    city: city ?? '',
    currentProvince,
    currentAge: '20 to 24 years',
    currentGender: genderMap[gender as keyof typeof genderMap] ?? undefined,
    currentOccupation:
      occupationMap[occupation as keyof typeof occupationMap] ?? undefined,
    income,
  });

  const overall29 = getIncome({
    city: city ?? '',
    currentProvince,
    currentAge: '25 to 29 years',
    currentGender: genderMap[gender as keyof typeof genderMap] ?? undefined,
    currentOccupation:
      occupationMap[occupation as keyof typeof occupationMap] ?? undefined,
    income,
  });

  const ageIncomes = [
    { value: overall19, group: '15 to 19', city, key, age, gender, occupation },
    { value: overall24, group: '20 to 24', city, key, age, gender, occupation },
    { value: overall29, group: '25 to 29', city, key, age, gender, occupation },
  ];

  // Compute genderData for each occupation
  const genderData = Object.entries(occupationMap)
    .map(([o_key, o]) => {
      const male = getIncome({
        city: city ?? '',
        currentProvince,
        currentAge: customized ? ageMap(age) : undefined,
        currentGender: 'Men+',
        currentOccupation: o,
        income,
      });
      const female = getIncome({
        city: city ?? '',
        currentProvince,
        currentAge: customized ? ageMap(age) : undefined,
        currentGender: 'Women+',
        currentOccupation: o,
        income,
      });
      const difference = female !== 0 ? ((male - female) / female) * 100 : 0;
      return {
        occupation: o_key,
        maleIncome: male,
        femaleIncome: female,
        difference,
      };
    })
    .filter((d) => d.difference > 0)
    .sort((a, b) => b.difference - a.difference)
    .slice(0, 5);

  const incomeDifference =
    overallWomen !== 0 ? ((overallMen - overallWomen) / overallWomen) * 100 : 0;

  const result = {
    key,
    topIndustries: industries.slice(0, 3),
    genderData,
    genderColors: genderData.map((d) => colorScale(d.occupation)),
    incomeDifference,
    ageIncomes,
  };

  memoCache.set(cacheKey, result);
  return result;
};
export default computeIncomeComparisons;
