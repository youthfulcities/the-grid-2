import CompareCities from '@/app/[lng]/insights/real-affordability/components/CompareCities';
import BarChart from '@/app/components/dataviz/BarChartGeneral';
import { FlexibleDataItem } from '@/app/components/dataviz/BarChartStacked';
import LineChart from '@/app/components/dataviz/LineChart';
import useTranslation from '@/app/i18n/client';
import { Heading, Text } from '@aws-amplify/ui-react';
import { useParams } from 'next/navigation';
import { useCallback } from 'react';
import { Trans } from 'react-i18next/TransWithoutContext';
import { ProcessedDataItem } from '../types/CostTypes';
import { IncomeData } from '../types/IncomeTypes';
import { ProfileData } from '../types/ProfileTypes';
import ageMap from '../utils/ageMap';
import computeIncomeComparisons from '../utils/computeIncomeComparisons';

interface AffordabilityComparisonProps {
  data: ProcessedDataItem[];
  income: IncomeData;
}

export interface Industry {
  occupation: string;
  occupationKey: string;
  income: number;
}

export const IncomeComparison: React.FC<{
  profile: ProfileData;
  incomeDifference: number;
}> = ({ profile, incomeDifference }) => {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'rai');

  const ageString =
    profile.customized && profile.age
      ? t('age_fragment', {
          ageRange: ageMap(profile.age, lng),
        })
      : '';

  const occupationString = profile.occupation
    ? t('occupation_fragment', {
        occupation: t(profile.occupation),
      })
    : '';

  const percent = Math.abs(incomeDifference).toFixed(0);
  const direction = t(incomeDifference >= 0 ? 'less' : 'more');

  return (
    <Trans
      i18nKey='income_comparison'
      t={t}
      values={{
        age: ageString,
        occupation: occupationString,
        percent,
        direction,
      }}
      components={{ 1: <span className='alt-highlight' /> }}
    />
  );
};

const AffordabilityComparison: React.FC<AffordabilityComparisonProps> = ({
  data,
  income,
}) => {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'rai');
  const cityList = data.map((d) => d.city);

  const renderCard = useCallback(
    (profile: ProfileData, activeProfile: ProfileData, width?: number) => {
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

      const tooltipFormatter = (d: FlexibleDataItem): string =>
        t('gender_tooltip', {
          age: ageMap(profile.age, lng), // or empty string if no age
          occupation: t(d.occupation as string),
          percent: (d.difference as number).toFixed(0),
        });
      return (
        <>
          <Heading level={4} color='secondary.60'>
            {t('industry_title')}
          </Heading>
          <ol>
            {topIndustries.map((industry: Industry) => (
              <li key={industry.occupation}>
                <Text key={industry.occupation}>
                  {t(industry.occupationKey)}
                </Text>
              </li>
            ))}
          </ol>
          <Heading marginTop='large' level={4} color='secondary.60'>
            {t('income_title')}
          </Heading>
          <Text>
            <IncomeComparison
              profile={profile}
              incomeDifference={incomeDifference}
            />
          </Text>
          <BarChart
            width={(width ?? 0) * 0.85}
            height={300}
            data={genderData}
            truncateThreshold={15}
            colors={genderColors}
            labelAccessor={(d) => t(d.occupation as string)}
            valueAccessor={(d) => d.difference as number}
            tooltipFormatter={tooltipFormatter}
            customize={false}
            saveAsImg={false}
            tFile='rai'
            xLabel={t('percent')}
          />
          <Heading marginTop='large' level={4} color='secondary.60'>
            {t('time_title')}
          </Heading>
          <LineChart
            width={(width ?? 0) * 0.85}
            data={combineAgeIncomes}
            tooltipFormatter={(d) =>
              t('time_tooltip', {
                age: t(d.group as string),
                city: d.city,
                income: (d.value as number).toFixed(2),
              })
            }
            labelAccessor={(d) => t(d.group as string)}
            valueAccessor={(d) => d.value as number}
            height={300}
            seriesAccessor={(d) => d.key as string}
            saveAsImg={false}
            xLabel={t('age')}
            yLabel={t('income')}
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
