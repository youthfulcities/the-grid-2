/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { IconProps } from "@aws-amplify/ui-react";
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
export declare type MyIconOverridesProps = {
    MyIcon?: PrimitiveOverrideProps<IconProps>;
} & EscapeHatchProps;
export declare type MyIconProps = React.PropsWithChildren<Partial<IconProps> & {
    type?: "alert" | "analyse" | "arrow-right" | "authentication" | "bookmark_border" | "chat" | "chat-bubble-outline" | "checkmark" | "close" | "content" | "dashboard" | "data" | "delete" | "download" | "edit" | "email" | "facebook" | "favorite" | "favorite_border" | "file" | "function" | "group" | "home" | "info" | "instagram" | "linkedin" | "location" | "map" | "methodology" | "more_horiz" | "more_vert" | "notification" | "phone" | "plus" | "reply" | "send" | "settings" | "share" | "shopping_bag" | "shuffle" | "storage" | "table" | "twitter (x)" | "warning";
} & {
    overrides?: MyIconOverridesProps | undefined | null;
}>;
export default function MyIcon(props: MyIconProps): React.ReactElement;
