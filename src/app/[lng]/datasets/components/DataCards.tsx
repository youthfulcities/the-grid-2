import CardAccordion from '@/app/[lng]/datasets/components/CardAccordion';
import useTranslation from '@/app/i18n/client';
import datasetCards from '@/data/dataset-cards.json';
import useDimension from '@/hooks/useDimensions';
import useDownloadFile from '@/hooks/useDownloadFile';
import {
  Button,
  Card,
  Flex,
  Heading,
  Text,
  View,
  useTheme,
} from '@aws-amplify/ui-react';
import _ from 'lodash';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import DataCardButton from './DataCardButton';

interface Download {
  title: string;
  desc?: string;
  descfr?: string;
  titlefr?: string;
  type: string;
  file: string;
  filefr?: string;
}

interface DatasetCard {
  title: string;
  titlefr?: string;
  date: string;
  desc: string;
  descfr?: string;
  public?: boolean;
  file?: string;
  filefr?: string;
  link?: string;
  className: string;
  downloads?: Download[];
}

const StyledCard = styled(Card)<{ $background: string; $font: string }>`
  position: relative;
  display: flex;
  border-radius: var(--amplify-radii-large) 0px 0px 0px;
  background-color: ${(props) => props.$background};
  color: ${(props) => props.$font};
`;

const MetadataContainer = styled(View)`
  position: absolute;
  bottom: 10px;
  left: 15px;
  right: 0;
  padding: 10px;
`;

const ClickableText = styled(Text)<{
  $color: string;
  $inverse: string;
}>`
  color: ${(props) => props.$color};
  cursor: pointer;
  text-decoration: underline;
  &:hover {
    color: ${(props) => props.$inverse};
  }
  position: absolute;
  bottom: 90px;
`;

const DownloadButton = styled(Button)<{
  $background: string;
  $font: string;
  $inverse: string;
  $fullWidth: boolean;
}>`
  width: ${(props) => (props.$fullWidth ? '100%' : 'calc(100% - 30px)')};
  height: 30px;
  position: absolute;
  bottom: 0px;
  left: 0px;
  font-size: 15px;
  border-radius: 0px;
  text-transform: uppercase;
  background-color: ${(props) => props.$background};
  color: ${(props) => props.$font};
  border-top: 2px solid ${(props) => props.$inverse};
  border-bottom: none;
  border-left: none;
  border-right: none;
`;

interface AppProps {
  fetchUrl: (url: string) => Promise<{ url: URL; expiresAt: Date } | null>;
  getFileProperties: (filename: string) => Promise<{
    size: number | undefined;
    lastModified: string | undefined;
  } | null>;
}

const bytesToMB = (bytes: number) => (bytes / (1024 * 1024)).toFixed(2);

const DataCard = ({ fetchUrl, getFileProperties }: AppProps) => {
  const { tokens } = useTheme();
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'datasets');
  const { downloadFile } = useDownloadFile();

  const sortedDatasetCards = _.orderBy(
    datasetCards.datasetCards,
    'date',
    'desc'
  );

  // State to trigger re-renders when metadata changes
  const [metadata, setMetadata] = useState<Record<number, any>>({});

  useEffect(() => {
    const fetchMetadata = async (file: string | undefined, index: number) => {
      if (file && !metadata[index]) {
        // Check if metadata already exists
        const properties = await getFileProperties(file);
        if (properties) {
          setMetadata((prev) => ({ ...prev, [index]: properties }));
        }
      }
    };

    sortedDatasetCards.forEach((card, index) => {
      fetchMetadata((lng === 'fr' && card.filefr) || card.file, index);
    });
  }, [sortedDatasetCards, getFileProperties, lng, metadata]);

  const getColor = useCallback(
    (i: number) => {
      // Array of all the different card color patterns
      const options = [
        {
          background: tokens.colors.red[60].value,
          titleFont: tokens.colors.font.primary.value,
          font: tokens.colors.font.primary.value,
          button: tokens.colors.yellow[60].value,
          buttonInverse: tokens.colors.red[60].value,
        },
        {
          background: tokens.colors.yellow[60].value,
          titleFont: tokens.colors.font.primary.value,
          font: tokens.colors.font.primary.value,
          button: tokens.colors.red[60].value,
          buttonInverse: tokens.colors.yellow[60].value,
        },
        {
          background: tokens.colors.green[60].value,
          titleFont: tokens.colors.font.primary.value,
          font: tokens.colors.font.primary.value,
          button: tokens.colors.blue[60].value,
          buttonInverse: tokens.colors.green[60].value,
        },
        {
          background: tokens.colors.pink[60].value,
          titleFont: tokens.colors.font.primary.value,
          font: tokens.colors.font.primary.value,
          button: tokens.colors.blue[60].value,
          buttonInverse: tokens.colors.pink[60].value,
        },
      ];

      const position = i % options.length;
      return options[position];
    },
    [tokens]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useDimension(containerRef);

  return sortedDatasetCards.map((card: DatasetCard, index: number) => {
    const hasAdditionalButtons =
      card.link || (card.downloads && card.downloads.length > 0);
    const cardMetadata = metadata[index];

    return (
      <StyledCard
        $background={getColor(index).background}
        $font={getColor(index).font}
        key={uuidv4()}
        variation='elevated'
        ref={containerRef}
      >
        <div
          className={`card-img ${card.className}`}
          style={{
            borderRadius: 'var(--amplify-radii-large) 0px 0px 0px',
            position: 'absolute',
            top: '-1px',
            transform: `translateX(-${tokens.space.large.value})`,
          }}
        />

        <Flex
          paddingTop={150}
          direction='column'
          justifyContent='space-between'
          height='100%'
        >
          <View marginBottom='xxxl'>
            <Heading level={3} fontSize='xl' color={getColor(index).titleFont}>
              {lng === 'fr' ? card.titlefr : card.title}
            </Heading>
            <Text
              fontWeight='bold'
              fontSize='medium'
              color={getColor(index).titleFont}
            >
              {card.date}
            </Text>
            <Text fontSize='small' color={getColor(index).titleFont}>
              {lng === 'fr' ? card.descfr : card.desc}
            </Text>
          </View>
          {cardMetadata && (
            <MetadataContainer>
              <Text fontSize='xs' color={getColor(index).titleFont}>
                <strong>File Size:</strong>{' '}
                {cardMetadata.size
                  ? `${bytesToMB(cardMetadata.size)} MB`
                  : 'N/A'}
              </Text>
              <Text
                fontSize='xs'
                color={getColor(index).titleFont}
                marginBottom='large'
              >
                <strong>Last Modified:</strong>{' '}
                {cardMetadata.lastModified
                  ? new Date(cardMetadata.lastModified).toLocaleDateString()
                  : 'N/A'}
              </Text>
            </MetadataContainer>
          )}
        </Flex>

        <DownloadButton
          data-ga-download={`download-${card.file}`}
          $background={getColor(index).background}
          $font={getColor(index).font}
          $inverse={getColor(index).button}
          $fullWidth={!hasAdditionalButtons}
          onClick={() =>
            downloadFile(
              (lng === 'fr' && card.filefr) || card.file || '',
              card.public || false
            )
          }
        >
          Download File
        </DownloadButton>

        {/* Conditionally render CardAccordion */}
        {hasAdditionalButtons && (
          <CardAccordion
            parentHeight={height}
            parentWidth={width}
            getColor={getColor}
            index={index}
          >
            <Flex
              justifyContent='flex-start'
              alignItems='flex-start'
              wrap='wrap'
              direction='column'
              style={{
                padding: '10px 15px',
                marginTop: '10px',
              }}
            >
              {card.link && (
                <DataCardButton
                  getColor={getColor}
                  index={index}
                  fetchUrl={fetchUrl}
                  type='link'
                  link={card.link}
                  tooltipMsg={t('link')}
                />
              )}
              {card.downloads &&
                card.downloads.map((download) => (
                  <DataCardButton
                    key={uuidv4()}
                    getColor={getColor}
                    index={index}
                    file={(lng === 'fr' && download.filefr) || download.file}
                    fetchUrl={fetchUrl}
                    type={download.type}
                    tooltipMsg={
                      (lng === 'fr' && download.titlefr) || download.title
                    }
                    tooltipDesc={lng === 'fr' ? download.descfr : download.desc}
                  />
                ))}

              {/* Render metadata inside accordion if there are additional buttons */}
              {/* {cardMetadata && (
                <MetadataContainer style={{ left: '70px' }}>
                  <Text fontSize='xs' color='font.primary'>
                    <strong>File Size:</strong>{' '}
                    {cardMetadata.size
                      ? `${bytesToMB(cardMetadata.size)} MB`
                      : 'N/A'}
                  </Text>
                  <Text fontSize='xs' color='font.primary'>
                    <strong>Last Modified:</strong>{' '}
                    {cardMetadata.lastModified
                      ? new Date(cardMetadata.lastModified).toLocaleDateString()
                      : 'N/A'}
                  </Text>
                </MetadataContainer>
              )} */}
            </Flex>
          </CardAccordion>
        )}
      </StyledCard>
    );
  });
};

export default DataCard;
