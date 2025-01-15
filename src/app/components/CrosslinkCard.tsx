import {
  Button,
  Flex,
  Heading,
  useBreakpointValue,
} from '@aws-amplify/ui-react';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

interface CrosslinkCardProps {
  src: string;
  alt: string;
  r?: number;
  g?: number;
  b?: number;
  inverse?: boolean;
  heading: string;
  buttonText: string;
  link: string;
}

const CardContainer = styled(Flex)<{ $width: number }>`
  position: relative;
`;

const CardOverlay = styled(Flex)<{
  isMobile: boolean;
  r: number;
  g: number;
  b: number;
}>`
  position: ${({ isMobile }) => (isMobile ? 'relative' : 'absolute')};
  flex-direction: column;
  justify-content: flex-end;
  gap: 0;
  bottom: 0;
  width: 100%;
  height: 100%;

  background: ${({ isMobile, r, g, b }) =>
    isMobile
      ? `rgba(${r}, ${g}, ${b}, 1)`
      : `linear-gradient(
      0deg,
      rgba(${r}, ${g}, ${b}, 1) 20%,
      rgba(0, 0, 0, 0) 50%
    )`};

  button {
    width: 100%;
  }
`;

const CrosslinkCard: React.FC<CrosslinkCardProps> = ({
  src,
  alt,
  r = 0,
  g = 0,
  b = 0,
  inverse = true,
  heading,
  buttonText = 'Read the blog post',
  link,
}) => {
  const isMobile = useBreakpointValue({
    base: true,
    small: true,
    medium: true,
    large: true,
  });

  const dynamicWidth = useBreakpointValue({
    base: 100,
    small: 100,
    medium: 50,
    large: 33,
  });

  return (
    <CardContainer
      direction='column'
      gap='0'
      boxShadow='large'
      $width={dynamicWidth as number}
    >
      <img src={src} alt={alt} width='100%' />
      <CardOverlay
        padding='medium'
        isMobile={isMobile as boolean}
        r={r}
        g={g}
        b={b}
      >
        <Heading level={3} color='neutral.100'>
          {heading}
        </Heading>
        <Link href={link} target='_blank'>
          <Button variation='primary'>{buttonText}</Button>
        </Link>
      </CardOverlay>
    </CardContainer>
  );
};

export default CrosslinkCard;
