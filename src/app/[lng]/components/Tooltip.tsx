import { Badge } from '@aws-amplify/ui-react';
import { ReactNode } from 'react';
import styled from 'styled-components';

interface TooltipProps {
  showTooltip: boolean;
  children: ReactNode;
}

const StyledBadge = styled(Badge)<{ $show: boolean }>`
  position: absolute;
  top: ${(props) => (props.$show ? '-120%' : '0')};
  left: 0;
  padding: var(--amplify-space-small);
  text-align: left;
  border-radius: var(--amplify-space-xs);
  transform: translateX(0);
  transition: all 0.3s ease;
  visibility: ${(props) => (props.$show ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.$show ? '1' : '0')};
  z-index: 0;
  width: 300%;
`;

const Tooltip = ({ showTooltip, children }: TooltipProps) => (
  <StyledBadge $show={showTooltip}>{children}</StyledBadge>
);

export default Tooltip;
