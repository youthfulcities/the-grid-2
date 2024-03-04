/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { getOverrideProps } from "./utils";
import { Flex, Image, Text } from "@aws-amplify/ui-react";
import CircleButton from "./CircleButton";
export default function GRIDCardExample(props) {
  const { overrides, ...rest } = props;
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
      {...getOverrideProps(overrides, "GRIDCardExample")}
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
        height="412px"
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
          <Text
            fontFamily="Inter"
            fontSize="24px"
            fontWeight="700"
            color="rgba(250,208,102,1)"
            lineHeight="20px"
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
            children="title"
            {...getOverrideProps(overrides, "Urban Work Index")}
          ></Text>
          <Text
            fontFamily="Inter"
            fontSize="20px"
            fontWeight="700"
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
            children="year"
            {...getOverrideProps(overrides, "2023")}
          ></Text>
          <Text
            fontFamily="Inter"
            fontSize="16px"
            fontWeight="400"
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
            children="Now in its third iteration, the Urban Work Index 2023 ranks 30 cities across Canada to find the best places for youth to work and live."
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
          {...getOverrideProps(overrides, "Card Action Buttons")}
        >
          <CircleButton
            display="flex"
            gap="0"
            direction="row"
            width="57px"
            height="57px"
            justifyContent="center"
            alignItems="center"
            shrink="0"
            position="relative"
            boxShadow="0px 2px 2px rgba(0, 0, 0, 0.10000000149011612)"
            borderRadius="1500px"
            padding="0px 0px 0px 0px"
            backgroundColor="rgba(251,208,101,1)"
            {...getOverrideProps(overrides, "Circle Button58872048")}
          ></CircleButton>
          <CircleButton
            display="flex"
            gap="0"
            direction="row"
            width="57px"
            height="57px"
            justifyContent="center"
            alignItems="center"
            shrink="0"
            position="relative"
            boxShadow="0px 2px 2px rgba(0, 0, 0, 0.10000000149011612)"
            borderRadius="1500px"
            padding="0px 0px 0px 0px"
            backgroundColor="rgba(251,208,101,1)"
            {...getOverrideProps(overrides, "Circle Button58872036")}
          ></CircleButton>
          <CircleButton
            display="flex"
            gap="0"
            direction="row"
            width="57px"
            height="57px"
            justifyContent="center"
            alignItems="center"
            shrink="0"
            position="relative"
            boxShadow="0px 2px 2px rgba(0, 0, 0, 0.10000000149011612)"
            borderRadius="1500px"
            padding="0px 0px 0px 0px"
            backgroundColor="rgba(251,208,101,1)"
            {...getOverrideProps(overrides, "Circle Button58872042")}
          ></CircleButton>
          <CircleButton
            display="flex"
            gap="0"
            direction="row"
            width="57px"
            height="57px"
            justifyContent="center"
            alignItems="center"
            shrink="0"
            position="relative"
            boxShadow="0px 2px 2px rgba(0, 0, 0, 0.10000000149011612)"
            borderRadius="1500px"
            padding="0px 0px 0px 0px"
            backgroundColor="rgba(251,208,101,1)"
            {...getOverrideProps(overrides, "Circle Button58872030")}
          ></CircleButton>
        </Flex>
      </Flex>
    </Flex>
  );
}
