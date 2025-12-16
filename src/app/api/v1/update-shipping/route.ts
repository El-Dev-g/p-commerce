import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { orderId, trackingNumber, carrier, customer } = await request.json();

    if (!orderId || !trackingNumber) {
      return NextResponse.json({ message: 'Missing orderId or trackingNumber' }, { status: 400 });
    }

    // In a real-world scenario, you would:
    // 1. Find the order in your database using the orderId.
    // 2. Save the trackingNumber and carrier to the order.
    // 3. Trigger a WhatsApp message to the customer with their tracking info.

    console.log('--- Shipping update received ---');
    console.log(`Order ID: ${orderId}`);
    console.log(`Tracking Number: ${trackingNumber}`);
    console.log(`Carrier: ${carrier || 'Not specified'}`);
    console.log('---------------------------------');

    // Trigger a WhatsApp message with the tracking update.
    // In a real app, you'd need the customer's phone number from your database.
    // For this prototype, we'll assume it's passed in the request.
    if (customer && customer.phone) {
        try {
            await fetch(`${new URL(request.url).origin}/api/v1/send-whatsapp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: customer.phone,
                    type: 'shipping_update',
                    orderId: orderId,
                    trackingNumber: trackingNumber,
                    carrier: carrier,
                }),
            });
            console.log("WhatsApp tracking update triggered successfully.");
        } catch (error) {
            console.error("Failed to trigger WhatsApp tracking message:", error);
            // Non-blocking error, so we don't return an error response here.
        }
    }


    return NextResponse.json({ message: 'Tracking information updated successfully' }, { status: 200 });

  } catch (error) {
    console.error('Failed to process shipping update:', error);
    return NextResponse.json({ message: 'Error processing shipping update', error: (error as Error).message }, { status: 500 });
  }
}


export async function GET(request: Request) {
    // Example: GET /api/v1/update-shipping?orderId=123
    // In a real app, you would fetch the current shipping status for an order.
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    console.log(`GET request received for shipping status of order: ${orderId}`);
    return NextResponse.json({ message: `Shipping status for order ${orderId} would be fetched here.` });
}

export async function PUT(request: Request) {
    // This is arguably a more "correct" verb for this route than POST,
    // as updating shipping info is often an idempotent action.
    const payload = await request.json();
    console.log('PUT request received to update shipping:', payload);
    // You could reuse the POST logic here.
    return NextResponse.json({ message: 'Shipping information updated successfully via PUT (simulated).' });
}

export async function DELETE(request: Request) {
    // Example: Delete or invalidate a shipping label/tracking number.
    const { orderId } = await request.json();
    console.log(`DELETE request received to remove shipping info for order: ${orderId}`);
    return NextResponse.json({ message: `Shipping info for order ${orderId} removed successfully (simulated).` });
}
