/* eslint-disable import/prefer-default-export */
// https://agirlcodes.medium.com/setup-a-newsletter-with-next-js-and-mailchimp-d9933cfd785e

import axios from 'axios';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Email validation schema
const EmailSchema = z
  .string()
  .email({ message: 'Please enter a valid email address' });

// Phone number validation schema
const PhoneSchema = z.string().optional();

// Name validation schema
const NameSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
});

// Language validation schema
const LanguageSchema = z.string().optional();

// Subscription handler function
export const POST = async (req: Request) => {
  // 1. Validate email address
  const { email, firstName, lastName, phone, lng } = await req.json();
  const emailValidation = EmailSchema.safeParse(email);
  const nameValidation = NameSchema.safeParse({ firstName, lastName });
  const phoneValidation = PhoneSchema.safeParse(phone);
  const languageValidation = LanguageSchema.safeParse(lng);

  if (!emailValidation.success) {
    return NextResponse.json(
      {
        error: 'invalid',
      },
      { status: 400 }
    );
  }

  // 2. Retrieve Mailchimp credentials from environment variables
  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const API_SERVER = process.env.MAILCHIMP_API_SERVER;
  const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;

  // 3. Construct Mailchimp API request URL
  const url = `https://${API_SERVER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;

  // 4. Prepare request
  const data = {
    email_address: emailValidation.data,
    status: 'pending',
    merge_fields: {
      FNAME: nameValidation.success ? nameValidation.data.firstName : '',
      LNAME: nameValidation.success ? nameValidation.data.lastName : '',
      PHONE: phoneValidation.success ? phoneValidation.data : '',
    },
    language: languageValidation.success ? languageValidation.data : '',
  };

  // 5. Set request headers
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `api_key ${API_KEY}`,
    },
  };

  // 6. Send POST request to Mailchimp API
  try {
    const response = await axios.post(url, data, options);
    console.log(response);
    if (response.status === 200 || response.status === 201) {
      // 7. Add tag to the subscribed member
      const subscriberHash = md5(emailValidation.data.toLowerCase()); // Mailchimp requires a lowercase MD5 hash of the email address
      const tagUrl = `https://${API_SERVER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members/${subscriberHash}/tags`;
      const tagData = {
        tags: [{ name: 'Youth Data Lab', status: 'active' }],
      };
      await axios.post(tagUrl, tagData, options);

      return NextResponse.json({ message: 'success' }, { status: 201 });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `${error.response?.status}`,
        `${error.response?.data.title}`,
        `${error.response?.data.detail}`
      );

      if (error.response?.data.title === 'Member Exists') {
        // 8. Check the subscription status of the existing member
        const subscriberHash = md5(emailValidation.data.toLowerCase()); // Mailchimp requires a lowercase MD5 hash of the email address
        const memberUrl = `https://${API_SERVER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members/${subscriberHash}`;

        try {
          const memberResponse = await axios.get(memberUrl, options);
          const memberStatus = memberResponse.data.status;

          if (memberStatus !== 'subscribed') {
            // 9. Update the subscription status of the existing member
            const updateData = {
              status: 'pending',
              merge_fields: {
                FNAME: nameValidation.success
                  ? nameValidation.data.firstName
                  : '',
                LNAME: nameValidation.success
                  ? nameValidation.data.lastName
                  : '',
                PHONE: phoneValidation.success ? phoneValidation.data : '',
              },
              language: languageValidation.success
                ? languageValidation.data
                : '',
            };

            await axios.put(memberUrl, updateData, options);

            // 10. Add tag to the updated member
            const tagUrl = `https://${API_SERVER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members/${subscriberHash}/tags`;
            const tagData = {
              tags: [{ name: 'Youth Data Lab', status: 'active' }],
            };
            await axios.post(tagUrl, tagData, options);

            return NextResponse.json({ message: 'success' }, { status: 200 });
          }

          if (memberStatus === 'subscribed') {
            // Update the info of the existing member
            const updateData = {
              merge_fields: {
                FNAME: nameValidation.success
                  ? nameValidation.data.firstName
                  : '',
                LNAME: nameValidation.success
                  ? nameValidation.data.lastName
                  : '',
                PHONE: phoneValidation.success ? phoneValidation.data : '',
              },
              language: languageValidation.success
                ? languageValidation.data
                : '',
            };

            await axios.put(memberUrl, updateData, options);

            // 10. Add tag to the updated member
            const tagUrl = `https://${API_SERVER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members/${subscriberHash}/tags`;
            const tagData = {
              tags: [{ name: 'Youth Data Lab', status: 'active' }],
            };
            await axios.post(tagUrl, tagData, options);

            return NextResponse.json({ message: 'success' }, { status: 200 });
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error(
              `${error.response?.status}`,
              `${error.response?.data.title}`,
              `${error.response?.data.detail}`,
              `${JSON.stringify(error.response?.data.errors)}`
            );
          }
        }
        return NextResponse.json(
          {
            error: 'duplicate',
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        error: 'error',
      },
      { status: 500 }
    );
  }
};

function md5(string: string) {
  return crypto.createHash('md5').update(string).digest('hex');
}
