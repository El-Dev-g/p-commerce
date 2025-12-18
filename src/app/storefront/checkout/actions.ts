
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
        `<li>${item.quantity}x ${item.productName} - $${(item.price * item.quantity).toFixed(2)}</li>`
    ).join('');

    const body = `
        <div style="font-family: sans-serif; line-height: 1.6;">
            <h1>Thank you for your order, ${orderData.customerName}!</h1>
            <p>We've received your order #${orderId} and are getting it ready for shipment.</p>
            <h2>Order Summary</h2>
            <ul>
                ${itemsHtml}
            </ul>
            <p style="font-size: 1.2em; font-weight: bold;">Total: $${orderData.total.toFixed(2)}</p>
            <p>We'll notify you again once your order has shipped. Thank you for shopping with Curated Finds!</p>
        </div>
    `;

    return { subject, body };
}


export async function placeOrderAction(orderData: PlaceOrderInput) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    
    // Simulate creating an order ID
    const orderId = `ORD${Math.floor(Math.random() * 90000) + 10000}`;

    if (!fromEmail || !process.env.RESEND_API_KEY) {
        console.error("Resend API key or 'from' email is not set in environment variables.");
        return { success: false, error: "Server is not configured to send emails." };
    }

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
