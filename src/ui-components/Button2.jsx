/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { getOverrideProps } from "./utils";
import { Flex, Text } from "@aws-amplify/ui-react";
export default function Button2(props) {
  const { overrides, ...rest } = props;
  return (
    <Flex
      gap="0"
      direction="row"
      width="unset"
      height="unset"
      justifyContent="center"
      alignItems="center"
      position="relative"
      border="3px SOLID rgba(242,105,93,1)"
      padding="6.5px 14.5px 6.5px 14.5px"
      {...getOverrideProps(overrides, "Button2")}
      {...rest}
    >
      <Text
        fontFamily="Inter"
        fontSize="18px"
        fontWeight="700"
        color="rgba(0,0,0,1)"
        lineHeight="27px"
        textAlign="left"
        display="block"
        direction="column"
        justifyContent="unset"
        width="unset"
        height="unset"
        gap="unset"
        alignItems="unset"
        shrink="0"
        position="relative"
        padding="0px 0px 0px 0px"
        whiteSpace="pre-wrap"
        children="Button"
        {...getOverrideProps(overrides, "label")}
      ></Text>
    </Flex>
  );
}
