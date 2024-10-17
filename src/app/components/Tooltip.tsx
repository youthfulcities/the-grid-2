import { Badge, Text } from '@aws-amplify/ui-react';
import { ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface TooltipProps {
  showTooltip: boolean;
  tooltipMsg: string;
  tooltipDesc?: string;
  children: ReactNode;
}

const StyledBadge = styled(Badge)<{
  $show: boolean;
  $height: number;
  $isBig: boolean;
}>`
  position: absolute;
  top: 50%;
  left: ${(props) => (props.$show ? '110%' : '0')};
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  padding: var(--amplify-space-small);
  text-align: left;
  border-radius: var(--amplify-space-xs);
  transition: all 0.3s ease;
  visibility: ${(props) => (props.$show ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.$show ? '1' : '0')};
  word-break: keep-all;
  width: ${(props) => (props.$isBig ? '300%' : 'auto')};
  z-index: 1;
`;
const SmallText = styled(Text)`
  margin-top: var(--amplify-space-small);
  color: var(--amplify-colors-font-primary);
  font-weight: 400;
  font-size: var(--amplify-fontsize-xs);
`;

const MyTooltip = ({
  tooltipMsg,
  showTooltip,
  tooltipDesc,
  children,
}: TooltipProps) => {
  const [elementHeight, setElementHeight] = useState<number>(0);
  const elementRef = useRef<HTMLDivElement>(null);

  const isBig = () => {
    if (tooltipDesc || tooltipMsg.length > 50) {
      return true;
    }
    return false;
  };

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

  return (
    <>
      <StyledBadge
        ref={elementRef}
        $show={showTooltip}
        $height={elementHeight}
        $isBig={isBig()}
      >
        {tooltipMsg}
        {tooltipDesc && <SmallText>{tooltipDesc}</SmallText>}
      </StyledBadge>
      {children}
    </>
  );
};

export default MyTooltip;
