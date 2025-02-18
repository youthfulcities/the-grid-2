import { useTheme } from '@aws-amplify/ui-react';
import { ReactNode } from 'react';
import styled from 'styled-components';

interface ContainerProps {
  background?: string;
  children: ReactNode;
  noOverflow?: boolean;
}

const Background = styled.main<{ $background: string; $noOverflow: boolean }>`
  background-color: var(--amplify-colors-background-primary);
  height: 100%;
  ${(props) => props.$noOverflow && 'overflow-x: hidden'}
`;

const Container: React.FC<ContainerProps> = ({
  background,
  noOverflow = false,
  children,
}) => {
  const { tokens } = useTheme();
  const backgroundColor = tokens.colors.background.primary.value;

  return (
    <Background $background={backgroundColor} $noOverflow={noOverflow}>
      {children}
    </Background>
  );
};

export default Container;
