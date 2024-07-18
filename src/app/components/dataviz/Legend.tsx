import React from 'react';
import styled from 'styled-components';

const LegendContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-top: var(--amplify-space-xs);
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const LegendColorBox = styled.div<{ color: string }>`
  width: var(--amplify-font-sizes-xs);
  height: var(--amplify-font-sizes-xs);
  background-color: ${(props) => props.color};
  margin-right: 10px;
`;

const LegendLabel = styled.span`
  font-size: var(--amplify-font-sizes-xs);
  color: var(--amplify-colors-font-inverse);
`;

interface LegendProps {
  data: Array<{ key: string; color: string }>;
}

const Legend: React.FC<LegendProps> = ({ data }) => {
  return (
    <LegendContainer>
      {data.map((item, index) => (
        <LegendItem key={index}>
          <LegendColorBox color={item.color} />
          <LegendLabel>{item.key}</LegendLabel>
        </LegendItem>
      ))}
    </LegendContainer>
  );
};

export default Legend;
