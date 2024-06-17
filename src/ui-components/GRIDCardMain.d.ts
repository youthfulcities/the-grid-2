/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { FlexProps, HeadingProps, ImageProps, TextProps } from "@aws-amplify/ui-react";
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
export declare type GRIDCardMainOverridesProps = {
    "2023"?: PrimitiveOverrideProps<TextProps>;
    GRIDCardMain?: PrimitiveOverrideProps<FlexProps>;
    image?: PrimitiveOverrideProps<ImageProps>;
    "Card Area"?: PrimitiveOverrideProps<FlexProps>;
    "Main Text"?: PrimitiveOverrideProps<FlexProps>;
    Heading?: PrimitiveOverrideProps<HeadingProps>;
    "Now in its third iteration, the Urban Work Index 2023 ranks 30 cities across Canada to find the best places for youth to work and live."?: PrimitiveOverrideProps<TextProps>;
    "Card Action Buttons"?: PrimitiveOverrideProps<FlexProps>;
    "Circle Button58551424"?: CircleButtonProps;
    "Circle Button58551425"?: CircleButtonProps;
    "Circle Button58551426"?: CircleButtonProps;
    "Circle Button58551427"?: CircleButtonProps;
} & EscapeHatchProps;
export declare type GRIDCardMainProps = React.PropsWithChildren<Partial<FlexProps> & {
    title?: string;
    year?: number;
    description?: string;
    cardActionButtons?: React.ReactNode;
} & {
    property1?: "Green" | "Orange" | "Pink" | "Yellow";
} & {
    overrides?: GRIDCardMainOverridesProps | undefined | null;
}>;
export default function GRIDCardMain(props: GRIDCardMainProps): React.ReactElement;
