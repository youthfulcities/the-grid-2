/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateContactSubmissionInput = {
  id?: string | null,
  firstName?: string | null,
  lastName?: string | null,
  email?: string | null,
  phoneNumber?: string | null,
  topic?: string | null,
  message?: string | null,
};

export type ModelContactSubmissionConditionInput = {
  firstName?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  email?: ModelStringInput | null,
  phoneNumber?: ModelStringInput | null,
  topic?: ModelStringInput | null,
  message?: ModelStringInput | null,
  and?: Array< ModelContactSubmissionConditionInput | null > | null,
  or?: Array< ModelContactSubmissionConditionInput | null > | null,
  not?: ModelContactSubmissionConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ContactSubmission = {
  __typename: "ContactSubmission",
  id: string,
  firstName?: string | null,
  lastName?: string | null,
  email?: string | null,
  phoneNumber?: string | null,
  topic?: string | null,
  message?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateContactSubmissionInput = {
  id: string,
  firstName?: string | null,
  lastName?: string | null,
  email?: string | null,
  phoneNumber?: string | null,
  topic?: string | null,
  message?: string | null,
};

export type DeleteContactSubmissionInput = {
  id: string,
};

export type ModelContactSubmissionFilterInput = {
  id?: ModelIDInput | null,
  firstName?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  email?: ModelStringInput | null,
  phoneNumber?: ModelStringInput | null,
  topic?: ModelStringInput | null,
  message?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelContactSubmissionFilterInput | null > | null,
  or?: Array< ModelContactSubmissionFilterInput | null > | null,
  not?: ModelContactSubmissionFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelContactSubmissionConnection = {
  __typename: "ModelContactSubmissionConnection",
  items:  Array<ContactSubmission | null >,
  nextToken?: string | null,
};

export type ModelSubscriptionContactSubmissionFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  firstName?: ModelSubscriptionStringInput | null,
  lastName?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  phoneNumber?: ModelSubscriptionStringInput | null,
  topic?: ModelSubscriptionStringInput | null,
  message?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionContactSubmissionFilterInput | null > | null,
  or?: Array< ModelSubscriptionContactSubmissionFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type CreateContactSubmissionMutationVariables = {
  input: CreateContactSubmissionInput,
  condition?: ModelContactSubmissionConditionInput | null,
};

export type CreateContactSubmissionMutation = {
  createContactSubmission?:  {
    __typename: "ContactSubmission",
    id: string,
    firstName?: string | null,
    lastName?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
    topic?: string | null,
    message?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateContactSubmissionMutationVariables = {
  input: UpdateContactSubmissionInput,
  condition?: ModelContactSubmissionConditionInput | null,
};

export type UpdateContactSubmissionMutation = {
  updateContactSubmission?:  {
    __typename: "ContactSubmission",
    id: string,
    firstName?: string | null,
    lastName?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
    topic?: string | null,
    message?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteContactSubmissionMutationVariables = {
  input: DeleteContactSubmissionInput,
  condition?: ModelContactSubmissionConditionInput | null,
};

export type DeleteContactSubmissionMutation = {
  deleteContactSubmission?:  {
    __typename: "ContactSubmission",
    id: string,
    firstName?: string | null,
    lastName?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
    topic?: string | null,
    message?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetContactSubmissionQueryVariables = {
  id: string,
};

export type GetContactSubmissionQuery = {
  getContactSubmission?:  {
    __typename: "ContactSubmission",
    id: string,
    firstName?: string | null,
    lastName?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
    topic?: string | null,
    message?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListContactSubmissionsQueryVariables = {
  filter?: ModelContactSubmissionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListContactSubmissionsQuery = {
  listContactSubmissions?:  {
    __typename: "ModelContactSubmissionConnection",
    items:  Array< {
      __typename: "ContactSubmission",
      id: string,
      firstName?: string | null,
      lastName?: string | null,
      email?: string | null,
      phoneNumber?: string | null,
      topic?: string | null,
      message?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateContactSubmissionSubscriptionVariables = {
  filter?: ModelSubscriptionContactSubmissionFilterInput | null,
};

export type OnCreateContactSubmissionSubscription = {
  onCreateContactSubmission?:  {
    __typename: "ContactSubmission",
    id: string,
    firstName?: string | null,
    lastName?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
    topic?: string | null,
    message?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateContactSubmissionSubscriptionVariables = {
  filter?: ModelSubscriptionContactSubmissionFilterInput | null,
};

export type OnUpdateContactSubmissionSubscription = {
  onUpdateContactSubmission?:  {
    __typename: "ContactSubmission",
    id: string,
    firstName?: string | null,
    lastName?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
    topic?: string | null,
    message?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteContactSubmissionSubscriptionVariables = {
  filter?: ModelSubscriptionContactSubmissionFilterInput | null,
};

export type OnDeleteContactSubmissionSubscription = {
  onDeleteContactSubmission?:  {
    __typename: "ContactSubmission",
    id: string,
    firstName?: string | null,
    lastName?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
    topic?: string | null,
    message?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};