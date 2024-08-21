import React from 'react';
import styled from 'styled-components';

const SmallText = styled.div`
  margin: 0;
  color: var(--amplify-colors-font-inverse);
  font-weight: 400;
  font-size: var(--amplify-font-sizes-small);
`;

interface BarChartTooltipProps {
  value: string;
  group: string;
  topic: string;
  activeFile: string;
}

const BarChartTooltip: React.FC<BarChartTooltipProps> = ({
  value,
  group,
  topic,
  activeFile,
}) => {
  const getGrammer = (currentGroup: string) => {
    if (activeFile.includes('cluster')) {
      return `in the ${currentGroup} cluster`;
    }
    if (activeFile.includes('city')) {
      return `living in ${currentGroup}`;
    }
    return `who identified as ${currentGroup}`;
  };
  return (
    <SmallText>
      {value}% of youth {getGrammer(group)} selected {topic}.
    </SmallText>
  );
};

export default BarChartTooltip;
