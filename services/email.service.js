import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER_NAME, // Your email address
    pass: process.env.APP_PASSWORD // Your app password
  }
});
