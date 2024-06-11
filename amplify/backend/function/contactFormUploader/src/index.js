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
        await ses.send(
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
      } catch (err) {
        console.error(err);
      }
    }
  }
  return { status: 'done' };
};
