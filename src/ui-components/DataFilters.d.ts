/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { ButtonProps, FlexProps, IconProps, TextProps } from "@aws-amplify/ui-react";
import { MyIconProps } from "./MyIcon";
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
export declare type DataFiltersOverridesProps = {
    DataFilters?: PrimitiveOverrideProps<FlexProps>;
    "Frame 32158552491"?: PrimitiveOverrideProps<FlexProps>;
    "Frame 32158552492"?: PrimitiveOverrideProps<FlexProps>;
    "Active Filters"?: PrimitiveOverrideProps<FlexProps>;
    "Frame 438"?: PrimitiveOverrideProps<FlexProps>;
    Label58552494?: PrimitiveOverrideProps<FlexProps>;
    label58552497?: PrimitiveOverrideProps<TextProps>;
    Label58642606?: PrimitiveOverrideProps<FlexProps>;
    label58642609?: PrimitiveOverrideProps<TextProps>;
    "Filter Selected"?: PrimitiveOverrideProps<FlexProps>;
    "Group 1"?: PrimitiveOverrideProps<FlexProps>;
    "Line 2"?: PrimitiveOverrideProps<IconProps>;
    CIty?: PrimitiveOverrideProps<TextProps>;
    Charlottetown?: PrimitiveOverrideProps<TextProps>;
    Vector58642614?: PrimitiveOverrideProps<IconProps>;
    SearchField?: PrimitiveOverrideProps<FlexProps>;
    InputGroup?: PrimitiveOverrideProps<FlexProps>;
    Input?: PrimitiveOverrideProps<FlexProps>;
    placeholder?: PrimitiveOverrideProps<TextProps>;
    Button?: PrimitiveOverrideProps<ButtonProps>;
    Section58552498?: PrimitiveOverrideProps<FlexProps>;
    Label58562564?: PrimitiveOverrideProps<FlexProps>;
    label58552499?: PrimitiveOverrideProps<TextProps>;
    Vector58562563?: PrimitiveOverrideProps<IconProps>;
    "Cities List"?: PrimitiveOverrideProps<FlexProps>;
    Cities?: PrimitiveOverrideProps<FlexProps>;
    item58562546?: PrimitiveOverrideProps<TextProps>;
    item58562545?: PrimitiveOverrideProps<TextProps>;
    "Frame 439"?: PrimitiveOverrideProps<FlexProps>;
    MyIcon?: MyIconProps;
    item58562547?: PrimitiveOverrideProps<TextProps>;
    item58562589?: PrimitiveOverrideProps<TextProps>;
    item58562590?: PrimitiveOverrideProps<TextProps>;
    Value?: PrimitiveOverrideProps<FlexProps>;
    item58721031?: PrimitiveOverrideProps<TextProps>;
    item58721032?: PrimitiveOverrideProps<TextProps>;
    item58721033?: PrimitiveOverrideProps<TextProps>;
    item58721034?: PrimitiveOverrideProps<TextProps>;
    item58721035?: PrimitiveOverrideProps<TextProps>;
    Section58552512?: PrimitiveOverrideProps<FlexProps>;
    Label58562565?: PrimitiveOverrideProps<FlexProps>;
    label58562566?: PrimitiveOverrideProps<TextProps>;
    Vector58562567?: PrimitiveOverrideProps<IconProps>;
    Section58562568?: PrimitiveOverrideProps<FlexProps>;
    Label58562569?: PrimitiveOverrideProps<FlexProps>;
    label58562570?: PrimitiveOverrideProps<TextProps>;
    Vector58562571?: PrimitiveOverrideProps<IconProps>;
    Section58562575?: PrimitiveOverrideProps<FlexProps>;
    Label58562576?: PrimitiveOverrideProps<FlexProps>;
    label58562577?: PrimitiveOverrideProps<TextProps>;
    Vector58562578?: PrimitiveOverrideProps<IconProps>;
    Section58562582?: PrimitiveOverrideProps<FlexProps>;
    Label58562583?: PrimitiveOverrideProps<FlexProps>;
    label58562584?: PrimitiveOverrideProps<TextProps>;
    Vector58562585?: PrimitiveOverrideProps<IconProps>;
} & EscapeHatchProps;
export declare type DataFiltersProps = React.PropsWithChildren<Partial<FlexProps> & {
    overrides?: DataFiltersOverridesProps | undefined | null;
}>;
export default function DataFilters(props: DataFiltersProps): React.ReactElement;
