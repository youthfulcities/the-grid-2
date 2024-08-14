import { Text } from '@aws-amplify/ui-react';
import React, { useState } from 'react';
import styled from 'styled-components';

const SmallText = styled(Text)`
  margin: 0;
  color: var(--amplify-colors-font-inverse);
  font-weight: 400;
  font-size: var(--amplify-font-sizes-small);
`;

const TooltipContainer = styled.div<{ $minWidth?: number }>`
  position: absolute;
  z-index: 2000;
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
  children?: React.ReactNode;
  minWidth?: number;
}> = ({ x, y, content, group, children, minWidth }) => {
  // const tooltipRef = useRef<HTMLDivElement>(null);
  const [adjusted, setAdjusted] = useState({ x, y });

  // useEffect(() => {
  //   const tooltipElement = tooltipRef.current;

  //   if (tooltipElement) {
  //     const { innerWidth, innerHeight } = window;
  //     const { offsetWidth, offsetHeight } = tooltipElement;
  //     let newX = x;
  //     let newY = y + 20;

  //     // Check if the tooltip overflows the right side of the viewport
  //     if (x + offsetWidth > innerWidth) {
  //       newX = x - 300;
  //     }

  //     // Check if the tooltip overflows the bottom of the viewport
  //     if (newY + offsetHeight > innerHeight) {
  //       newY = y - offsetHeight - 20; // Position above the element if it goes out of the viewport
  //     }

  //     setAdjusted({ x: newX, y: newY });
  //   }
  // }, [x, y, tooltipRef]);

  return (
    <TooltipContainer style={{ left: x, top: y }} $minWidth={minWidth}>
      {content}
      {group && <SmallText>{group}</SmallText>}
      {children}
    </TooltipContainer>
  );
};

export default Tooltip;
