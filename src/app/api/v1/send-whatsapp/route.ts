import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { to, orderId, customerName } = await request.json();

    // In a real-world scenario, you would integrate with a WhatsApp Business API
    // provider (like Twilio, Vonage, etc.) here to send the message.
    
    console.log('--- WhatsApp confirmation request received ---');
    console.log(`Sending confirmation to: ${to}`);
    console.log(`Customer: ${customerName}, Order ID: ${orderId}`);
    console.log('Message: Your order has been confirmed!');
    console.log('-------------------------------------------');
    
    // Simulate sending a message
    const message = `Hi ${customerName}, your order #${orderId} is confirmed! We'll notify you once it ships.`;
    
    // Return a success response
    return NextResponse.json({ message: 'WhatsApp confirmation sent successfully', simulatedMessage: message }, { status: 200 });

  } catch (error) {
    console.error('Failed to send WhatsApp confirmation:', error);
    // Return an error response
    return NextResponse.json({ message: 'Error sending WhatsApp confirmation', error: (error as Error).message }, { status: 500 });
  }
}
