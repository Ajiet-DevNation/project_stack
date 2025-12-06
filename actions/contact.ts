"use server";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { resend } from "@/lib/resend";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 d"),
  analytics: true,
  prefix: "@upstash/ratelimit/contact",
});

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  identifier?: string;
}

export async function sendContactEmail(data: ContactFormData) {
  try {
    if (!data.name || data.name.length < 2) {
      return { success: false, message: "Name must be at least 2 characters." };
    }

    if (!data.email || !data.email.includes("@")) {
      return { success: false, message: "Invalid email address." };
    }

    if (!data.subject || data.subject.length < 3) {
      return { success: false, message: "Subject must be at least 3 characters." };
    }

    if (!data.message || data.message.length < 10) {
      return { success: false, message: "Message must be at least 10 characters." };
    }

    const identifier = data.identifier || data.email;
    const { success: ok, reset } = await ratelimit.limit(identifier);

    if (!ok) {
      const hoursUntilReset = Math.ceil((reset - Date.now()) / (1000 * 60 * 60));

      return {
        success: false,
        rateLimited: true,
        message: `Rate limit exceeded. Try again after ${hoursUntilReset} hour(s).`,
      };
    }
  
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      margin: 0;
      padding: 40px 20px;
      background-color: #ffffff;
      color: #1a1a1a;
    }
    .email-container {
      max-width: 560px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      border-bottom: 2px solid #1a1a1a;
      padding-bottom: 20px;
      margin-bottom: 40px;
    }
    .logo {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 8px 0;
      letter-spacing: -0.3px;
    }
    .header-subtitle {
      font-size: 14px;
      color: #666666;
      margin: 0;
      font-weight: 400;
    }
    .section {
      margin-bottom: 32px;
    }
    .section-title {
      font-size: 11px;
      font-weight: 600;
      color: #999999;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0 0 12px 0;
    }
    .section-content {
      font-size: 15px;
      color: #1a1a1a;
      line-height: 1.6;
      margin: 0;
    }
    .message-content {
      font-size: 15px;
      color: #1a1a1a;
      line-height: 1.7;
      margin: 0;
      padding: 24px;
      background-color: #fafafa;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      white-space: pre-line;
    }
    .divider {
      height: 1px;
      background-color: #e5e5e5;
      margin: 32px 0;
      border: none;
    }
    .footer {
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid #e5e5e5;
      text-align: center;
    }
    .footer-text {
      font-size: 12px;
      color: #999999;
      margin: 0;
      line-height: 1.5;
    }
    .timestamp {
      font-size: 12px;
      color: #999999;
      margin-top: 8px;
    }
    @media (max-width: 600px) {
      body { padding: 20px 15px; }
      .message-content { padding: 20px; }
      .section { margin-bottom: 28px; }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="logo">Project Stack</h1>
      <p class="header-subtitle">New contact form submission</p>
    </div>

    <div class="section">
      <h2 class="section-title">Contact Details</h2>
      <p class="section-content"><strong>${data.name}</strong></p>
      <p class="section-content">${data.email}</p>
    </div>

    <hr class="divider" />

    <div class="section">
      <h2 class="section-title">Subject</h2>
      <p class="section-content">${data.subject}</p>
    </div>

    <div class="section">
      <h2 class="section-title">Message</h2>
      <div class="message-content">${data.message.replace(/\n/g, "<br>")}</div>
    </div>

    <div class="footer">
      <p class="footer-text">This message was sent from your website contact form</p>
      <p class="timestamp">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
  </div>
</body>
</html>
`;


    await resend.emails.send({
      from: "onboarding@resend.dev", 
      to: process.env.CONTACT_EMAIL_0 ?? "your-email@example.com",
      subject: `Contact Form: ${data.subject}`,
      html,
      text: `
New Contact Submission
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}
`,
    });
    await resend.emails.send({
      from: "onboarding@resend.dev", 
      to: process.env.CONTACT_EMAIL_1 ?? "your-email@example.com",
      subject: `Contact Form: ${data.subject}`,
      html,
      text: `
New Contact Submission
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}
`,
    });

    return {
      success: true,
      message: "Message sent successfully!",
    };
  } catch (err) {
    console.error("Contact form error:", err);
    return {
      success: false,
      message: "Something went wrong. Try again later.",
    };
  }
}
