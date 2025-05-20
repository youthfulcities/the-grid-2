// utils/calculateIncome.ts
import { IncomeData, IncomeEntry } from '../types/IncomeTypes';
import provinceMap from './provinceMap.json';

interface GetIncomeOptions {
  city?: string;
  currentProvince?: string;
  currentAge?: string;
  currentGender?: string;
  currentOccupation?: string;
  income: IncomeData;
}

export const computeAverageIncome = (income: IncomeData): number => {
  const values = income.map((item) => item.median_monthly_income_post_tax);
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / (values.length || 1);
};

const getIncome = ({
  city,
  currentProvince,
  currentAge,
  currentGender,
  currentOccupation,
  income,
}: GetIncomeOptions): number => {
  const normalizeMatch = (entry: IncomeEntry) =>
    (!currentAge || entry.Age_12_Group === currentAge) &&
    (!currentGender || entry.Gender_Label === currentGender) &&
    (!currentOccupation || entry.NOC_Class === currentOccupation);

  const averageIncome = computeAverageIncome(income);
  if (city) {
    const cityEntry = income.find(
      (item) =>
        item.city === city || item.city === `Other CMA - ${currentProvince}`
    );

    const nestedMatch = cityEntry?.data?.find(normalizeMatch);

    return (
      nestedMatch?.median_monthly_income_post_tax ??
      cityEntry?.median_monthly_income_post_tax ??
      income.find(
        (item) =>
          item.province === provinceMap[city as keyof typeof provinceMap]
      )?.median_monthly_income ??
      averageIncome
    );
  }

  const allIncomes = income
    .flatMap(
      (item) =>
        item.data
          ?.filter(normalizeMatch)
          .map((entry) => entry.median_monthly_income_post_tax) || []
    )
    .filter((val) => typeof val === 'number');

  if (allIncomes.length > 0) {
    const avg =
      allIncomes.reduce((sum, val) => sum + val, 0) / allIncomes.length;
    return avg;
  }

  return averageIncome;
};

export default getIncome;
