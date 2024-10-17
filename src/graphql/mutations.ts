/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const updateContactSubmission = /* GraphQL */ `mutation UpdateContactSubmission(
  $input: UpdateContactSubmissionInput!
  $condition: ModelContactSubmissionConditionInput
) {
  updateContactSubmission(input: $input, condition: $condition) {
    id
    firstName
    lastName
    email
    phoneNumber
    topic
    message
    subscribed
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateContactSubmissionMutationVariables,
  APITypes.UpdateContactSubmissionMutation
>;
export const deleteContactSubmission = /* GraphQL */ `mutation DeleteContactSubmission(
  $input: DeleteContactSubmissionInput!
  $condition: ModelContactSubmissionConditionInput
) {
  deleteContactSubmission(input: $input, condition: $condition) {
    id
    firstName
    lastName
    email
    phoneNumber
    topic
    message
    subscribed
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteContactSubmissionMutationVariables,
  APITypes.DeleteContactSubmissionMutation
>;
export const createContactSubmission = /* GraphQL */ `mutation CreateContactSubmission(
  $input: CreateContactSubmissionInput!
  $condition: ModelContactSubmissionConditionInput
) {
  createContactSubmission(input: $input, condition: $condition) {
    id
    firstName
    lastName
    email
    phoneNumber
    topic
    message
    subscribed
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateContactSubmissionMutationVariables,
  APITypes.CreateContactSubmissionMutation
>;
