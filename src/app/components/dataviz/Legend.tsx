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

const LegendItem = styled.div<{ $clickable: boolean }>`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  &:hover {
    cursor: ${(props) => (props.$clickable ? 'pointer' : 'auto')};
  }
`;

const LegendColorBox = styled.div<{
  color: string;
  $isActive: boolean;
  $clickable: boolean;
}>`
  width: var(--amplify-font-sizes-xs);
  height: var(--amplify-font-sizes-xs);
  background-color: ${(props) =>
    props.$isActive || !props.$clickable ? props.color : 'grey'};
  margin-right: 10px;
`;

const LegendLabel = styled.span<{ $isActive: boolean; $clickable: boolean }>`
  font-size: var(--amplify-font-sizes-xs);
  color: ${(props) =>
    props.$isActive || !props.$clickable
      ? 'var(--amplify-colors-font-primary)'
      : 'grey'};
`;

interface LegendProps {
  position?: string;
  data: Array<{ key: string; color: string }>;
  setActiveLegendItems?: React.Dispatch<React.SetStateAction<string[]>>;
  activeLegendItems?: string[];
}

const AbsoluteLegendContainer = styled.div`
  position: absolute;
  right: 0;
  bottom: 80px;
  z-index: 800;
  flex-direction: column;
  padding: var(--amplify-space-xs) var(--amplify-space-small);
  text-align: left;
  color: var(--amplify-colors-font-primary);
  backdrop-filter: blur(10px);
  max-width: 300px;
  border-radius: var(--amplify-space-xs);
`;

const Legend: React.FC<LegendProps> = ({
  data,
  activeLegendItems = [],
  setActiveLegendItems,
  position = 'below',
}) => {
  const handleClick = (key: string) => {
    if (setActiveLegendItems) {
      setActiveLegendItems(
        (prevActiveItems: string[]) =>
          prevActiveItems.includes(key)
            ? prevActiveItems.filter((item: string) => item !== key) // Remove if exists
            : [...prevActiveItems, key] // Add if doesn't exist
      );
    }
  };

  return (
    <>
      {position === 'absolute' ? (
        <AbsoluteLegendContainer>
          {data.map((item) => {
            const isActive = activeLegendItems.some(
              (activeItem) => activeItem === item.key
            );
            return (
              <LegendItem
                $clickable={setActiveLegendItems !== undefined}
                key={item.key}
                onClick={() => handleClick(item.key)}
              >
                <LegendColorBox
                  $clickable={setActiveLegendItems !== undefined}
                  color={item.color}
                  $isActive={isActive}
                />
                <LegendLabel
                  $clickable={setActiveLegendItems !== undefined}
                  $isActive={isActive}
                >
                  {item.key}
                </LegendLabel>
              </LegendItem>
            );
          })}
        </AbsoluteLegendContainer>
      ) : (
        <LegendContainer>
          {data.map((item) => {
            const isActive = activeLegendItems.some(
              (activeItem) => activeItem === item.key
            );
            return (
              <LegendItem
                $clickable={setActiveLegendItems !== undefined}
                key={item.key}
                onClick={() => handleClick(item.key)}
              >
                <LegendColorBox
                  $clickable={setActiveLegendItems !== undefined}
                  color={item.color}
                  $isActive={isActive}
                />
                <LegendLabel
                  $clickable={setActiveLegendItems !== undefined}
                  $isActive={isActive}
                >
                  {item.key}
                </LegendLabel>
              </LegendItem>
            );
          })}
        </LegendContainer>
      )}
    </>
  );
};

export default Legend;
