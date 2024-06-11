/* eslint-disable */
/**
 * @type {import('aws-sdk/clients/ses').SendEmailCommand}
 */
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

const ses = new SESClient();

exports.handler = async (event) => {
  for (const record of event.Records) {
    if (record.eventName === 'INSERT') {
      const { firstName, lastName, email, topic, phoneNumber, message } =
        unmarshall(record.dynamodb.NewImage);

      try {
        const response = await ses.send(
          new SendEmailCommand({
            Destination: {
              ToAddresses: [process.env.SES_EMAIL],
            },
            Source: process.env.SES_EMAIL,
            Message: {
              Subject: {
                Data: `Contact Form Submission | ${topic}`,
              },
              Body: {
                Text: {
                  Data: `You have received a new message from ${firstName} ${lastName} ${phoneNumber}. (${email}): ${message}`,
                },
              },
            },
          })
        );
        // Check response from SES API
        if (response.$metadata.httpStatusCode === 200) {
          console.log('Email sent successfully');
          // Return success code or any other desired response
          return { status: 'success' };
        } else {
          console.error(
            'Failed to send email:',
            response.$metadata.httpStatusCode
          );
          // Return error code or any other desired response
          return { status: 'error' };
        }
      } catch (err) {
        console.error('Error sending email:', err);
        // Return error code or any other desired response
        return { status: 'error' };
      }
    }
  }
  return { status: 'done' };
};
