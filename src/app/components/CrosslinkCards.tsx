import useTranslation from '@/app/i18n/client';
import shouldUseWhiteText from '@/lib/shouldUseWhiteText';
import { Button, Flex, Grid, Heading } from '@aws-amplify/ui-react';
import Color from 'color-thief-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';
import styled from 'styled-components';

interface Post {
  id: string;
  title: { rendered: string };
  link: string;
  yoast_head_json: { og_image: { url: string }[]; og_description: string };
  class_list: string[];
}

interface CrosslinkCardProps {
  posts: Post[];
}

const CardContainer = styled(Flex)`
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

const CrosslinkCards: React.FC<CrosslinkCardProps> = ({ posts }) => {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'translation');

  const ismobile = true;

  return (
    <Grid
      columnGap='small'
      rowGap='small'
      templateColumns={{
        base: '1fr',
        medium: '1fr 1fr',
        large: '1fr 1fr',
        xl: '1fr 1fr 1fr',
        xxl: '1fr 1fr 1fr 1fr',
      }}
    >
      {posts.map((post) => (
        <CardContainer
          key={post.id}
          direction='column'
          gap='0'
          boxShadow='large'
        >
          <img
            src={post.yoast_head_json.og_image[0]?.url}
            alt={post.yoast_head_json.og_description}
            width='100%'
          />
          <Color
            src={post.yoast_head_json.og_image[0]?.url}
            format='rgbString'
            crossOrigin='youthfulcities.com'
          >
            {({ data }) => (
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
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
                <Link href={post.link} target='_blank'>
                  <Button variation='primary'>{t('blog_button')}</Button>
                </Link>
              </CardOverlay>
            )}
          </Color>
        </CardContainer>
      ))}
    </Grid>
  );
};

export default CrosslinkCards;
