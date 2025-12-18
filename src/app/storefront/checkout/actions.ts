
'use server';

import { Resend } from 'resend';
import {
  generateOrderConfirmationEmail,
  type GenerateOrderConfirmationEmailInput,
} from '@/ai/flows/generate-order-confirmation-email';

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

export async function placeOrderAction(orderData: PlaceOrderInput) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Simulate creating an order ID
    const orderId = `ORD${Math.floor(Math.random() * 90000) + 10000}`;

    try {
        // Prepare input for the AI flow
        const emailGenInput: GenerateOrderConfirmationEmailInput = {
            orderId: orderId,
            customerName: orderData.customerName,
            cartItems: orderData.cartItems,
            total: orderData.total,
        };

        // 1. Generate email content with AI
        const emailContent = await generateOrderConfirmationEmail(emailGenInput);

        // 2. Send the email using Resend
        const { data, error } = await resend.emails.send({
            // IMPORTANT: Replace this with your own verified domain in Resend.
            // To send to any email address, you must use a real domain you own.
            from: 'Curated Finds <store@your-verified-domain.com>',
            to: orderData.customerEmail,
            subject: emailContent.subject,
            html: emailContent.body,
        });

        if (error) {
            console.error('Resend error:', error);
            // Even if email fails, we might not want to fail the whole order.
            // For now, we will fail it to make it obvious.
            return { success: false, error: 'Failed to send confirmation email. Have you verified your domain with Resend?' };
        }

        console.log(`Order confirmation email sent successfully for order ${orderId}:`, data);

        // In a real app, you would save the order to the database here.
        
        return { success: true, orderId: orderId };

    } catch (e) {
        const error = e as Error;
        console.error('Failed to place order:', error);
        return { success: false, error: error.message };
    }
}
