/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getContactSubmission = /* GraphQL */ `query GetContactSubmission($id: ID!) {
  getContactSubmission(id: $id) {
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
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetContactSubmissionQueryVariables,
  APITypes.GetContactSubmissionQuery
>;
export const listContactSubmissions = /* GraphQL */ `query ListContactSubmissions(
  $filter: ModelContactSubmissionFilterInput
  $limit: Int
  $nextToken: String
) {
  listContactSubmissions(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListContactSubmissionsQueryVariables,
  APITypes.ListContactSubmissionsQuery
>;
export const syncContactSubmissions = /* GraphQL */ `query SyncContactSubmissions(
  $filter: ModelContactSubmissionFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncContactSubmissions(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
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
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncContactSubmissionsQueryVariables,
  APITypes.SyncContactSubmissionsQuery
>;
