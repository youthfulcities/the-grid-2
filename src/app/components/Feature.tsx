import useTranslation from '@/app/i18n/client';
import useDownloadFile from '@/hooks/useDownloadFile';
import { Button, Card, Flex, Heading, Text, View } from '@aws-amplify/ui-react';
import { useParams } from 'next/navigation';
import React from 'react';
import { FaFileArrowDown } from 'react-icons/fa6';
import styled from 'styled-components';

interface FeatureProps {
  color?: string;
  value?: string;
}

const StyledImage = styled.img`
  aspect-ratio: 8 / 10;
  object-fit: contain;
  width: 100%;
  max-width: 400px;
`;

const Feature: React.FC<FeatureProps> = ({ color = 'blue', value = '60' }) => {
  const { downloadFile } = useDownloadFile();
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'translation');

  return (
    <Card
      backgroundColor={`${color}.${value}`}
      variation='elevated'
      borderRadius='xl'
      padding='xl'
      marginTop='xxl'
      marginBottom='xxl'
    >
      <Flex
        direction={{ base: 'column', medium: 'row' }}
        gap='xl'
        alignItems='center'
        justifyContent='space-between'
        wrap='nowrap'
      >
        <StyledImage
          src='https://www.youthfulcities.com/wp-content/uploads/2025/05/insight-part-1.3.png'
          alt={t('feature_title')}
        />
        <Flex
          direction='column'
          justifyContent='center'
          maxWidth={{ base: '100%', medium: '60%' }}
          paddingTop={{ base: 'medium', medium: '0' }}
        >
          <View marginBottom='small'>
            <Heading level={5} color='yellow.60'>
              {t('feature_tag')}
            </Heading>
            <Heading level={3}>{t('feature_title')}</Heading>
          </View>
          <Text marginBottom='medium'>{t('feature_desc')}</Text>
          <Button
            gap='xs'
            data-ga-download='download-insight-part-1-final-small.pdf'
            id='feature-download-insight-part-1-final-small.pdf'
            onClick={() =>
              downloadFile(
                'reports/Building-Bridges-Connecting-Youth-Skills-to-the-Future-of-Work-(Part-1).pdf',
                true
              )
            }
            variation='primary'
          >
            <FaFileArrowDown /> Download Part 1
          </Button>
          <Button
            gap='xs'
            data-ga-download='download-insight-part-2'
            id='download-insight-part-2'
            onClick={() =>
              downloadFile(
                'reports/Building-Bridges-Connecting-Youth-Skills-to-the-Future-of-Work-(Part-2).pdf',
                true
              )
            }
            variation='primary'
          >
            <FaFileArrowDown /> Download Part 2
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};

export default Feature;
