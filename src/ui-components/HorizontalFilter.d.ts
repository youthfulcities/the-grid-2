/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { ButtonProps, FlexProps, SelectFieldProps, TextProps, ViewProps } from "@aws-amplify/ui-react";
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
export declare type HorizontalFilterOverridesProps = {
    "2018"?: PrimitiveOverrideProps<TextProps>;
    "2024"?: PrimitiveOverrideProps<TextProps>;
    HorizontalFilter?: PrimitiveOverrideProps<FlexProps>;
    Container?: PrimitiveOverrideProps<FlexProps>;
    "Filter Datasets"?: PrimitiveOverrideProps<TextProps>;
    "Filter Options"?: PrimitiveOverrideProps<FlexProps>;
    Search?: PrimitiveOverrideProps<SelectFieldProps>;
    City?: PrimitiveOverrideProps<SelectFieldProps>;
    Themes?: PrimitiveOverrideProps<SelectFieldProps>;
    "Year Slider"?: PrimitiveOverrideProps<FlexProps>;
    years?: PrimitiveOverrideProps<FlexProps>;
    slider?: PrimitiveOverrideProps<FlexProps>;
    "Rectangle 1166"?: PrimitiveOverrideProps<ViewProps>;
    "Rectangle 1167"?: PrimitiveOverrideProps<ViewProps>;
    "Rectangle 1165"?: PrimitiveOverrideProps<ViewProps>;
    "Rectangle 1164"?: PrimitiveOverrideProps<ViewProps>;
    "Apply Button"?: PrimitiveOverrideProps<ButtonProps>;
    "Clear Button"?: PrimitiveOverrideProps<ButtonProps>;
} & EscapeHatchProps;
export declare type HorizontalFilterProps = React.PropsWithChildren<Partial<FlexProps> & {
    overrides?: HorizontalFilterOverridesProps | undefined | null;
}>;
export default function HorizontalFilter(props: HorizontalFilterProps): React.ReactElement;
