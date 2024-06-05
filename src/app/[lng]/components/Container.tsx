import { useTheme } from '@aws-amplify/ui-react';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface ContainerProps {
  children: ReactNode; // Define children prop as ReactNode
}

const Background = styled.main<{ $background: string }>`
  background-color: ${(props) => props.$background};
`;

const Container: React.FC<ContainerProps> = ({ children }) => {
  const { tokens } = useTheme();

  return (
    <Background $background={tokens.colors.background.primary.value}>
      {children}
    </Background>
  );
};

export default Container;
