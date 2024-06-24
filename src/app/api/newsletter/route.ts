/* eslint-disable import/prefer-default-export */
// https://agirlcodes.medium.com/setup-a-newsletter-with-next-js-and-mailchimp-d9933cfd785e

import axios from 'axios';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Email validation schema
const EmailSchema = z
  .string()
  .email({ message: 'Please enter a valid email address' });

//Name validation schema
const NameSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
});

// Subscription handler function
export const POST = async (req: Request) => {
  // 1. Validate email address
  const { email, firstName, lastName } = await req.json();
  const emailValidation = EmailSchema.safeParse(email);
  const nameValidation = NameSchema.safeParse({ firstName, lastName });

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
    status: 'subscribed',
    merge_fields: {
      FNAME: nameValidation.success ? nameValidation.data.firstName : '',
      LNAME: nameValidation.success ? nameValidation.data.lastName : '',
    },
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
    if (response.status === 200) {
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
