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
import { Button, Flex, Image, Text, View } from "@aws-amplify/ui-react";
export default function NavBarHeader(props) {
  const { overrides: overridesProp, ...rest } = props;
  const variants = [
    {
      overrides: {
        "THE_GRID_logo_RGB_black 1": {},
        "Logo Area": {},
        "EN | FR": {},
        "Frame 5": {},
        Home: {},
        about: {},
        datasets: {},
        "data playground": {},
        FAQ: {},
        "contact us": {},
        Button5933520: {},
        Button5933521: {},
        "Right Side": {},
        NavBarHeader: {},
      },
      variantValues: { property1: "Default" },
    },
  ];
  const overrides = mergeVariantsAndOverrides(
    getOverridesFromVariants(variants, props),
    overridesProp || {}
  );
  return (
    <Flex
      gap="297px"
      direction="row"
      width="1440px"
      height="114px"
      justifyContent="center"
      alignItems="center"
      position="relative"
      boxShadow="0px 2px 6px rgba(0.05098039284348488, 0.10196078568696976, 0.14901961386203766, 0.15000000596046448)"
      padding="24px 32px 24px 32px"
      backgroundColor="rgba(251,208,101,1)"
      display="flex"
      {...getOverrideProps(overrides, "NavBarHeader")}
      {...rest}
    >
      <Flex
        gap="29px"
        direction="row"
        width="323px"
        height="unset"
        justifyContent="flex-start"
        alignItems="center"
        shrink="0"
        position="relative"
        padding="0px 0px 0px 0px"
        display="flex"
        {...getOverrideProps(overrides, "Frame 5")}
      >
        <View
          width="34.55px"
          height="30px"
          display="block"
          gap="unset"
          alignItems="unset"
          justifyContent="unset"
          shrink="0"
          position="relative"
          padding="0px 0px 0px 0px"
          {...getOverrideProps(overrides, "Logo Area")}
        >
          <Image
            width="240.22%"
            height="203.33%"
            display="block"
            gap="unset"
            alignItems="unset"
            justifyContent="unset"
            position="absolute"
            top="-51.67%"
            bottom="-51.67%"
            left="-69.46%"
            right="-70.76%"
            padding="0px 0px 0px 0px"
            objectFit="cover"
            {...getOverrideProps(overrides, "THE_GRID_logo_RGB_black 1")}
          ></Image>
        </View>
        <Text
          fontFamily="Gotham Narrow"
          fontSize="16px"
          fontWeight="350"
          color="rgba(0,0,0,1)"
          textTransform="uppercase"
          lineHeight="24px"
          textAlign="left"
          display="block"
          direction="column"
          justifyContent="unset"
          width="109px"
          height="unset"
          gap="unset"
          alignItems="unset"
          shrink="0"
          position="relative"
          padding="0px 0px 0px 0px"
          whiteSpace="pre-wrap"
          children="EN | FR"
          {...getOverrideProps(overrides, "EN | FR")}
        ></Text>
      </Flex>
      <Flex
        gap="48px"
        direction="row"
        width="unset"
        height="unset"
        justifyContent="flex-start"
        alignItems="flex-start"
        shrink="0"
        position="relative"
        padding="0px 0px 0px 0px"
        display="flex"
        {...getOverrideProps(overrides, "Right Side")}
      >
        <Text
          fontFamily="Gotham Narrow"
          fontSize="16px"
          fontWeight="350"
          color="rgba(0,0,0,1)"
          textTransform="uppercase"
          lineHeight="24px"
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
          children="Home"
          {...getOverrideProps(overrides, "Home")}
        ></Text>
        <Text
          fontFamily="Gotham Narrow"
          fontSize="16px"
          fontWeight="350"
          color="rgba(0,0,0,1)"
          textTransform="uppercase"
          lineHeight="24px"
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
          children="about"
          {...getOverrideProps(overrides, "about")}
        ></Text>
        <Text
          fontFamily="Gotham Narrow"
          fontSize="16px"
          fontWeight="350"
          color="rgba(0,0,0,1)"
          textTransform="uppercase"
          lineHeight="24px"
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
          children="datasets"
          {...getOverrideProps(overrides, "datasets")}
        ></Text>
        <Text
          fontFamily="Gotham Narrow"
          fontSize="16px"
          fontWeight="350"
          color="rgba(0,0,0,1)"
          textTransform="uppercase"
          lineHeight="24px"
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
          children="data playground"
          {...getOverrideProps(overrides, "data playground")}
        ></Text>
        <Text
          fontFamily="Gotham Narrow"
          fontSize="16px"
          fontWeight="350"
          color="rgba(0,0,0,1)"
          textTransform="uppercase"
          lineHeight="24px"
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
          children="FAQ"
          {...getOverrideProps(overrides, "FAQ")}
        ></Text>
        <Text
          fontFamily="Gotham Narrow"
          fontSize="16px"
          fontWeight="350"
          color="rgba(0,0,0,1)"
          textTransform="uppercase"
          lineHeight="24px"
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
          children="contact us"
          {...getOverrideProps(overrides, "contact us")}
        ></Text>
        <Button
          width="unset"
          height="unset"
          display="none"
          shrink="0"
          size="default"
          isDisabled={false}
          variation="link"
          children="Log in"
          {...getOverrideProps(overrides, "Button5933520")}
        ></Button>
        <Button
          width="unset"
          height="unset"
          display="none"
          shrink="0"
          size="default"
          isDisabled={false}
          variation="primary"
          children="Sign up"
          {...getOverrideProps(overrides, "Button5933521")}
        ></Button>
      </Flex>
    </Flex>
  );
}
