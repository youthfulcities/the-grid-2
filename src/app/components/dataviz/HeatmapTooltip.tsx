import React from 'react';
import styled from 'styled-components';

const SmallText = styled.div`
  margin: 0;
  color: var(--amplify-colors-font-inverse);
  font-weight: 400;
  font-size: var(--amplify-font-sizes-small);
  pointer-events: none;
`;

interface HeatmapTooltipProps {
  value?: number | null;
  cluster?: string;
  topic?: string;
}

const HeatmapTooltip: React.FC<HeatmapTooltipProps> = ({
  value,
  cluster,
  topic,
}) => {
  if (value === null || value === undefined) return null;

  return (
    <SmallText>
      A {value > 0 ? 'positive' : 'negative'} gap ({value}%) between importance
      and performance indicates that the {cluster} cluster considers {topic} to
      be {value < 0 && value > -10 && ''}
      {value < 0 && value < -10 && 'very'}
      {value > 0 && 'less'} important and feels that their city is{' '}
      {value > 0 ? 'exceeding their expectations' : 'underperforming'} in this
      area. Increasing focus on {topic} is likely to have{' '}
      {value < 0 ? 'a positive' : 'less of an'} impact on overall city-living
      experience.
    </SmallText>
  );
};

export default HeatmapTooltip;
