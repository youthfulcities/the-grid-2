/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { getOverrideProps } from "./utils";
import { Flex, Heading, Image, Text } from "@aws-amplify/ui-react";
export default function GRIDCardMain(props) {
  const { title, year, description, cardActionButtons, overrides, ...rest } =
    props;
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
      padding="0px 0px 0px 0px"
      backgroundColor="rgba(84,13,52,1)"
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
        height="395px"
        justifyContent="center"
        alignItems="center"
        shrink="0"
        alignSelf="stretch"
        position="relative"
        padding="31px 30px 31px 30px"
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
          alignSelf="stretch"
          position="relative"
          padding="0px 0px 0px 0px"
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
            color="rgba(250,208,102,1)"
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
            color="rgba(255,255,255,1)"
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
          children={cardActionButtons}
          {...getOverrideProps(overrides, "Card Action Buttons")}
        ></Flex>
      </Flex>
    </Flex>
  );
}
