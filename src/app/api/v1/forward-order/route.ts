import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const order = await request.json();

    // In a real-world scenario, you would add your logic here to forward
    // the order to your dropshipping supplier.
    // This could involve:
    // 1. Calling the supplier's API.
    // 2. Sending a formatted email.
    // 3. Adding the order to a shared database or Google Sheet.

    console.log('--- Order received at /api/v1/forward-order ---');
    console.log('Forwarding to dropshipping supplier:');
    console.log(JSON.stringify(order, null, 2));
    console.log('-------------------------------------------------');

    // Return a success response
    return NextResponse.json({ message: 'Order forwarded successfully' }, { status: 200 });

  } catch (error) {
    console.error('Failed to process order for forwarding:', error);
    // Return an error response
    return NextResponse.json({ message: 'Error forwarding order', error: (error as Error).message }, { status: 500 });
  }
}
