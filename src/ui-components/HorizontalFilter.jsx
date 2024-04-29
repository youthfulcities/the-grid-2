/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { getOverrideProps } from "./utils";
import { Button, Flex, SelectField, Text, View } from "@aws-amplify/ui-react";
export default function HorizontalFilter(props) {
  const { overrides, ...rest } = props;
  return (
    <Flex
      gap="0"
      direction="column"
      width="unset"
      height="78.89px"
      justifyContent="space-between"
      alignItems="flex-start"
      overflow="hidden"
      position="relative"
      padding="2px 2px 2px 2px"
      {...getOverrideProps(overrides, "HorizontalFilter")}
      {...rest}
    >
      <Flex
        gap="0"
        direction="column"
        width="unset"
        height="unset"
        justifyContent="flex-start"
        alignItems="flex-start"
        shrink="0"
        position="relative"
        padding="0px 0px 0px 0px"
        {...getOverrideProps(overrides, "Container")}
      >
        <Text
          fontFamily="Inter"
          fontSize="20px"
          fontWeight="700"
          color="rgba(0,0,0,1)"
          lineHeight="25px"
          textAlign="left"
          display="block"
          direction="column"
          justifyContent="unset"
          width="143px"
          height="unset"
          gap="unset"
          alignItems="unset"
          shrink="0"
          position="relative"
          padding="0px 0px 0px 0px"
          whiteSpace="pre-wrap"
          children="Filter Datasets"
          {...getOverrideProps(overrides, "Filter Datasets")}
        ></Text>
        <Flex
          gap="30.091371536254883px"
          direction="row"
          width="unset"
          height="unset"
          justifyContent="flex-start"
          alignItems="flex-end"
          shrink="0"
          position="relative"
          padding="0px 0px 0px 0px"
          {...getOverrideProps(overrides, "Filter Options")}
        >
          <SelectField
            width="173.6px"
            height="unset"
            label="City"
            placeholder="Search"
            gap="4.629441738128662px"
            shrink="0"
            size="default"
            isDisabled={false}
            labelHidden={false}
            variation="default"
            {...getOverrideProps(overrides, "Search")}
          ></SelectField>
          <SelectField
            width="173.6px"
            height="unset"
            label="City"
            placeholder="All"
            gap="4.629441738128662px"
            shrink="0"
            size="default"
            isDisabled={false}
            labelHidden={false}
            variation="default"
            {...getOverrideProps(overrides, "City")}
          ></SelectField>
          <SelectField
            width="173.6px"
            height="unset"
            label="Themes"
            placeholder="All"
            gap="4.629441738128662px"
            shrink="0"
            size="default"
            isDisabled={false}
            labelHidden={false}
            variation="default"
            {...getOverrideProps(overrides, "Themes")}
          ></SelectField>
          <Flex
            gap="8px"
            direction="column"
            width="unset"
            height="unset"
            justifyContent="center"
            alignItems="flex-start"
            shrink="0"
            alignSelf="stretch"
            position="relative"
            padding="0px 0px 0px 0px"
            {...getOverrideProps(overrides, "Year Slider")}
          >
            <Flex
              padding="0px 0px 0px 0px"
              width="192px"
              height="18px"
              display="block"
              gap="unset"
              alignItems="unset"
              justifyContent="unset"
              shrink="0"
              position="relative"
              {...getOverrideProps(overrides, "years")}
            >
              <Text
                fontFamily="Gotham Narrow"
                fontSize="12px"
                fontWeight="350"
                color="rgba(0,0,0,1)"
                textTransform="uppercase"
                lineHeight="18px"
                textAlign="left"
                display="block"
                direction="column"
                justifyContent="unset"
                width="unset"
                height="unset"
                gap="unset"
                alignItems="unset"
                position="absolute"
                top="0px"
                left="0px"
                padding="0px 0px 0px 0px"
                whiteSpace="pre-wrap"
                children="2018"
                {...getOverrideProps(overrides, "2018")}
              ></Text>
              <Text
                fontFamily="Gotham Narrow"
                fontSize="12px"
                fontWeight="350"
                color="rgba(0,0,0,1)"
                textTransform="uppercase"
                lineHeight="18px"
                textAlign="left"
                display="block"
                direction="column"
                justifyContent="unset"
                width="unset"
                height="unset"
                gap="unset"
                alignItems="unset"
                position="absolute"
                top="0px"
                left="164px"
                padding="0px 0px 0px 0px"
                whiteSpace="pre-wrap"
                children="2024"
                {...getOverrideProps(overrides, "2024")}
              ></Text>
            </Flex>
            <Flex
              padding="0px 0px 0px 0px"
              width="191.91px"
              height="10px"
              display="block"
              gap="unset"
              alignItems="unset"
              justifyContent="unset"
              shrink="0"
              position="relative"
              {...getOverrideProps(overrides, "slider")}
            >
              <View
                width="107.25px"
                height="4px"
                display="block"
                gap="unset"
                alignItems="unset"
                justifyContent="unset"
                position="absolute"
                top="3px"
                left="5.64px"
                padding="0px 0px 0px 0px"
                backgroundColor="rgba(205,137,174,1)"
                {...getOverrideProps(overrides, "Rectangle 1166")}
              ></View>
              <View
                width="79.02px"
                height="4px"
                display="block"
                gap="unset"
                alignItems="unset"
                justifyContent="unset"
                position="absolute"
                top="3px"
                left="112.89px"
                borderRadius="0px 3000px 3000px 0px"
                padding="0px 0px 0px 0px"
                backgroundColor="rgba(172,169,165,1)"
                {...getOverrideProps(overrides, "Rectangle 1167")}
              ></View>
              <View
                width="10px"
                height="10px"
                display="block"
                gap="unset"
                alignItems="unset"
                justifyContent="unset"
                position="absolute"
                top="0px"
                left="107.25px"
                borderRadius="3000px"
                padding="0px 0px 0px 0px"
                backgroundColor="rgba(84,13,52,1)"
                {...getOverrideProps(overrides, "Rectangle 1165")}
              ></View>
              <View
                width="10px"
                height="10px"
                display="block"
                gap="unset"
                alignItems="unset"
                justifyContent="unset"
                position="absolute"
                top="0px"
                left="0px"
                borderRadius="3000px"
                padding="0px 0px 0px 0px"
                backgroundColor="rgba(84,13,52,1)"
                {...getOverrideProps(overrides, "Rectangle 1164")}
              ></View>
            </Flex>
          </Flex>
          <Button
            width="unset"
            height="26.88px"
            border="1px SOLID rgba(242,107,95,1)"
            padding="4.629441738128662px 30.091371536254883px 4.629441738128662px 30.091371536254883px"
            shrink="0"
            backgroundColor="rgba(242,107,95,1)"
            size="large"
            isDisabled={false}
            variation="default"
            children="Apply"
            {...getOverrideProps(overrides, "Apply Button")}
          ></Button>
          <Button
            width="unset"
            height="28.36px"
            border="1.74px SOLID rgba(242,107,95,1)"
            padding="4.629441738128662px 30.091371536254883px 4.629441738128662px 30.091371536254883px"
            shrink="0"
            size="large"
            isDisabled={false}
            variation="default"
            children="clear"
            {...getOverrideProps(overrides, "Clear Button")}
          ></Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
