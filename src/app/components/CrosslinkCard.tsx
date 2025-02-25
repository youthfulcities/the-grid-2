import useTranslation from '@/app/i18n/client';
import shouldUseWhiteText from '@/lib/shouldUseWhiteText';
import Color from 'color-thief-react';
import { useParams } from 'next/navigation';

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
  heading: string;
  buttonText?: string;
  link: string;
}

const CardContainer = styled(Flex)<{ $width: number }>`
  position: relative;
`;

const CardOverlay = styled(Flex)<{
  ismobile: boolean;
  color: string;
}>`
  position: ${({ ismobile }) => (ismobile ? 'relative' : 'absolute')};
  flex-direction: column;
  justify-content: space-between;
  gap: 0;
  bottom: 0;
  width: 100%;
  height: 100%;

  background: ${({ ismobile, color }) =>
    ismobile
      ? color
      : `linear-gradient(
      0deg,
      ${color},
      rgba(0, 0, 0, 0) 50%
    )`};

  button {
    width: 100%;
  }
`;

const CrosslinkCard: React.FC<CrosslinkCardProps> = ({
  src,
  alt,
  heading,
  buttonText,
  link,
}) => {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'translation');

  const ismobile = useBreakpointValue({
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
      <Color src={src} format='rgbString' crossOrigin='youthfulcities.com'>
        {({ data, loading, error }) => (
          <CardOverlay
            padding='medium'
            ismobile={ismobile as boolean}
            color={data || 'rgb(0, 0, 0)'}
          >
            <Heading
              level={3}
              color={
                shouldUseWhiteText(data || 'rgb(0,0,0)')
                  ? 'neutral.10'
                  : 'neutral.100'
              }
              dangerouslySetInnerHTML={{ __html: heading }}
            />
            <Link href={link} target='_blank'>
              <Button variation='primary'>
                {buttonText || t('blog_button')}
              </Button>
            </Link>
          </CardOverlay>
        )}
      </Color>
    </CardContainer>
  );
};

export default CrosslinkCard;
