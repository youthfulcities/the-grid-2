/* eslint-disable import/prefer-default-export */

import AWS from 'aws-sdk';
import { NextRequest, NextResponse } from 'next/server';

const ses = new AWS.SES({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'ca-central-1',
});

if (process.env.AWS_ACCESS_KEY_ID === undefined) {
  console.log('AWS_ACCESS_KEY_ID is undefined');
}

if (process.env.AWS_SECRET_ACCESS_KEY === undefined) {
  console.log('AWS_SECRET_ACCESS_KEY is undefined');
}

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
