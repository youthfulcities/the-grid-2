/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { ContactSubmission } from "../models";
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
export declare type ContactSubmissionUpdateFormInputValues = {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    topic?: string;
    message?: string;
    subscribed?: boolean;
};
export declare type ContactSubmissionUpdateFormValidationValues = {
    firstName?: ValidationFunction<string>;
    lastName?: ValidationFunction<string>;
    email?: ValidationFunction<string>;
    phoneNumber?: ValidationFunction<string>;
    topic?: ValidationFunction<string>;
    message?: ValidationFunction<string>;
    subscribed?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ContactSubmissionUpdateFormOverridesProps = {
    ContactSubmissionUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    firstName?: PrimitiveOverrideProps<TextFieldProps>;
    lastName?: PrimitiveOverrideProps<TextFieldProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
    phoneNumber?: PrimitiveOverrideProps<TextFieldProps>;
    topic?: PrimitiveOverrideProps<TextFieldProps>;
    message?: PrimitiveOverrideProps<TextFieldProps>;
    subscribed?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type ContactSubmissionUpdateFormProps = React.PropsWithChildren<{
    overrides?: ContactSubmissionUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    contactSubmission?: ContactSubmission;
    onSubmit?: (fields: ContactSubmissionUpdateFormInputValues) => ContactSubmissionUpdateFormInputValues;
    onSuccess?: (fields: ContactSubmissionUpdateFormInputValues) => void;
    onError?: (fields: ContactSubmissionUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ContactSubmissionUpdateFormInputValues) => ContactSubmissionUpdateFormInputValues;
    onValidate?: ContactSubmissionUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ContactSubmissionUpdateForm(props: ContactSubmissionUpdateFormProps): React.ReactElement;
