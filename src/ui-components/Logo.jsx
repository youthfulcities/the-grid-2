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
import { Flex, Image } from "@aws-amplify/ui-react";
export default function Logo(props) {
  const { overrides: overridesProp, ...rest } = props;
  const variants = [
    {
      overrides: { THE_GRID_logo_RGB: {}, Logo: {} },
      variantValues: { color: "neutral" },
    },
    {
      overrides: { THE_GRID_logo_RGB: {}, Logo: {} },
      variantValues: { color: "brand" },
    },
  ];
  const overrides = mergeVariantsAndOverrides(
    getOverridesFromVariants(variants, props),
    overridesProp || {}
  );
  return (
    <Flex
      gap="10px"
      direction="column"
      width="unset"
      height="unset"
      justifyContent="flex-start"
      alignItems="flex-start"
      position="relative"
      padding="0px 0px 0px 0px"
      display="flex"
      {...getOverrideProps(overrides, "Logo")}
      {...rest}
    >
      <Image
        width="65px"
        height="45px"
        display="block"
        gap="unset"
        alignItems="unset"
        justifyContent="unset"
        shrink="0"
        position="relative"
        padding="0px 0px 0px 0px"
        objectFit="cover"
        {...getOverrideProps(overrides, "THE_GRID_logo_RGB")}
      ></Image>
    </Flex>
  );
}
