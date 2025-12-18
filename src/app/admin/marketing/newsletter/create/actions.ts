
'use server';

import { Resend } from 'resend';

// Mock subscribers list. In a real app, you'd fetch this from your database.
const subscribers = [
    { email: 'liam@example.com', name: 'Liam Johnson' },
    { email: 'olivia@example.com', name: 'Olivia Smith' },
    { email: 'noah@example.com', name: 'Noah Williams' },
];

export async function sendNewsletterAction(content: { subject: string; body: string }) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const { subject, body } = content;

    if (!fromEmail) {
        console.error("RESEND_FROM_EMAIL is not set in environment variables.");
        return { success: false, error: "Server is not configured to send emails." };
    }

    // Use a Bcc to send to all subscribers without revealing their emails to each other
    const bccEmails = subscribers.map(s => s.email);

    try {
        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: fromEmail, // Resend requires a 'to' address, sending to self is a common practice for BCC newsletters
            bcc: bccEmails,
            subject: subject,
            html: body, // Resend expects HTML, but Markdown often renders fine in email clients.
                        // For production, you'd convert Markdown to HTML.
        });

        if (error) {
            console.error('Resend error:', error);
            return { success: false, error: `Failed to send email. Have you verified your domain with Resend and set up your API key? Error: ${error.message}` };
        }

        console.log('Resend success:', data);
        return { success: true, data };

    } catch (e) {
        const error = e as Error;
        console.error('Failed to send newsletter:', error);
        return { success: false, error: error.message };
    }
}
