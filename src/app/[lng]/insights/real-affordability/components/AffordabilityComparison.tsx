import CompareCities from '@/app/[lng]/insights/real-affordability/components/CompareCities';
import BarChart from '@/app/components/dataviz/BarChartGeneral';
import LineChart from '@/app/components/dataviz/LineChart';
import { TooltipState } from '@/app/components/dataviz/TooltipChart/TooltipState';
import { Heading, Text } from '@aws-amplify/ui-react';
import { useCallback } from 'react';
import { ProcessedDataItem } from '../types/CostTypes';
import { IncomeData } from '../types/IncomeTypes';
import { ProfileData } from '../types/ProfileTypes';
import ageMap from '../utils/ageMap';
import computeIncomeComparisons from '../utils/computeIncomeComparisons';
import occupationMap from '../utils/occupationMap.json';

interface AffordabilityComparisonProps {
  data: ProcessedDataItem[];
  income: IncomeData;
  tooltipState: TooltipState;
  setTooltipState: React.Dispatch<React.SetStateAction<TooltipState>>;
}

export interface Industry {
  occupation: string;
  income: number;
}

const AffordabilityComparison: React.FC<AffordabilityComparisonProps> = ({
  data,
  income,
}) => {
  const cityList = data.map((d) => d.city);

  const renderCard = useCallback(
    (activeProfile: ProfileData, profile: ProfileData, width?: number) => {
      const {
        topIndustries,
        genderData,
        genderColors,
        incomeDifference,
        ageIncomes,
      } = computeIncomeComparisons(income, profile);

      const { ageIncomes: compareAgeIncomes } = computeIncomeComparisons(
        income,
        activeProfile
      );

      const combineAgeIncomes = activeProfile
        ? [ageIncomes, compareAgeIncomes].flat()
        : ageIncomes;

      return (
        <>
          <Heading level={4} color='secondary.60'>
            Top 3 industries
          </Heading>
          <ol>
            {topIndustries.map((industry: Industry) => (
              <li key={industry.occupation}>
                <Text key={industry.occupation}>{industry.occupation}</Text>
              </li>
            ))}
          </ol>
          <Heading marginTop='large' level={4} color='secondary.60'>
            Gender income disparity
          </Heading>
          <Text>
            Overall, women{' '}
            {profile.customized && profile.age && ` age ${ageMap(profile.age)}`}{' '}
            earn{' '}
            <span className='alt-highlight'>
              {Math.abs(incomeDifference).toFixed(0)}%{' '}
              {incomeDifference >= 0 ? 'less' : 'more'}
            </span>{' '}
            than men
            {profile.occupation &&
              ` in ${occupationMap[profile.occupation as keyof typeof occupationMap]}`}
            . The following chart shows the industries with the greatest
            gender-based income disparity:
          </Text>
          <BarChart
            width={(width ?? 0) * 0.85}
            height={300}
            data={genderData}
            truncateThreshold={15}
            colors={genderColors}
            labelAccessor={(d) => d.occupation as string}
            valueAccessor={(d) => d.difference as number}
            tooltipFormatter={(d) =>
              `${d.occupation}: Women${profile.customized && profile.age ? ` age ${ageMap(profile.age)}` : ''} earn ${(
                d.difference as number
              ).toFixed(0)}% less than men.`
            }
            customize={false}
            saveAsImg={false}
          />
          <Heading marginTop='large' level={4} color='secondary.60'>
            Change in income over time
          </Heading>
          <LineChart
            width={(width ?? 0) * 0.85}
            data={combineAgeIncomes}
            tooltipFormatter={(d) =>
              `${d.group} in ${d.city}: $${(d.value as number).toFixed(2)}`
            }
            labelAccessor={(d) => d.group as string}
            valueAccessor={(d) => d.value as number}
            height={300}
            seriesAccessor={(d) => d.key as string}
            saveAsImg={false}
          />
        </>
      );
    },
    [income]
  );

  return (
    <CompareCities
      allCities={cityList}
      renderCard={renderCard}
      profileSection
    />
  );
};

export default AffordabilityComparison;
