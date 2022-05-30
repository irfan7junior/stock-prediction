import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport(
  {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use TLS
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  },
  {
    from: process.env.EMAIL_ID,
  }
);

export default async function sendmail(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const email = req.query.email as string;
  const name = email.split('@')[0];

  await new Promise((resolve, reject) => {
    transport.verify((error: any, success: any) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log('Server is ready to take our messages');
        resolve(success);
      }
    });
  });

  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: email,
    subject: 'Registration Successful for Stock Prediction',
    text: `Hello ${name}, thank you for registering for Stock Prediction.
    Please visit ${process.env.WEBSITE_URL} for more stock predictions.
    `,
  };

  let responseText = '';
  await new Promise((resolve, reject) => {
    transport.sendMail(mailOptions, function (err: any, info: any) {
      if (err) {
        responseText = 'Email Not Set';
        reject(err);
      } else {
        responseText = 'Email Sent';
        resolve(info);
      }
    });
    res.status(200).json({ responseText });
  });
}
