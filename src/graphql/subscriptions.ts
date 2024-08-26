/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateContactSubmission = /* GraphQL */ `subscription OnCreateContactSubmission(
  $filter: ModelSubscriptionContactSubmissionFilterInput
) {
  onCreateContactSubmission(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateContactSubmissionSubscriptionVariables,
  APITypes.OnCreateContactSubmissionSubscription
>;
export const onUpdateContactSubmission = /* GraphQL */ `subscription OnUpdateContactSubmission(
  $filter: ModelSubscriptionContactSubmissionFilterInput
) {
  onUpdateContactSubmission(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateContactSubmissionSubscriptionVariables,
  APITypes.OnUpdateContactSubmissionSubscription
>;
export const onDeleteContactSubmission = /* GraphQL */ `subscription OnDeleteContactSubmission(
  $filter: ModelSubscriptionContactSubmissionFilterInput
) {
  onDeleteContactSubmission(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteContactSubmissionSubscriptionVariables,
  APITypes.OnDeleteContactSubmissionSubscription
>;
