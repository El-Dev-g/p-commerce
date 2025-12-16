import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { orderId, trackingNumber, carrier } = await request.json();

    if (!orderId || !trackingNumber) {
      return NextResponse.json({ message: 'Missing orderId or trackingNumber' }, { status: 400 });
    }

    // In a real-world scenario, you would:
    // 1. Find the order in your database using the orderId.
    // 2. Save the trackingNumber and carrier to the order.
    // 3. Potentially trigger another WhatsApp message to the customer
    //    with their tracking information.

    console.log('--- Shipping update received ---');
    console.log(`Order ID: ${orderId}`);
    console.log(`Tracking Number: ${trackingNumber}`);
    console.log(`Carrier: ${carrier || 'Not specified'}`);
    console.log('---------------------------------');

    // You could also trigger a WhatsApp message here, similar to the confirmation
    // await fetch(`${request.nextUrl.origin}/api/v1/send-whatsapp`, { ... });


    return NextResponse.json({ message: 'Tracking information updated successfully' }, { status: 200 });

  } catch (error) {
    console.error('Failed to process shipping update:', error);
    return NextResponse.json({ message: 'Error processing shipping update', error: (error as Error).message }, { status: 500 });
  }
}
