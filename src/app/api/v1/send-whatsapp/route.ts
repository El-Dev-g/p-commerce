import { NextResponse } from 'next/server';

// In a real-world scenario, you would integrate with a WhatsApp Business API
// provider (like Twilio, Vonage, etc.) here to send the message.
async function sendWhatsAppMessage(to: string, message: string) {
    console.log('--- Sending WhatsApp Message ---');
    console.log(`To: ${to}`);
    console.log(`Message: ${message}`);
    console.log('---------------------------------');
    // Here you would add the code to call your WhatsApp API provider.
    // For example:
    // await twilio.messages.create({ from: 'whatsapp:+14155238886', body: message, to: `whatsapp:${to}` });
    return { success: true, simulatedMessage: message };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, type } = body;

    let message;

    if (type === 'order_confirmation') {
      const { orderId, customerName } = body;
      message = `Hi ${customerName}, your order #${orderId} is confirmed! We'll notify you once it ships.`;
    } else if (type === 'shipping_update') {
      const { orderId, trackingNumber, carrier } = body;
      const carrierInfo = carrier ? ` with ${carrier}` : '';
      message = `Great news! Your order #${orderId} has shipped${carrierInfo}. You can track it using this number: ${trackingNumber}`;
    } else {
        return NextResponse.json({ message: 'Invalid message type' }, { status: 400 });
    }

    const result = await sendWhatsAppMessage(to, message);

    return NextResponse.json({ message: 'WhatsApp message sent successfully', simulatedMessage: result.simulatedMessage }, { status: 200 });

  } catch (error) {
    console.error('Failed to send WhatsApp message:', error);
    return NextResponse.json({ message: 'Error sending WhatsApp message', error: (error as Error).message }, { status: 500 });
  }
}
