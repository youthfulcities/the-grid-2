/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { getOverrideProps } from "./utils";
import { Button, Flex, Icon, Text } from "@aws-amplify/ui-react";
import MyIcon from "./MyIcon";
export default function DataFilters(props) {
  const { overrides, ...rest } = props;
  return (
    <Flex
      gap="10px"
      direction="row"
      width="385px"
      height="762px"
      justifyContent="flex-start"
      alignItems="flex-start"
      position="relative"
      padding="32px 0px 32px 0px"
      backgroundColor="rgba(236,233,228,1)"
      {...getOverrideProps(overrides, "DataFilters")}
      {...rest}
    >
      <Flex
        gap="32px"
        direction="column"
        width="unset"
        height="unset"
        justifyContent="flex-start"
        alignItems="flex-start"
        grow="1"
        shrink="1"
        basis="0"
        alignSelf="stretch"
        position="relative"
        padding="0px 0px 0px 0px"
        {...getOverrideProps(overrides, "Frame 32158552491")}
      >
        <Flex
          gap="20px"
          direction="column"
          width="unset"
          height="unset"
          justifyContent="flex-start"
          alignItems="flex-start"
          grow="1"
          shrink="1"
          basis="0"
          alignSelf="stretch"
          position="relative"
          padding="0px 32px 0px 32px"
          {...getOverrideProps(overrides, "Frame 32158552492")}
        >
          <Flex
            gap="16px"
            direction="column"
            width="unset"
            height="unset"
            justifyContent="flex-start"
            alignItems="flex-start"
            shrink="0"
            position="relative"
            padding="0px 0px 0px 0px"
            {...getOverrideProps(overrides, "Active Filters")}
          >
            <Flex
              gap="16px"
              direction="row"
              width="unset"
              height="unset"
              justifyContent="flex-start"
              alignItems="center"
              shrink="0"
              position="relative"
              padding="0px 0px 0px 0px"
              {...getOverrideProps(overrides, "Frame 438")}
            >
              <Flex
                gap="8px"
                direction="row"
                width="unset"
                height="unset"
                justifyContent="flex-start"
                alignItems="center"
                shrink="0"
                position="relative"
                padding="0px 0px 0px 0px"
                {...getOverrideProps(overrides, "Label58552494")}
              >
                <Text
                  fontFamily="Gotham Narrow"
                  fontSize="24px"
                  fontWeight="400"
                  color="rgba(242,107,95,1)"
                  lineHeight="36px"
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
                  children="ACTIVE FILTERS"
                  {...getOverrideProps(overrides, "label58552497")}
                ></Text>
              </Flex>
              <Flex
                gap="8px"
                direction="row"
                width="unset"
                height="unset"
                justifyContent="flex-start"
                alignItems="center"
                shrink="0"
                position="relative"
                padding="0px 0px 0px 0px"
                {...getOverrideProps(overrides, "Label58642606")}
              >
                <Text
                  fontFamily="Gotham Narrow"
                  fontSize="14px"
                  fontWeight="350"
                  color="rgba(242,107,95,1)"
                  lineHeight="21px"
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
                  children="Clear All"
                  {...getOverrideProps(overrides, "label58642609")}
                ></Text>
              </Flex>
            </Flex>
            <Flex
              gap="144px"
              direction="row"
              width="unset"
              height="unset"
              justifyContent="flex-start"
              alignItems="center"
              shrink="0"
              position="relative"
              padding="0px 0px 0px 0px"
              {...getOverrideProps(overrides, "Filter Selected")}
            >
              <Flex
                padding="0px 0px 0px 0px"
                width="149px"
                height="23px"
                display="block"
                gap="unset"
                alignItems="unset"
                justifyContent="unset"
                shrink="0"
                position="relative"
                {...getOverrideProps(overrides, "Group 1")}
              >
                <Icon
                  width="21px"
                  height="0px"
                  viewBox={{
                    minX: 0,
                    minY: 0,
                    width: 9.179393600788899e-7,
                    height: 21,
                  }}
                  paths={[
                    {
                      d: "M0 0L21 0L21 -2L0 -2L0 0Z",
                      stroke: "rgba(92,92,92,1)",
                      fillRule: "nonzero",
                      strokeWidth: 2,
                    },
                  ]}
                  display="block"
                  gap="unset"
                  alignItems="unset"
                  justifyContent="unset"
                  position="absolute"
                  top="1px"
                  left="0px"
                  transformOrigin="top left"
                  transform="rotate(90deg)"
                  {...getOverrideProps(overrides, "Line 2")}
                ></Icon>
                <Text
                  fontFamily="Gotham Narrow"
                  fontSize="13px"
                  fontWeight="300"
                  color="rgba(0,0,0,1)"
                  textTransform="uppercase"
                  lineHeight="19.5px"
                  textAlign="left"
                  display="block"
                  direction="column"
                  justifyContent="unset"
                  width="unset"
                  height="unset"
                  gap="unset"
                  alignItems="unset"
                  position="absolute"
                  top="1.5px"
                  left="14px"
                  padding="0px 0px 0px 0px"
                  whiteSpace="pre-wrap"
                  children="CIty"
                  {...getOverrideProps(overrides, "CIty")}
                ></Text>
                <Text
                  fontFamily="Gotham Narrow"
                  fontSize="15px"
                  fontWeight="350"
                  color="rgba(0,0,0,1)"
                  lineHeight="22.5px"
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
                  left="54px"
                  padding="0px 0px 0px 0px"
                  whiteSpace="pre-wrap"
                  children="Charlottetown"
                  {...getOverrideProps(overrides, "Charlottetown")}
                ></Text>
              </Flex>
              <Icon
                width="11px"
                height="11px"
                viewBox={{ minX: 0, minY: 0, width: 11, height: 11 }}
                paths={[
                  {
                    d: "M1.1 11L0 9.9L4.4 5.5L0 1.1L1.1 0L5.5 4.4L9.9 0L11 1.1L6.6 5.5L11 9.9L9.9 11L5.5 6.6L1.1 11Z",
                    fill: "rgba(0,0,0,1)",
                    fillRule: "nonzero",
                  },
                ]}
                display="block"
                gap="unset"
                alignItems="unset"
                justifyContent="unset"
                shrink="0"
                position="relative"
                {...getOverrideProps(overrides, "Vector58642614")}
              ></Icon>
            </Flex>
          </Flex>
          <Flex
            gap="8px"
            direction="column"
            width="300px"
            height="unset"
            justifyContent="flex-start"
            alignItems="flex-start"
            shrink="0"
            position="relative"
            padding="0px 0px 0px 0px"
            {...getOverrideProps(overrides, "SearchField")}
          >
            <Flex
              gap="0"
              direction="column"
              width="unset"
              height="unset"
              justifyContent="flex-start"
              alignItems="flex-start"
              shrink="0"
              alignSelf="stretch"
              position="relative"
              padding="0px 0px 0px 0px"
              backgroundColor="rgba(255,255,255,1)"
              {...getOverrideProps(overrides, "InputGroup")}
            >
              <Flex
                gap="10px"
                direction="row"
                width="unset"
                height="unset"
                justifyContent="center"
                alignItems="center"
                shrink="0"
                alignSelf="stretch"
                position="relative"
                border="3px SOLID rgba(167,167,167,1)"
                padding="0px 0px 0px 16px"
                {...getOverrideProps(overrides, "Input")}
              >
                <Text
                  fontFamily="Inter"
                  fontSize="18px"
                  fontWeight="400"
                  color="rgba(128,128,128,1)"
                  lineHeight="27px"
                  textAlign="left"
                  display="block"
                  direction="column"
                  justifyContent="unset"
                  width="unset"
                  height="unset"
                  gap="unset"
                  alignItems="unset"
                  grow="1"
                  shrink="1"
                  basis="0"
                  position="relative"
                  padding="0px 0px 0px 0px"
                  whiteSpace="pre-wrap"
                  children="Search..."
                  {...getOverrideProps(overrides, "placeholder")}
                ></Text>
                <Button
                  width="unset"
                  height="unset"
                  shrink="0"
                  size="default"
                  isDisabled={false}
                  variation="default"
                  children=""
                  {...getOverrideProps(overrides, "Button")}
                ></Button>
              </Flex>
            </Flex>
          </Flex>
          <Flex
            gap="5px"
            direction="column"
            width="unset"
            height="unset"
            justifyContent="flex-start"
            alignItems="flex-start"
            shrink="0"
            position="relative"
            padding="0px 0px 0px 0px"
            {...getOverrideProps(overrides, "Section58552498")}
          >
            <Flex
              gap="10px"
              direction="row"
              width="308px"
              height="unset"
              justifyContent="flex-start"
              alignItems="center"
              shrink="0"
              position="relative"
              border="1px SOLID rgba(201,201,201,1)"
              padding="0px 0px 5px 0px"
              {...getOverrideProps(overrides, "Label58562564")}
            >
              <Text
                fontFamily="Gotham Narrow"
                fontSize="24px"
                fontWeight="400"
                color="rgba(0,0,0,1)"
                lineHeight="36px"
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
                children="Cities"
                {...getOverrideProps(overrides, "label58552499")}
              ></Text>
              <Icon
                width="21px"
                height="12.97px"
                viewBox={{
                  minX: 0,
                  minY: 0,
                  width: 21.000001133654678,
                  height: 12.967501568849457,
                }}
                paths={[
                  {
                    d: "M2.4675 12.9675L10.5 4.9525L18.5325 12.9675L21 10.5L10.5 0L0 10.5L2.4675 12.9675Z",
                    fill: "rgba(0,0,0,1)",
                    fillRule: "nonzero",
                  },
                ]}
                display="block"
                gap="unset"
                alignItems="unset"
                justifyContent="unset"
                shrink="0"
                position="relative"
                {...getOverrideProps(overrides, "Vector58562563")}
              ></Icon>
            </Flex>
            <Flex
              gap="150px"
              direction="row"
              width="315px"
              height="unset"
              justifyContent="flex-start"
              alignItems="flex-start"
              shrink="0"
              position="relative"
              padding="0px 0px 0px 0px"
              {...getOverrideProps(overrides, "Cities List")}
            >
              <Flex
                gap="5px"
                direction="column"
                width="unset"
                height="unset"
                justifyContent="center"
                alignItems="flex-start"
                shrink="0"
                position="relative"
                padding="0px 0px 0px 0px"
                {...getOverrideProps(overrides, "Cities")}
              >
                <Text
                  fontFamily="Inter"
                  fontSize="16px"
                  fontWeight="400"
                  color="rgba(73,73,73,1)"
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
                  position="relative"
                  padding="0px 0px 0px 0px"
                  whiteSpace="pre-wrap"
                  children="Brampton"
                  {...getOverrideProps(overrides, "item58562546")}
                ></Text>
                <Text
                  fontFamily="Inter"
                  fontSize="16px"
                  fontWeight="400"
                  color="rgba(73,73,73,1)"
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
                  position="relative"
                  padding="0px 0px 0px 0px"
                  whiteSpace="pre-wrap"
                  children="Calgary"
                  {...getOverrideProps(overrides, "item58562545")}
                ></Text>
                <Flex
                  gap="5px"
                  direction="row"
                  width="unset"
                  height="unset"
                  justifyContent="flex-start"
                  alignItems="center"
                  shrink="0"
                  position="relative"
                  padding="0px 0px 0px 0px"
                  {...getOverrideProps(overrides, "Frame 439")}
                >
                  <MyIcon
                    width="14px"
                    height="14px"
                    display="block"
                    gap="unset"
                    alignItems="unset"
                    justifyContent="unset"
                    shrink="0"
                    position="relative"
                    padding="0px 0px 0px 0px"
                    type="plus"
                    {...getOverrideProps(overrides, "MyIcon")}
                  ></MyIcon>
                  <Text
                    fontFamily="Inter"
                    fontSize="16px"
                    fontWeight="600"
                    color="rgba(83,38,232,1)"
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
                    position="relative"
                    padding="0px 0px 0px 0px"
                    whiteSpace="pre-wrap"
                    children="Charlottetown"
                    {...getOverrideProps(overrides, "item58562547")}
                  ></Text>
                </Flex>
                <Text
                  fontFamily="Inter"
                  fontSize="16px"
                  fontWeight="400"
                  color="rgba(73,73,73,1)"
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
                  position="relative"
                  padding="0px 0px 0px 0px"
                  whiteSpace="pre-wrap"
                  children="Edmonton"
                  {...getOverrideProps(overrides, "item58562589")}
                ></Text>
                <Text
                  fontFamily="Inter"
                  fontSize="16px"
                  fontWeight="400"
                  color="rgba(73,73,73,1)"
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
                  position="relative"
                  padding="0px 0px 0px 0px"
                  whiteSpace="pre-wrap"
                  children="Fredericton"
                  {...getOverrideProps(overrides, "item58562590")}
                ></Text>
              </Flex>
              <Flex
                gap="5px"
                direction="column"
                width="28px"
                height="unset"
                justifyContent="flex-start"
                alignItems="flex-end"
                shrink="0"
                position="relative"
                padding="0px 0px 0px 0px"
                {...getOverrideProps(overrides, "Value")}
              >
                <Text
                  fontFamily="Inter"
                  fontSize="16px"
                  fontWeight="400"
                  color="rgba(73,73,73,1)"
                  lineHeight="24px"
                  textAlign="right"
                  display="block"
                  direction="column"
                  justifyContent="unset"
                  letterSpacing="0.01px"
                  width="unset"
                  height="unset"
                  gap="unset"
                  alignItems="unset"
                  shrink="0"
                  position="relative"
                  padding="0px 0px 0px 0px"
                  whiteSpace="pre-wrap"
                  children="144"
                  {...getOverrideProps(overrides, "item58721031")}
                ></Text>
                <Text
                  fontFamily="Inter"
                  fontSize="16px"
                  fontWeight="400"
                  color="rgba(73,73,73,1)"
                  lineHeight="24px"
                  textAlign="right"
                  display="block"
                  direction="column"
                  justifyContent="unset"
                  letterSpacing="0.01px"
                  width="unset"
                  height="unset"
                  gap="unset"
                  alignItems="unset"
                  shrink="0"
                  position="relative"
                  padding="0px 0px 0px 0px"
                  whiteSpace="pre-wrap"
                  children="144"
                  {...getOverrideProps(overrides, "item58721032")}
                ></Text>
                <Text
                  fontFamily="Inter"
                  fontSize="16px"
                  fontWeight="600"
                  color="rgba(83,38,232,1)"
                  lineHeight="24px"
                  textAlign="right"
                  display="block"
                  direction="column"
                  justifyContent="unset"
                  letterSpacing="0.01px"
                  width="unset"
                  height="unset"
                  gap="unset"
                  alignItems="unset"
                  shrink="0"
                  position="relative"
                  padding="0px 0px 0px 0px"
                  whiteSpace="pre-wrap"
                  children="144"
                  {...getOverrideProps(overrides, "item58721033")}
                ></Text>
                <Text
                  fontFamily="Inter"
                  fontSize="16px"
                  fontWeight="400"
                  color="rgba(73,73,73,1)"
                  lineHeight="24px"
                  textAlign="right"
                  display="block"
                  direction="column"
                  justifyContent="unset"
                  letterSpacing="0.01px"
                  width="unset"
                  height="unset"
                  gap="unset"
                  alignItems="unset"
                  shrink="0"
                  position="relative"
                  padding="0px 0px 0px 0px"
                  whiteSpace="pre-wrap"
                  children="144"
                  {...getOverrideProps(overrides, "item58721034")}
                ></Text>
                <Text
                  fontFamily="Inter"
                  fontSize="16px"
                  fontWeight="400"
                  color="rgba(73,73,73,1)"
                  lineHeight="24px"
                  textAlign="right"
                  display="block"
                  direction="column"
                  justifyContent="unset"
                  letterSpacing="0.01px"
                  width="unset"
                  height="unset"
                  gap="unset"
                  alignItems="unset"
                  shrink="0"
                  position="relative"
                  padding="0px 0px 0px 0px"
                  whiteSpace="pre-wrap"
                  children="144"
                  {...getOverrideProps(overrides, "item58721035")}
                ></Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex
            gap="5px"
            direction="column"
            width="unset"
            height="unset"
            justifyContent="flex-start"
            alignItems="flex-start"
            shrink="0"
            position="relative"
            padding="0px 0px 0px 0px"
            {...getOverrideProps(overrides, "Section58552512")}
          >
            <Flex
              gap="10px"
              direction="row"
              width="308px"
              height="unset"
              justifyContent="flex-start"
              alignItems="center"
              shrink="0"
              position="relative"
              border="1px SOLID rgba(201,201,201,1)"
              padding="0px 0px 5px 0px"
              {...getOverrideProps(overrides, "Label58562565")}
            >
              <Text
                fontFamily="Gotham Narrow"
                fontSize="24px"
                fontWeight="400"
                color="rgba(0,0,0,1)"
                lineHeight="36px"
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
                children="City Groups"
                {...getOverrideProps(overrides, "label58562566")}
              ></Text>
              <Icon
                width="21px"
                height="12.97px"
                viewBox={{
                  minX: 0,
                  minY: 0,
                  width: 21.000001133654678,
                  height: 12.967501568849457,
                }}
                paths={[
                  {
                    d: "M2.4675 12.9675L10.5 4.9525L18.5325 12.9675L21 10.5L10.5 0L0 10.5L2.4675 12.9675Z",
                    fill: "rgba(0,0,0,1)",
                    fillRule: "nonzero",
                  },
                ]}
                display="block"
                gap="unset"
                alignItems="unset"
                justifyContent="unset"
                shrink="0"
                position="relative"
                {...getOverrideProps(overrides, "Vector58562567")}
              ></Icon>
            </Flex>
          </Flex>
          <Flex
            gap="5px"
            direction="column"
            width="unset"
            height="unset"
            justifyContent="flex-start"
            alignItems="flex-start"
            shrink="0"
            position="relative"
            padding="0px 0px 0px 0px"
            {...getOverrideProps(overrides, "Section58562568")}
          >
            <Flex
              gap="10px"
              direction="row"
              width="308px"
              height="unset"
              justifyContent="flex-start"
              alignItems="center"
              shrink="0"
              position="relative"
              border="1px SOLID rgba(201,201,201,1)"
              padding="0px 0px 5px 0px"
              {...getOverrideProps(overrides, "Label58562569")}
            >
              <Text
                fontFamily="Gotham Narrow"
                fontSize="24px"
                fontWeight="400"
                color="rgba(0,0,0,1)"
                lineHeight="36px"
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
                children="Province"
                {...getOverrideProps(overrides, "label58562570")}
              ></Text>
              <Icon
                width="21px"
                height="12.97px"
                viewBox={{
                  minX: 0,
                  minY: 0,
                  width: 21.000001133654678,
                  height: 12.967501568849457,
                }}
                paths={[
                  {
                    d: "M2.4675 12.9675L10.5 4.9525L18.5325 12.9675L21 10.5L10.5 0L0 10.5L2.4675 12.9675Z",
                    fill: "rgba(0,0,0,1)",
                    fillRule: "nonzero",
                  },
                ]}
                display="block"
                gap="unset"
                alignItems="unset"
                justifyContent="unset"
                shrink="0"
                position="relative"
                {...getOverrideProps(overrides, "Vector58562571")}
              ></Icon>
            </Flex>
          </Flex>
          <Flex
            gap="5px"
            direction="column"
            width="unset"
            height="unset"
            justifyContent="flex-start"
            alignItems="flex-start"
            shrink="0"
            position="relative"
            padding="0px 0px 0px 0px"
            {...getOverrideProps(overrides, "Section58562575")}
          >
            <Flex
              gap="10px"
              direction="row"
              width="308px"
              height="unset"
              justifyContent="flex-start"
              alignItems="center"
              shrink="0"
              position="relative"
              border="2px SOLID rgba(201,201,201,1)"
              padding="0px 0px 4px 0px"
              {...getOverrideProps(overrides, "Label58562576")}
            >
              <Text
                fontFamily="Gotham Narrow"
                fontSize="24px"
                fontWeight="400"
                color="rgba(0,0,0,1)"
                lineHeight="36px"
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
                children="Topic"
                {...getOverrideProps(overrides, "label58562577")}
              ></Text>
              <Icon
                width="21px"
                height="12.97px"
                viewBox={{
                  minX: 0,
                  minY: 0,
                  width: 21.000001133654678,
                  height: 12.967501568849457,
                }}
                paths={[
                  {
                    d: "M2.4675 12.9675L10.5 4.9525L18.5325 12.9675L21 10.5L10.5 0L0 10.5L2.4675 12.9675Z",
                    fill: "rgba(0,0,0,1)",
                    fillRule: "nonzero",
                  },
                ]}
                display="block"
                gap="unset"
                alignItems="unset"
                justifyContent="unset"
                shrink="0"
                position="relative"
                {...getOverrideProps(overrides, "Vector58562578")}
              ></Icon>
            </Flex>
          </Flex>
          <Flex
            gap="5px"
            direction="column"
            width="unset"
            height="unset"
            justifyContent="center"
            alignItems="flex-start"
            shrink="0"
            position="relative"
            padding="0px 0px 0px 0px"
            {...getOverrideProps(overrides, "Section58562582")}
          >
            <Flex
              gap="10px"
              direction="row"
              width="308px"
              height="unset"
              justifyContent="flex-start"
              alignItems="center"
              shrink="0"
              position="relative"
              border="1px SOLID rgba(201,201,201,1)"
              padding="0px 0px 5px 0px"
              {...getOverrideProps(overrides, "Label58562583")}
            >
              <Text
                fontFamily="Gotham Narrow"
                fontSize="24px"
                fontWeight="400"
                color="rgba(0,0,0,1)"
                lineHeight="36px"
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
                children="Indicator"
                {...getOverrideProps(overrides, "label58562584")}
              ></Text>
              <Icon
                width="21px"
                height="12.97px"
                viewBox={{
                  minX: 0,
                  minY: 0,
                  width: 21.000001133654678,
                  height: 12.967501568849457,
                }}
                paths={[
                  {
                    d: "M2.4675 12.9675L10.5 4.9525L18.5325 12.9675L21 10.5L10.5 0L0 10.5L2.4675 12.9675Z",
                    fill: "rgba(0,0,0,1)",
                    fillRule: "nonzero",
                  },
                ]}
                display="block"
                gap="unset"
                alignItems="unset"
                justifyContent="unset"
                shrink="0"
                position="relative"
                {...getOverrideProps(overrides, "Vector58562585")}
              ></Icon>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
