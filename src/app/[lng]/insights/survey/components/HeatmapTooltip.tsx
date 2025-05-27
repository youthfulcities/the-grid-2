import { useParams } from 'next/navigation';
import React from 'react';
import styled from 'styled-components';

const SmallText = styled.div`
  margin: 0;
  color: var(--amplify-colors-font-primary);
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
  const { lng } = useParams<{ lng: string }>();

  if (value === null || value === undefined) return null;

  return (
    <SmallText>
      {lng === 'fr'
        ? `Un écart ${value > 0 ? 'positif' : 'négatif'} (${value}%) entre l'importance et la performance indique que le groupe ${cluster} considère que ${topic} est ${value < 0 && value > -10 && ''}
      ${value < 0 && value < -10 && 'très'}
      ${value > 0 && 'moins'} important et estime que sa ville 
      ${value > 0 ? 'dépasse ses attentes' : 'sous-performante'} dans ce domaine. Une plus grande attention portée à ${topic} iest susceptible d'avoir
      ${value < 0 ? 'un impact positif' : 'moins d’impact'} sur l'expérience globale de la vie en ville.`
        : `A ${value > 0 ? 'positive' : 'negative'} gap (${value}%) between importance
      and performance indicates that the ${cluster} cluster considers ${topic} to
      be 
      ${(value < 0 && value < -10 && 'very') || ''}
      ${(value > 0 && 'less') || ''} important and feels that their city is 
      ${value > 0 ? 'exceeding their expectations' : 'underperforming'} in this
      area. Increasing focus on ${topic} is likely to have
      ${value < 0 ? 'a positive' : 'less of an'} impact on overall city-living
      experience.`}
    </SmallText>
  );
};

export default HeatmapTooltip;
