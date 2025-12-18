
'use server';

import { Resend } from 'resend';

type PlaceOrderInput = {
    customerName: string;
    customerEmail: string;
    cartItems: {
        productName: string;
        quantity: number;
        price: number;
    }[];
    total: number;
};

function generateConfirmationHtml(orderId: string, orderData: PlaceOrderInput): { subject: string, body: string } {
    const subject = `Your Curated Finds Order Confirmation (#${orderId})`;

    const itemsHtml = orderData.cartItems.map(item => 
        `<tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}x ${item.productName}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
    ).join('');

    const body = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #eef2f9; color: #333;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #eef2f9;">
                <tr>
                    <td align="center" style="padding: 20px;">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                            <!-- Header -->
                            <tr>
                                <td align="center" style="padding: 20px; background-color: #2c3e50; color: #ffffff;">
                                    <h1 style="margin: 0; font-size: 24px;">Curated Finds</h1>
                                </td>
                            </tr>
                            <!-- Body -->
                            <tr>
                                <td style="padding: 30px 20px;">
                                    <h2 style="font-size: 20px; margin-top: 0;">Thank you for your order, ${orderData.customerName}!</h2>
                                    <p>We've received your order #${orderId} and are getting it ready for shipment. We'll notify you again once your order has shipped.</p>
                                    
                                    <h3 style="border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 30px; font-size: 18px;">Order Summary</h3>
                                    <table width="100%" cellspacing="0" cellpadding="0">
                                        ${itemsHtml}
                                        <!-- Total -->
                                        <tr>
                                            <td style="padding: 15px 10px 10px; font-weight: bold; font-size: 1.1em;">Total</td>
                                            <td style="padding: 15px 10px 10px; text-align: right; font-weight: bold; font-size: 1.1em;">$${orderData.total.toFixed(2)}</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <!-- Footer -->
                            <tr>
                                <td align="center" style="padding: 20px; background-color: #f7f7f7; font-size: 12px; color: #777;">
                                    <p>&copy; 2024 Curated Finds. All rights reserved.</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;

    return { subject, body };
}


export async function placeOrderAction(orderData: PlaceOrderInput) {
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const apiKey = process.env.RESEND_API_KEY;

    // Explicitly check if the API key is missing or empty.
    if (!apiKey) {
        console.error("Resend API key is not set in environment variables.");
        return { success: false, error: "The Resend API key is missing. Please add it to your .env file." };
    }

    if (!fromEmail) {
        console.error("Resend 'from' email is not set in environment variables.");
        return { success: false, error: "Server is not configured to send emails." };
    }
    
    const resend = new Resend(apiKey);
    
    // Simulate creating an order ID
    const orderId = `ORD${Math.floor(Math.random() * 90000) + 10000}`;

    try {
        // 1. Generate email content using a static template function
        const emailContent = generateConfirmationHtml(orderId, orderData);

        // 2. Send the email using Resend
        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: orderData.customerEmail,
            subject: emailContent.subject,
            html: emailContent.body,
        });

        if (error) {
            console.error('Resend error:', error);
            // Even if email fails, we might not want to fail the whole order.
            // For now, we will fail it to make it obvious.
            return { success: false, error: 'Failed to send confirmation email. Please check server logs.' };
        }

        console.log(`Order confirmation email sent successfully for order ${orderId}:`, data?.id);

        // In a real app, you would save the order to the database here.
        
        return { success: true, orderId: orderId };

    } catch (e) {
        const error = e as Error;
        console.error('Failed to place order:', error);
        return { success: false, error: error.message };
    }
}
