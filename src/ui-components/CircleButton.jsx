/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { getOverrideProps } from "./utils";
import MyIcon from "./MyIcon";
import { Flex } from "@aws-amplify/ui-react";
export default function CircleButton(props) {
  const { overrides, ...rest } = props;
  return (
    <Flex
      gap="0"
      direction="row"
      width="57px"
      height="57px"
      justifyContent="center"
      alignItems="center"
      position="relative"
      boxShadow="0px 2px 2px rgba(0, 0, 0, 0.10000000149011612)"
      borderRadius="1500px"
      padding="0px 0px 0px 0px"
      backgroundColor="rgba(251,208,101,1)"
      {...getOverrideProps(overrides, "CircleButton")}
      {...rest}
    >
      <MyIcon
        width="19.2px"
        height="19.2px"
        display="block"
        gap="unset"
        alignItems="unset"
        justifyContent="unset"
        shrink="0"
        position="relative"
        padding="0px 0px 0px 0px"
        type="globe"
        {...getOverrideProps(overrides, "MyIcon")}
      ></MyIcon>
    </Flex>
  );
}