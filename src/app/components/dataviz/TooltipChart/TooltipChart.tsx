import { useTooltip } from '@/app/context/TooltipContext';
import { Text } from '@aws-amplify/ui-react';
import React from 'react';
import styled from 'styled-components';
import { TooltipState } from './TooltipState';

const SmallText = styled(Text)`
  margin: 0;
  color: var(--amplify-colors-font-primary);
  font-weight: 400;
  font-size: var(--amplify-font-sizes-small);
  pointer-events: none;
`;

const TooltipContainer = styled.div<{ $minWidth?: number }>`
  position: absolute;
  z-index: 1001;
  pointer-events: none;
  flex-direction: column;
  padding: var(--amplify-space-xs) var(--amplify-space-small);
  text-align: left;
  color: var(--amplify-colors-font-primary);
  background-color: rgba(33, 33, 33, 0.7);
  backdrop-filter: blur(10px);
  min-width: ${(props) => (props.$minWidth ? `${props.$minWidth}px` : 'auto')};
  max-width: 300px;
  border-radius: var(--amplify-space-xs);
`;

const Tooltip: React.FC<TooltipState> = ({
  x,
  y,
  content,
  group,
  child,
  minWidth = 0,
}) => {
  const { tooltipState } = useTooltip();
  if (!x && !y && !tooltipState.position?.x && !tooltipState.position?.y) {
    return null;
  }

  console.log(x, y, tooltipState.position?.x, tooltipState.position?.y);

  return (
    <TooltipContainer
      style={{
        left: x || tooltipState.position?.x,
        top: y || tooltipState.position?.y,
        // display: x && tooltipState.position?.x ? 'block' : 'none',
      }}
      $minWidth={minWidth || tooltipState.minWidth}
    >
      {content || tooltipState.content}
      {(group || tooltipState.group) && (
        <SmallText>{group || tooltipState.group}</SmallText>
      )}
      {child || tooltipState.child}
    </TooltipContainer>
  );
};

Tooltip.displayName = 'Tooltip';

export default React.memo(Tooltip);
