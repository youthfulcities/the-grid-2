import CompareCities from '@/app/components/CompareCities';
import { Heading, Text } from '@aws-amplify/ui-react';
import { ProcessedDataItem } from '../types/CostTypes';
import { IncomeData } from '../types/IncomeTypes';
import getIncome from '../utils/calculateIncome';
import occupationMap from '../utils/occupationMap.json';
import provinceMap from '../utils/provinceMap.json';

interface AffordabilityComparisonProps {
  data: ProcessedDataItem[];
  income: IncomeData;
}

const AffordabilityComparison: React.FC<AffordabilityComparisonProps> = ({
  data,
  income,
}) => {
  const cityList = data.map((d) => d.city);

  const renderCard = (city: string, activeCity: string) => {
    const industries = Array.from({ length: 10 }, (_, index) => ({
      occupation: occupationMap[index.toString() as keyof typeof occupationMap],
      income: getIncome({
        city,
        currentProvince: provinceMap[city as keyof typeof provinceMap],
        currentOccupation:
          occupationMap[index.toString() as keyof typeof occupationMap],
        income,
      }),
    }));
    industries.sort((a, b) => b.income - a.income);

    return (
      <>
        <Heading level={4} color='secondary.60'>
          Top 3 industries
        </Heading>
        {industries.slice(0, 3).map((industry, index) => (
          <Text key={industry.occupation}>
            {index + 1}. {industry.occupation}
          </Text>
        ))}
      </>
    );
  };

  return <CompareCities allCities={cityList} renderCard={renderCard} />;
};

export default AffordabilityComparison;
