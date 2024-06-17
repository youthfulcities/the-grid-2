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
import MyIcon from "./MyIcon";
import { Flex, Text, View } from "@aws-amplify/ui-react";
export default function CircleButton(props) {
  const { circleButton, icon, overrides: overridesProp, ...rest } = props;
  const variants = [
    {
      overrides: {
        MyIcon: {},
        "Button Icon58551430": {},
        label: {},
        "Button Icon58551432": {},
        CircleButton: {},
      },
      variantValues: { property1: "Default" },
    },
    {
      overrides: {
        MyIcon: {},
        "Button Icon58551430": {},
        label: {},
        "Button Icon58551432": {},
        CircleButton: { backgroundColor: "rgba(242,107,95,1)" },
      },
      variantValues: { property1: "Hover" },
    },
    {
      overrides: {
        MyIcon: {},
        "Button Icon58551430": {},
        label: {},
        "Button Icon58551432": {},
        CircleButton: { backgroundColor: "rgba(172,169,165,1)" },
      },
      variantValues: { property1: "Disabled" },
    },
  ];
  const overrides = mergeVariantsAndOverrides(
    getOverridesFromVariants(variants, props),
    overridesProp || {}
  );
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
      borderRadius="35px"
      padding="8px 16px 8px 16px"
      backgroundColor="rgba(251,208,101,1)"
      display="flex"
      {...getOverrideProps(overrides, "CircleButton")}
      {...rest}
    >
      <MyIcon
        display="block"
        gap="unset"
        alignItems="unset"
        justifyContent="unset"
        shrink="0"
        position="relative"
        padding="0px 0px 0px 0px"
        type="map"
        {...getOverrideProps(overrides, "MyIcon")}
      ></MyIcon>
      <View
        width="16px"
        height="16px"
        {...getOverrideProps(overrides, "Button Icon58551430")}
      ></View>
      <Text
        fontFamily="Inter"
        fontSize="18px"
        fontWeight="700"
        color="rgba(0,0,0,1)"
        lineHeight="27px"
        textAlign="left"
        display="none"
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
      <View
        width="16px"
        height="16px"
        {...getOverrideProps(overrides, "Button Icon58551432")}
      ></View>
    </Flex>
  );
}
