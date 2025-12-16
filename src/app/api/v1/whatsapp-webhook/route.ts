import { NextResponse } from 'next/server';
import { whatsAppChat } from '@/ai/flows/whatsapp-chat-flow';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

/**
 * Handles the verification request from WhatsApp.
 * This is a one-time setup step.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Check if a token and mode is in the query string of the request
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    // Responds with the challenge token from the request
    console.log('WhatsApp Webhook Verified');
    return new NextResponse(challenge, { status: 200 });
  } else {
    // Responds with '403 Forbidden' if verify tokens do not match
    return new NextResponse(null, { status: 403 });
  }
}

/**
 * Handles incoming messages from WhatsApp users.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check the Incoming webhook message
    console.log(JSON.stringify(body, null, 2));

    // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (message?.type === 'text') {
      const from = message.from; // User's WhatsApp ID
      const msg_body = message.text.body; // The actual message text

      console.log(`Message from ${from}: ${msg_body}`);

      // Pass the message to the Genkit AI flow
      const aiResponse = await whatsAppChat({ message: msg_body });

      // Here, you would use your Meta Business Partner's API (e.g., Twilio)
      // to send the `aiResponse.reply` back to the user (`from`).
      //
      // Example using a hypothetical `sendWhatsAppMessage` function:
      // await sendWhatsAppMessage(from, aiResponse.reply);

      console.log(`AI Reply to ${from}: ${aiResponse.reply}`);
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Error processing WhatsApp message:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
