
'use server';

import { Resend } from 'resend';
import { z } from 'zod';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormInput = z.infer<typeof contactFormSchema>;

export async function sendContactMessageAction(input: ContactFormInput) {
  const validation = contactFormSchema.safeParse(input);

  if (!validation.success) {
    return { success: false, error: validation.error.format() };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const toEmail = process.env.RESEND_FROM_EMAIL; // Send to the store owner

  if (!toEmail) {
    console.error("RESEND_FROM_EMAIL is not set. Cannot send contact form email.");
    return { success: false, error: { _form: ["Server is not configured to receive emails."] } };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: toEmail, // Must be a verified domain
      to: toEmail,
      reply_to: input.email, // So you can reply directly to the user
      subject: `New Contact Form Message from ${input.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>You have received a new message from your website's contact form.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p><strong>Name:</strong> ${input.name}</p>
          <p><strong>Email:</strong> ${input.email}</p>
          <p><strong>Message:</strong></p>
          <p style="padding: 10px; border: 1px solid #ddd; border-radius: 4px;">${input.message}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p><small>You can reply to this email directly to respond to ${input.name}.</small></p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: { _form: ["Failed to send message. Please try again later."] } };
    }

    return { success: true, data };
  } catch (e) {
    const error = e as Error;
    console.error('Failed to send contact message:', error);
    return { success: false, error: { _form: [error.message] } };
  }
}
