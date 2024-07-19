import { Resend } from "resend";
require("dotenv").config();

import {
  verificationEmailTemplate,
  updatedProfileEmailTemplate,
  forgotPasswordEmailTemplate,
  inviteNewUserTemplate,
  inviteExistingUserTemplate,
} from "./templates";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (emailData: any) => {
  const verificationResponse = await resend.emails.send({
    from: `NovaCRM <${process.env.RESEND_SENDER_EMAIL}>`,
    to: emailData.email,
    subject: "Verify Your Account",
    html: verificationEmailTemplate(emailData),
  });

  if (!verificationResponse.data) {
    return { status: 403, message: verificationResponse.error };
  } else {
    return {
      status: 200,
      message: "Verification email sent successfully",
    };
  }
};

const sendUpdatedProfileEmail = async (emailData: any) => {
  const updatedResponse = await resend.emails.send({
    from: `NovaCRM <${process.env.RESEND_SENDER_EMAIL}>`,
    to: emailData.email,
    subject: "Your Profile Has Been Updated",
    html: updatedProfileEmailTemplate(emailData),
  });

  if (!updatedResponse.data) {
    return { status: 403, message: updatedResponse.error };
  } else {
    return {
      status: 200,
      message: "Email sent!",
    };
  }
};

const sendForgotPasswordEmail = async (emailData: any) => {
  const forgotPasswordResponse = await resend.emails.send({
    from: `NovaCRM <${process.env.RESEND_SENDER_EMAIL}>`,
    to: emailData.email,
    subject: "Reset Your Password",
    html: forgotPasswordEmailTemplate(emailData),
  });

  if (!forgotPasswordResponse.data) {
    return { status: 400 };
  } else {
    return {
      status: 200,
    };
  }
};

const sendInviteEmail = async (emailData: any) => {
  const inviteResponse = await resend.emails.send({
    from: `NovaCRM <${process.env.RESEND_SENDER_EMAIL}>`,
    to: emailData.email,
    subject: "You're Invited to Join NovaCRM",
    html: inviteNewUserTemplate(emailData),
  });

  if (!inviteResponse.data) {
    return { status: 400, message: inviteResponse.error };
  } else {
    return {
      status: 200,
      message: "Email Sent!",
    };
  }
};

const sendInviteEmailToExistingUser = async (emailData: any) => {
  const inviteResponse = await resend.emails.send({
    from: `NovaCRM <${process.env.RESEND_SENDER_EMAIL}>`,
    to: emailData.email,
    subject: "You're Invited to Join NovaCRM",
    html: inviteExistingUserTemplate(emailData),
  });

  if (!inviteResponse.data) {
    return { status: 400, message: inviteResponse.error };
  } else {
    return {
      status: 200,
      message: "Email Sent!",
    };
  }
};

export default {
  sendVerificationEmail,
  sendForgotPasswordEmail,
  sendInviteEmail,
  sendUpdatedProfileEmail,
  sendInviteEmailToExistingUser,
};
