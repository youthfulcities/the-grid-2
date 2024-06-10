/* eslint-disable import/prefer-default-export */

import * as AWS from 'aws-sdk';
import { NextRequest, NextResponse } from 'next/server';

const ssm = new AWS.SSM();

const response = await ssm
  .getParameters({
    Names: ['EMAIL_AWS_ACCESS_KEY_ID', 'EMAIL_AWS_SECRET_ACCESS_KEY'],
    WithDecryption: true,
  })
  .promise();

const { Parameters } = response;

if (!Parameters) {
  throw new Error('Failed to retrieve parameters from AWS SSM.');
}

const ses = new AWS.SES({
  accessKeyId: Parameters.find(
    (param) => param.Name === 'EMAIL_AWS_ACCESS_KEY_ID'
  )?.Value,
  secretAccessKey: Parameters.find(
    (param) => param.Name === 'EMAIL_AWS_SECRET_ACCESS_KEY'
  )?.Value,
  region: 'ca-central-1',
});

console.log(
  Parameters.find((param) => param.Name === 'EMAIL_AWS_ACCESS_KEY_ID')?.Value
);
console.log(
  Parameters.find((param) => param.Name === 'EMAIL_AWS_SECRET_ACCESS_KEY')
    ?.Value
);

export async function POST(req: NextRequest) {
  const { email, firstName, lastName, message } = await req.json();

  // Validate the input
  if (!email || !firstName || !lastName || !message) {
    return NextResponse.json(
      { error: 'All fields are required.' },
      { status: 400 }
    );
  }

  const params = {
    Source: 'info@youthfulcities.com',
    Destination: {
      ToAddresses: ['info@youthfulcities.com'],
    },
    Message: {
      Subject: {
        Data: 'Contact Form Submission',
      },
      Body: {
        Text: {
          Data: `You have received a new message from ${firstName} ${lastName} (${email}): ${message}`,
        },
      },
    },
  };

  try {
    await ses.sendEmail(params).promise();
    return NextResponse.json(
      { success: 'Email sent successfully.' },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Error sending email:', err);
    return NextResponse.json(
      { error: `Email could not be sent: ${err.message}` },
      { status: 500 }
    );
  }
}
