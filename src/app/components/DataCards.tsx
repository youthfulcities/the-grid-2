import datasetCards from "@/data/dataset-cards.json";
import {
  Card,
  Flex,
  Heading,
  Text,
  useTheme,
  View,
} from "@aws-amplify/ui-react";
import _ from "lodash";
import { useParams } from "next/navigation";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import useTranslation from "../i18n/client";
import DataCardButton from "./DataCardButton";
import CardAccordion from "./CardAccordion";
import useDimensions from "@/hooks/useDimensions";
import { useRef } from "react";

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
  file?: string;
  filefr?: string;
  link?: string;
  className: string;
  downloads?: Download[];
}

const StyledCard = styled(Card)<{ $background: string; $font: string }>`
  width: 350px;
  height: 550px;
  position: relative;
  display: flex;
  background-color: ${(props) => props.$background};
  color: ${(props) => props.$font};
 
`;

interface AppProps {
  fetchUrl: (url: string) => Promise<{ url: URL; expiresAt: Date } | null>;
}

const DataCard = ({ fetchUrl }: AppProps) => {
  const { tokens } = useTheme();
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, "datasets");

  const sortedDatasetCards = _.orderBy(
    datasetCards.datasetCards,
    "date",
    "desc"
  );

  const getColor = (i: number) => {
    //array of all the different card color patterns
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
  };

  const getFileType = (str: string) => {
    // Check if the string length is less than 4
    if (str.length < 4) {
      return str;
    }
    // Return the last 4 characters
    return str.slice(-4);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useDimensions(containerRef);

  return sortedDatasetCards.map((card: DatasetCard, index: number) => (
    <StyledCard
      $background={getColor(index).background}
      $font={getColor(index).font}
      key={uuidv4()}
      variation="elevated"
      ref={containerRef}
    >
      <div
        className={`card-img ${card.className}`}
        style={{
          position: "absolute",
          top: "-1px",
          transform: `translateX(-${tokens.space.large.value})`,
        }}
      />

      <Flex paddingTop={150} justifyContent="space-between">
        <View>
          <Heading level={3} fontSize="xl" color={getColor(index).titleFont}>
            {lng === "fr" ? card.titlefr : card.title}
          </Heading>
          <Text
            fontWeight="bold"
            fontSize="medium"
            color={getColor(index).titleFont}
          >
            {card.date}
          </Text>
          <Text fontSize="small" color="font.primary">
            {lng === "fr" ? card.descfr : card.desc}
          </Text>
        </View>
      </Flex>
      <CardAccordion parentHeight={height} parentWidth={width} title="info" background={getColor(index).background} font={getColor(index).font}>
          <Flex justifyContent="flex-start" alignItems="flex-start" wrap="wrap" direction="column">
            <DataCardButton
              getColor={getColor}
              index={index}
              file={(lng === "fr" && card.filefr) || card.file}
              fetchUrl={fetchUrl}
              lng={lng}
              type="download"
              tooltipMsg={t("download", { type: getFileType(card.file || "") })}
            />
            {card.link && (
              <DataCardButton
                getColor={getColor}
                index={index}
                fetchUrl={fetchUrl}
                lng={lng}
                type="link"
                link={card.link}
                tooltipMsg={t("link")}
              />
            )}
            {card.downloads &&
              card.downloads.map((download) => (
                <DataCardButton
                  key={uuidv4()}
                  getColor={getColor}
                  index={index}
                  file={(lng === "fr" && download.filefr) || download.file}
                  fetchUrl={fetchUrl}
                  lng={lng}
                  type={download.type}
                  tooltipMsg={
                    (lng === "fr" && download.titlefr) || download.title
                  }
                  tooltipDesc={lng === "fr" ? download.descfr : download.desc}
                />
              ))}
          </Flex>
        </CardAccordion>
    </StyledCard>
  ));
};

export default DataCard;
