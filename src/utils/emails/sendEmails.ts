import nodemailer from "nodemailer";
require("dotenv").config();

import {
  verificationEmailTemplate,
  updatedProfileEmailTemplate,
  forgotPasswordEmailTemplate,
  inviteNewUserTemplate,
  inviteExistingUserTemplate,
} from "./email templates";

// Create a Nodemailer transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT!, 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (emailOptions: any) => {
  try {
    let info = await transporter.sendMail(emailOptions);
    return {
      status: 200,
      message: "Email sent successfully!",
      info,
    };
  } catch (error: any) {
    return {
      status: 500,
      message: `Failed to send email: ${error.message}`,
    };
  }
};

const sendVerificationEmail = async (emailData: any) => {
  const emailOptions = {
    from: `CashFusion <${process.env.SMTP_FROM_EMAIL}>`,
    to: emailData.email,
    subject: "Verify Your Account",
    html: verificationEmailTemplate(emailData),
  };
  return sendEmail(emailOptions);
};

const sendUpdatedProfileEmail = async (emailData: any) => {
  const emailOptions = {
    from: `CashFusion <${process.env.SMTP_FROM_EMAIL}>`,
    to: emailData.email,
    subject: "Your Profile Has Been Updated",
    html: updatedProfileEmailTemplate(emailData),
  };
  return sendEmail(emailOptions);
};

const sendForgotPasswordEmail = async (emailData: any) => {
  const emailOptions = {
    from: `CashFusion <${process.env.SMTP_FROM_EMAIL}>`,
    to: emailData.email,
    subject: "Reset Your Password",
    html: forgotPasswordEmailTemplate(emailData),
  };
  return sendEmail(emailOptions);
};

const sendInviteEmail = async (emailData: any) => {
  const emailOptions = {
    from: `CashFusion <${process.env.SMTP_FROM_EMAIL}>`,
    to: emailData.email,
    subject: "You're Invited to Join CashFusion",
    html: inviteNewUserTemplate(emailData),
  };
  return sendEmail(emailOptions);
};

const sendInviteEmailToExistingUser = async (emailData: any) => {
  const emailOptions = {
    from: `CashFusion <${process.env.SMTP_FROM_EMAIL}>`,
    to: emailData.email,
    subject: "You're Invited to Join CashFusion",
    html: inviteExistingUserTemplate(emailData),
  };
  return sendEmail(emailOptions);
};

export default {
  sendVerificationEmail,
  sendForgotPasswordEmail,
  sendInviteEmail,
  sendUpdatedProfileEmail,
  sendInviteEmailToExistingUser,
};
