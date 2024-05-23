import type { NextApiRequest, NextApiResponse } from 'next';
import AWS from 'aws-sdk';

const ses = new AWS.SES({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1'
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, firstName, lastName, message } = req.body;
        const params = {
            Source: 'email@example.com',
            Destination: {
                ToAddresses: ['email@example.com']
            },
            Message: {
                Subject: {
                    Data: 'Contact Form Submission'
                },
                Body: {
                    Text: {
                        Data: `You have received a new message from ${firstName} ${lastName} (${email}): ${message}`
                    }
                }
            }
        };

        ses.sendEmail(params, (err, data) => {
            if (err) {
                console.log(err, err.stack);
                res.status(500).json({ error: 'Email could not be sent.' });
            } else {
                console.log(data);
                res.status(200).json({ success: 'Email sent successfully.' });
            }
        });
    } else {
        res.status(405).end();
    }
}