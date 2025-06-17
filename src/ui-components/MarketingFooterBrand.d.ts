/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { ButtonProps, FlexProps, TextFieldProps, TextProps } from "@aws-amplify/ui-react";
import { CircleButtonProps } from "./CircleButton";
import { LogoProps } from "./Logo";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type MarketingFooterBrandOverridesProps = {
    MarketingFooterBrand?: PrimitiveOverrideProps<FlexProps>;
    "Frame 440"?: PrimitiveOverrideProps<FlexProps>;
    "Column 1"?: PrimitiveOverrideProps<FlexProps>;
    "Frame 434"?: PrimitiveOverrideProps<FlexProps>;
    "Sign up for our newsletter"?: PrimitiveOverrideProps<TextProps>;
    "Stay connected and up to date on new data, insights, or job postings!"?: PrimitiveOverrideProps<TextProps>;
    "Site Map"?: PrimitiveOverrideProps<FlexProps>;
    "Frame 403"?: PrimitiveOverrideProps<FlexProps>;
    Home?: PrimitiveOverrideProps<TextProps>;
    About?: PrimitiveOverrideProps<TextProps>;
    Datasets?: PrimitiveOverrideProps<TextProps>;
    Insights?: PrimitiveOverrideProps<TextProps>;
    "Frame 404"?: PrimitiveOverrideProps<FlexProps>;
    FAQ?: PrimitiveOverrideProps<TextProps>;
    "Contact Us"?: PrimitiveOverrideProps<TextProps>;
    "Column 2"?: PrimitiveOverrideProps<FlexProps>;
    "Email Signup"?: PrimitiveOverrideProps<FlexProps>;
    TextField?: PrimitiveOverrideProps<TextFieldProps>;
    Button?: PrimitiveOverrideProps<ButtonProps>;
    "Social Media Links"?: PrimitiveOverrideProps<FlexProps>;
    "Circle Button63856842"?: CircleButtonProps;
    "Circle Button63857963"?: CircleButtonProps;
    "Circle Button63858245"?: CircleButtonProps;
    "Circle Button63858593"?: CircleButtonProps;
    "Frame 433"?: PrimitiveOverrideProps<FlexProps>;
    Logo?: LogoProps;
    "\u00A9 2023 The Grid. All rights reserved."?: PrimitiveOverrideProps<TextProps>;
} & EscapeHatchProps;
export declare type MarketingFooterBrandProps = React.PropsWithChildren<Partial<FlexProps> & {
    overrides?: MarketingFooterBrandOverridesProps | undefined | null;
}>;
export default function MarketingFooterBrand(props: MarketingFooterBrandProps): React.ReactElement;
