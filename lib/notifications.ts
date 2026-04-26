// bid-build-platform/lib/notifications.ts

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;

export const resend = new Resend(RESEND_API_KEY);

// Send a basic email
export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const response = await resend.emails.send({
      from: "Bid-Build <no-reply@bid-build.co.uk>",
      to,
      subject,
      html,
    });

    return response;
  } catch (error) {
    console.error("Email sending failed:", error);
    return null;
  }
}

// Prebuilt template: welcome email
export async function sendWelcomeEmail(to: string, name: string) {
  const html = `
    <h2>Welcome to Bid-Build, ${name}!</h2>
    <p>Your account has been created successfully.</p>
    <p>You can now post jobs, receive bids, and manage your projects.</p>
  `;

  return sendEmail(to, "Welcome to Bid-Build!", html);
}

// Prebuilt template: password reset
export async function sendPasswordResetEmail(to: string, resetLink: string) {
  const html = `
    <h2>Password Reset Request</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">${resetLink}</a>
  `;

  return sendEmail(to, "Reset Your Password", html);
}

