/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { FlexProps, ImageProps, TextProps, ViewProps } from "@aws-amplify/ui-react";
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
export declare type NavBarHeader2OverridesProps = {
    NavBarHeader2?: PrimitiveOverrideProps<FlexProps>;
    "Frame 5"?: PrimitiveOverrideProps<FlexProps>;
    "Logo Area"?: PrimitiveOverrideProps<ViewProps>;
    "THE_GRID_logo_RGB_black 1"?: PrimitiveOverrideProps<ImageProps>;
    "EN | FR"?: PrimitiveOverrideProps<TextProps>;
    "Right Side"?: PrimitiveOverrideProps<FlexProps>;
    Home?: PrimitiveOverrideProps<TextProps>;
    about?: PrimitiveOverrideProps<TextProps>;
    datasets?: PrimitiveOverrideProps<TextProps>;
    "data playground"?: PrimitiveOverrideProps<TextProps>;
    FAQ?: PrimitiveOverrideProps<TextProps>;
    "contact us"?: PrimitiveOverrideProps<TextProps>;
} & EscapeHatchProps;
export declare type NavBarHeader2Props = React.PropsWithChildren<Partial<FlexProps> & {
    overrides?: NavBarHeader2OverridesProps | undefined | null;
}>;
export default function NavBarHeader2(props: NavBarHeader2Props): React.ReactElement;
