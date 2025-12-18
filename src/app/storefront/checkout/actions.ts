
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
            <td style="padding-bottom:8px;">${item.quantity}× ${item.productName}</td>
            <td align="right" style="padding-bottom:8px;">$${(item.price * item.quantity).toFixed(2)}</td>
          </tr>`
    ).join('');

    const body = `
        <div style="font-family: Arial, Helvetica, sans-serif; background-color:#f6f7f9; padding:24px;">
          <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden;">
        
            <!-- Header -->
            <div style="background:#111827; color:#ffffff; padding:24px; text-align:center;">
              <h1 style="margin:0; font-size:22px; font-weight:600;">
                Thank you for your order!
              </h1>
              <p style="margin:8px 0 0; font-size:14px; opacity:0.9;">
                Order #${orderId}
              </p>
            </div>
        
            <!-- Body -->
            <div style="padding:24px; color:#374151;">
        
              <p style="font-size:15px; margin:0 0 16px;">
                Hi <strong>${orderData.customerName}</strong>,
              </p>
        
              <p style="font-size:15px; margin:0 0 24px;">
                We’ve received your order and are currently preparing it for shipment.
                You’ll get another email once it’s on the way.
              </p>
        
              <!-- Order Summary -->
              <h2 style="font-size:16px; margin-bottom:12px; color:#111827;">
                Order Summary
              </h2>
        
              <div style="border:1px solid #e5e7eb; border-radius:6px; padding:16px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                  ${itemsHtml}
                  <tr>
                    <td colspan="2" style="border-top:1px solid #e5e7eb; padding-top:12px;"></td>
                  </tr>
                  <tr>
                    <td style="font-weight:600; padding-top:8px;">Total</td>
                    <td align="right" style="font-weight:600; padding-top:8px;">
                      $${orderData.total.toFixed(2)}
                    </td>
                  </tr>
                </table>
              </div>
        
              <!-- Footer Message -->
              <p style="font-size:14px; margin:24px 0 0; color:#6b7280;">
                Thank you for shopping with <strong>Curated Finds</strong>.  
                If you have any questions, just reply to this email—we’re happy to help.
              </p>
        
            </div>
        
            <!-- Footer -->
            <div style="background:#f9fafb; text-align:center; padding:16px; font-size:12px; color:#9ca3af;">
              © Curated Finds — All rights reserved
            </div>
        
          </div>
        </div>
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
