/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { FlexProps, ImageProps, TextProps } from "@aws-amplify/ui-react";
import { CircleButtonProps } from "./CircleButton";
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
export declare type GRIDCardExampleOverridesProps = {
    "2023"?: PrimitiveOverrideProps<TextProps>;
    GRIDCardExample?: PrimitiveOverrideProps<FlexProps>;
    image?: PrimitiveOverrideProps<ImageProps>;
    "Card Area"?: PrimitiveOverrideProps<FlexProps>;
    "Main Text"?: PrimitiveOverrideProps<FlexProps>;
    "Urban Work Index"?: PrimitiveOverrideProps<TextProps>;
    "Now in its third iteration, the Urban Work Index 2023 ranks 30 cities across Canada to find the best places for youth to work and live."?: PrimitiveOverrideProps<TextProps>;
    "Card Action Buttons"?: PrimitiveOverrideProps<FlexProps>;
    "Circle Button58872048"?: CircleButtonProps;
    "Circle Button58872036"?: CircleButtonProps;
    "Circle Button58872042"?: CircleButtonProps;
    "Circle Button58872030"?: CircleButtonProps;
} & EscapeHatchProps;
export declare type GRIDCardExampleProps = React.PropsWithChildren<Partial<FlexProps> & {
    overrides?: GRIDCardExampleOverridesProps | undefined | null;
}>;
export default function GRIDCardExample(props: GRIDCardExampleProps): React.ReactElement;
