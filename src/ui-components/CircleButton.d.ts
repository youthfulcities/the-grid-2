/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { MyIconProps } from "./MyIcon";
import { FlexProps, TextProps, ViewProps } from "@aws-amplify/ui-react";
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
export declare type CircleButtonOverridesProps = {
    CircleButton?: PrimitiveOverrideProps<FlexProps>;
    MyIcon?: MyIconProps;
    "Button Icon58551430"?: PrimitiveOverrideProps<ViewProps>;
    label?: PrimitiveOverrideProps<TextProps>;
    "Button Icon58551432"?: PrimitiveOverrideProps<ViewProps>;
} & EscapeHatchProps;
export declare type CircleButtonProps = React.PropsWithChildren<Partial<FlexProps> & {
    property1?: "Default" | "Disabled" | "Hover";
} & {
    overrides?: CircleButtonOverridesProps | undefined | null;
}>;
export default function CircleButton(props: CircleButtonProps): React.ReactElement;
