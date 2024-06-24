// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { ContactSubmission } = initSchema(schema);

export {
  ContactSubmission
};