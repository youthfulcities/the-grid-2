/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type ContactSubmissionCreateFormInputValues = {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    topic?: string;
    message?: string;
};
export declare type ContactSubmissionCreateFormValidationValues = {
    firstName?: ValidationFunction<string>;
    lastName?: ValidationFunction<string>;
    email?: ValidationFunction<string>;
    phoneNumber?: ValidationFunction<string>;
    topic?: ValidationFunction<string>;
    message?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ContactSubmissionCreateFormOverridesProps = {
    ContactSubmissionCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    firstName?: PrimitiveOverrideProps<TextFieldProps>;
    lastName?: PrimitiveOverrideProps<TextFieldProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
    phoneNumber?: PrimitiveOverrideProps<TextFieldProps>;
    topic?: PrimitiveOverrideProps<TextFieldProps>;
    message?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ContactSubmissionCreateFormProps = React.PropsWithChildren<{
    overrides?: ContactSubmissionCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ContactSubmissionCreateFormInputValues) => ContactSubmissionCreateFormInputValues;
    onSuccess?: (fields: ContactSubmissionCreateFormInputValues) => void;
    onError?: (fields: ContactSubmissionCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ContactSubmissionCreateFormInputValues) => ContactSubmissionCreateFormInputValues;
    onValidate?: ContactSubmissionCreateFormValidationValues;
} & React.CSSProperties>;
export default function ContactSubmissionCreateForm(props: ContactSubmissionCreateFormProps): React.ReactElement;
