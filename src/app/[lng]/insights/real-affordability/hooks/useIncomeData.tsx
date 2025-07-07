// hooks/useCityIncomeData.ts
import { useMemo } from 'react';
import getIncome from '../utils/calculateIncome';
import ageMap from '../utils/ageMap';
import genderMap from '../utils/genderMap.json';
import occupationMap from '../utils/occupationMap.json';
import provinceMap from '../utils/provinceMap.json';
import * as d3 from 'd3';

const colors = ['#FBD166', '#2f4eac', '#F2695D']; // your palette
const colorScale = d3
  .scaleOrdinal<string, string>()
  .domain(Object.values(occupationMap))
  .range(colors);

interface Profile {
  gender: string | null;
  occupation: string | null;
  age: number | null;
  customized: boolean;
}

export interface CityPrecomputedData {
  topIndustries: Array<{ occupation: string; income: number }>;
  genderData: Array<{
    occupation: string;
    maleIncome: number;
    femaleIncome: number;
    difference: number;
  }>;
  genderColors: string[];
  incomeDifference: number;
  ageIncomes: Array<{
    value: number;
    group: string;
    city: string;
    profile?: string;
  }>;
}

export function useIncomeData(
  cities: string[],
  profiles: Record<string, Profile>,
  income: any
): Record<string, CityPrecomputedData> {
  return useMemo(() => {
    const result: Record<string, CityPrecomputedData> = {};

    Object.entries(profiles).forEach(([key, profile]) => {
      const city = key.split('-')[0]; // key = city-gender-occupation-age
      const currentProvince = provinceMap[city as keyof typeof provinceMap];
      const profileLabel = `${profile.age}-${profile.gender}-${profile.occupation}`;

      const get = (gender?: string, age?: string, occupation?: string) =>
        getIncome({
          city,
          currentProvince,
          currentGender: gender,
          currentAge: age,
          currentOccupation: occupation,
          income,
        });

      const topIndustries = Object.values(occupationMap)
        .map((o) => ({
          occupation: o,
          income: get(
            genderMap[profile.gender as keyof typeof genderMap],
            profile.customized ? ageMap(profile.age) : undefined,
            o
          ),
        }))
        .sort((a, b) => b.income - a.income)
        .slice(0, 3);

      const genderData = Object.values(occupationMap)
        .map((o) => {
          const male = get(
            'Men+',
            profile.customized ? ageMap(profile.age) : undefined,
            o
          );
          const female = get(
            'Women+',
            profile.customized ? ageMap(profile.age) : undefined,
            o
          );
          return {
            occupation: o,
            maleIncome: male,
            femaleIncome: female,
            difference: female !== 0 ? ((male - female) / female) * 100 : 0,
          };
        })
        .filter((d) => d.difference > 0)
        .sort((a, b) => b.difference - a.difference)
        .slice(0, 5);

      const ageIncomes = [
        '15 to 19 years',
        '20 to 24 years',
        '25 to 29 years',
      ].map((group) => ({
        value: get(
          genderMap[profile.gender as keyof typeof genderMap],
          group,
          occupationMap[profile.occupation as keyof typeof occupationMap]
        ),
        group,
        city,
        profile: profileLabel,
      }));

      const men = get(
        'Men+',
        profile.customized ? ageMap(profile.age) : undefined,
        occupationMap[profile.occupation as keyof typeof occupationMap]
      );
      const women = get(
        'Women+',
        profile.customized ? ageMap(profile.age) : undefined,
        occupationMap[profile.occupation as keyof typeof occupationMap]
      );

      result[key] = {
        topIndustries,
        genderData,
        genderColors: genderData.map((d) => colorScale(d.occupation)),
        incomeDifference: women !== 0 ? ((men - women) / women) * 100 : 0,
        ageIncomes,
      };
    });

    return result;
  }, [profiles, income]);
}