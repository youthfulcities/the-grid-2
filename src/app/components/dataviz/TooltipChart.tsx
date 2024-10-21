import { Text } from '@aws-amplify/ui-react';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

const SmallText = styled(Text)`
  margin: 0;
  color: var(--amplify-colors-font-inverse);
  font-weight: 400;
  font-size: var(--amplify-font-sizes-small);
`;

const TooltipContainer = styled.div<{ $minWidth?: number }>`
  position: absolute;
  z-index: 999;
  pointer-events: none;
  flex-direction: column;
  padding: var(--amplify-space-xs) var(--amplify-space-small);
  text-align: left;
  color: var(--amplify-colors-font-inverse);
  background-color: rgba(33, 33, 33, 0.7);
  backdrop-filter: blur(10px);
  min-width: ${(props) => (props.$minWidth ? `${props.$minWidth}px` : 'auto')};
  max-width: 300px;
  border-radius: var(--amplify-space-xs);
`;

const Tooltip: React.FC<{
  x: number;
  y: number;
  content?: string;
  group?: string;
  child?: ReactNode;
  minWidth?: number;
}> = ({ x, y, content, group, child, minWidth = 0 }) => (
  <TooltipContainer style={{ left: x, top: y }} $minWidth={minWidth || 0}>
    {content}
    {group && <SmallText>{group}</SmallText>}
    {child}
  </TooltipContainer>
);

export default Tooltip;
