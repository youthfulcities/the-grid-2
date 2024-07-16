import { Text } from '@aws-amplify/ui-react';
import React from 'react';
import styled from 'styled-components';

const SmallText = styled(Text)`
  margin: 0;
  color: var(--amplify-colors-font-primary);
  font-weight: 400;
  font-size: var(--amplify-font-sizes-small);
`;

const TooltipContainer = styled.div`
  position: absolute;
  z-index: 9999;
  pointer-events: none;
  flex-direction: column;
  padding: var(--amplify-space-xs) var(--amplify-space-small);
  text-align: left;
  background-color: white;
  max-width: 300px;
  border-radius: var(--amplify-space-xs);
`;

const Tooltip: React.FC<{
  x: number;
  y: number;
  content: string;
  group: string;
}> = ({ x, y, content, group }) => {
  console.log(x, y);
  return (
    <TooltipContainer style={{ left: x, top: y }}>
      {content}
      <SmallText>{group}</SmallText>
    </TooltipContainer>
  );
};

export default Tooltip;
