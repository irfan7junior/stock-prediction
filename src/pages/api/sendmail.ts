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

const sendRegistrationMail = async (user: any) => {
  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: user.email,
    subject: 'Registration Successful for Stock Prediction',
    text: `Hello ${user.name}, thank you for registering for Stock Prediction.
    Please visit ${process.env.WEBSITE_URL} for more stock predictions.
    `,
  };

  return new Promise((resolve, reject) => {
    transport.sendMail(mailOptions, function (err: any, info: any) {
      if (err) reject(err);
      else resolve(info);
    });
  });
};

export default async function sendmail(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

  const email = req.query.email as string;
  const name = email.split('@')[0];

  try {
    await sendRegistrationMail({ email, name });
    res.status(200).json({});
  } catch (error) {
    res.status(500).json({ error: true });
  }
}
