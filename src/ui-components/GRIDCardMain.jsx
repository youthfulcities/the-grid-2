/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  getOverrideProps,
  getOverridesFromVariants,
  mergeVariantsAndOverrides,
} from "./utils";
import { Flex, Heading, Image, Text } from "@aws-amplify/ui-react";
export default function GRIDCardMain(props) {
  const {
    title,
    year,
    description,
    cardActionButtons,
    overrides: overridesProp,
    ...rest
  } = props;
  const variants = [
    {
      overrides: {
        "2023": {},
        image: {},
        Heading: {},
        "Now in its third iteration, the Urban Work Index 2023 ranks 30 cities across Canada to find the best places for youth to work and live.":
          {},
        "Main Text": {},
        "Circle Button58551424": {},
        "Circle Button58551425": {},
        "Circle Button58551426": {},
        "Circle Button58551427": {},
        "Card Action Buttons": {},
        "Card Area": {},
        GRIDCardMain: {},
      },
      variantValues: { property1: "Green" },
    },
    {
      overrides: {
        "2023": { color: "rgba(225,89,76,1)" },
        image: {},
        Heading: {},
        "Now in its third iteration, the Urban Work Index 2023 ranks 30 cities across Canada to find the best places for youth to work and live.":
          {},
        "Main Text": {},
        "Circle Button58551424": { backgroundColor: "rgba(242,107,95,1)" },
        "Circle Button58551425": { backgroundColor: "rgba(242,107,95,1)" },
        "Circle Button58551426": { backgroundColor: "rgba(242,107,95,1)" },
        "Circle Button58551427": {},
        "Card Action Buttons": {},
        "Card Area": { height: "395px", shrink: "0" },
        GRIDCardMain: { backgroundColor: "rgba(251,208,101,1)" },
      },
      variantValues: { property1: "Yellow" },
    },
    {
      overrides: {
        "2023": {},
        image: {},
        Heading: {},
        "Now in its third iteration, the Urban Work Index 2023 ranks 30 cities across Canada to find the best places for youth to work and live.":
          {},
        "Main Text": {},
        "Circle Button58551424": {},
        "Circle Button58551425": {},
        "Circle Button58551426": {},
        "Circle Button58551427": {},
        "Card Action Buttons": {},
        "Card Area": {},
        GRIDCardMain: { backgroundColor: "rgba(250,231,230,1)" },
      },
      variantValues: { property1: "Pink" },
    },
    {
      overrides: {
        "2023": { color: "rgba(250,208,102,1)" },
        image: {},
        Heading: {},
        "Now in its third iteration, the Urban Work Index 2023 ranks 30 cities across Canada to find the best places for youth to work and live.":
          { color: "rgba(255,255,255,1)" },
        "Main Text": {},
        "Circle Button58551424": { backgroundColor: "rgba(251,208,101,1)" },
        "Circle Button58551425": { backgroundColor: "rgba(251,208,101,1)" },
        "Circle Button58551426": { backgroundColor: "rgba(251,208,101,1)" },
        "Circle Button58551427": {},
        "Card Action Buttons": {},
        "Card Area": {},
        GRIDCardMain: { backgroundColor: "rgba(242,107,95,1)" },
      },
      variantValues: { property1: "Orange" },
    },
  ];
  const overrides = mergeVariantsAndOverrides(
    getOverridesFromVariants(variants, props),
    overridesProp || {}
  );
  return (
    <Flex
      gap="12px"
      direction="column"
      width="360px"
      height="616px"
      justifyContent="center"
      alignItems="flex-start"
      overflow="hidden"
      position="relative"
      boxShadow="0px 2px 6px rgba(0.05098039284348488, 0.10196078568696976, 0.14901961386203766, 0.15000000596046448)"
      padding="0px 0px 0px 0px"
      backgroundColor="rgba(184,217,140,1)"
      display="flex"
      {...getOverrideProps(overrides, "GRIDCardMain")}
      {...rest}
    >
      <Image
        width="unset"
        height="209px"
        display="block"
        gap="unset"
        alignItems="unset"
        justifyContent="unset"
        shrink="0"
        alignSelf="stretch"
        position="relative"
        padding="0px 0px 0px 0px"
        objectFit="cover"
        {...getOverrideProps(overrides, "image")}
      ></Image>
      <Flex
        gap="48px"
        direction="column"
        width="unset"
        height="unset"
        justifyContent="center"
        alignItems="center"
        grow="1"
        shrink="1"
        basis="0"
        alignSelf="stretch"
        position="relative"
        padding="31px 30px 31px 30px"
        display="flex"
        {...getOverrideProps(overrides, "Card Area")}
      >
        <Flex
          gap="24px"
          direction="column"
          width="unset"
          height="unset"
          justifyContent="flex-start"
          alignItems="flex-start"
          shrink="0"
          position="relative"
          padding="0px 0px 0px 0px"
          display="flex"
          {...getOverrideProps(overrides, "Main Text")}
        >
          <Heading
            width="unset"
            height="unset"
            shrink="0"
            level="3"
            children="Urban Work Index"
            {...getOverrideProps(overrides, "Heading")}
          ></Heading>
          <Text
            fontFamily="Gotham Narrow"
            fontSize="20px"
            fontWeight="400"
            color="rgba(30,48,108,1)"
            textTransform="uppercase"
            lineHeight="25px"
            textAlign="left"
            display="block"
            direction="column"
            justifyContent="unset"
            width="unset"
            height="unset"
            gap="unset"
            alignItems="unset"
            shrink="0"
            alignSelf="stretch"
            position="relative"
            padding="0px 0px 0px 0px"
            whiteSpace="pre-wrap"
            children={year}
            {...getOverrideProps(overrides, "2023")}
          ></Text>
          <Text
            fontFamily="Gotham Narrow"
            fontSize="16px"
            fontWeight="325"
            color="rgba(32,31,30,1)"
            lineHeight="24px"
            textAlign="left"
            display="block"
            direction="column"
            justifyContent="unset"
            letterSpacing="0.01px"
            width="unset"
            height="unset"
            gap="unset"
            alignItems="unset"
            shrink="0"
            alignSelf="stretch"
            position="relative"
            padding="0px 0px 0px 0px"
            whiteSpace="pre-wrap"
            children={description}
            {...getOverrideProps(
              overrides,
              "Now in its third iteration, the Urban Work Index 2023 ranks 30 cities across Canada to find the best places for youth to work and live."
            )}
          ></Text>
        </Flex>
        <Flex
          gap="26px"
          direction="row"
          width="unset"
          height="unset"
          justifyContent="flex-start"
          alignItems="flex-start"
          shrink="0"
          position="relative"
          padding="0px 0px 0px 0px"
          display="flex"
          children={cardActionButtons}
          {...getOverrideProps(overrides, "Card Action Buttons")}
        ></Flex>
      </Flex>
    </Flex>
  );
}
