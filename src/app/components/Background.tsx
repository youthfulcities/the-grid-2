import { useTheme } from '@aws-amplify/ui-react';
import { ReactNode } from 'react';
import styled from 'styled-components';

interface ContainerProps {
  background?: string;
  children: ReactNode;
}

const Background = styled.main<{ $background: string }>`
  background-color: ${(props) => props.$background};
  height: 100%;
`;

const Container: React.FC<ContainerProps> = ({ background, children }) => {
  const { tokens } = useTheme();
  return (
    <Background
      $background={background || tokens.colors.background.primary.value}
    >
      {children}
    </Background>
  );
};

export default Container;
