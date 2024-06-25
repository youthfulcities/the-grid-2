import { Badge } from '@aws-amplify/ui-react';
import { ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface TooltipProps {
  showTooltip: boolean;
  tooltipMsg: string;
  children: ReactNode;
}

const StyledBadge = styled(Badge)<{ $show: boolean; $height: number }>`
  position: absolute;
  top: ${(props) => (props.$show ? -props.$height - 10 + 'px' : '0')};
  left: 0;
  display: flex;
  flex-direction: column;
  padding: var(--amplify-space-small);
  text-align: left;
  border-radius: var(--amplify-space-xs);
  transform: translateX(0);
  transition: all 0.3s ease;
  visibility: ${(props) => (props.$show ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.$show ? '1' : '0')};
  word-break: keep-all;
  z-index: 1;
`;

const MyTooltip = ({ tooltipMsg, showTooltip, children }: TooltipProps) => {
  const [elementHeight, setElementHeight] = useState<number>(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (elementRef.current) {
        const height = elementRef.current.clientHeight;
        setElementHeight(height);
      }
    };

    // Update height after initial render
    updateHeight();

    // Update height whenever the window is resized
    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  console.log(tooltipMsg, elementHeight);

  return (
    <>
      <StyledBadge ref={elementRef} $show={showTooltip} $height={elementHeight}>
        {tooltipMsg}
      </StyledBadge>
      {children}
    </>
  );
};

export default MyTooltip;
