import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === "465",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendLoginDetails = async (email, link) => {
  const message = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `
        <div style="font-family: sans-serif; max-width: 400px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2>Verify Credentials</h2>
          <p>Click the Link to change your password:</p>
           <h1 style="letter-spacing: 4px; background: #f4f4f4; padding: 10px; text-align: center; border-radius: 4px;">${email}</h1>
          <h1 style="letter-spacing: 4px; background: #f4f4f4; padding: 10px; text-align: center; border-radius: 4px;">${link}</h1>
          <p style="color: #666; font-size: 12px;">Please Change your password as soon as you Login.</p>
        </div>
      `,
  };

  try {
    const email = await transporter.sendMail(message);
    return email;
  } catch (error) {
    throw error;
  }
};
