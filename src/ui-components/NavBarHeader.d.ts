/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { ButtonProps, FlexProps, ImageProps, TextProps, ViewProps } from "@aws-amplify/ui-react";
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
export declare type NavBarHeaderOverridesProps = {
    NavBarHeader?: PrimitiveOverrideProps<FlexProps>;
    "Frame 5"?: PrimitiveOverrideProps<FlexProps>;
    "Logo Area"?: PrimitiveOverrideProps<ViewProps>;
    "THE_GRID_logo_RGB_black 1"?: PrimitiveOverrideProps<ImageProps>;
    "EN | FR"?: PrimitiveOverrideProps<TextProps>;
    "Right Side"?: PrimitiveOverrideProps<FlexProps>;
    Home?: PrimitiveOverrideProps<TextProps>;
    about?: PrimitiveOverrideProps<TextProps>;
    datasets?: PrimitiveOverrideProps<TextProps>;
    insights?: PrimitiveOverrideProps<TextProps>;
    FAQ?: PrimitiveOverrideProps<TextProps>;
    "contact us"?: PrimitiveOverrideProps<TextProps>;
    Button5933520?: PrimitiveOverrideProps<ButtonProps>;
    Button5933521?: PrimitiveOverrideProps<ButtonProps>;
} & EscapeHatchProps;
export declare type NavBarHeaderProps = React.PropsWithChildren<Partial<FlexProps> & {
    property1?: "Default";
} & {
    overrides?: NavBarHeaderOverridesProps | undefined | null;
}>;
export default function NavBarHeader(props: NavBarHeaderProps): React.ReactElement;
