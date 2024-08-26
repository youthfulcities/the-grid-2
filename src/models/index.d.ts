import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";





type EagerContactSubmission = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ContactSubmission, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly email?: string | null;
  readonly phoneNumber?: string | null;
  readonly topic?: string | null;
  readonly message?: string | null;
  readonly subscribed?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyContactSubmission = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ContactSubmission, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly email?: string | null;
  readonly phoneNumber?: string | null;
  readonly topic?: string | null;
  readonly message?: string | null;
  readonly subscribed?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ContactSubmission = LazyLoading extends LazyLoadingDisabled ? EagerContactSubmission : LazyContactSubmission

export declare const ContactSubmission: (new (init: ModelInit<ContactSubmission>) => ContactSubmission) & {
  copyOf(source: ContactSubmission, mutator: (draft: MutableModel<ContactSubmission>) => MutableModel<ContactSubmission> | void): ContactSubmission;
}