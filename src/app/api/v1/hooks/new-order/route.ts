import { NextResponse } from 'next/server';
import { tagOrder } from '@/ai/flows/tag-order';
import type { TagOrderInput } from '@/ai/flows/tag-order';

/**
 * POST /api/v1/hooks/new-order
 * This endpoint acts as a webhook receiver for new orders. It takes order data,
 * calls an AI flow to generate relevant tags, and then (in a real application)
 * would save those tags to the order in the database.
 */
export async function POST(request: Request) {
  try {
    const orderData: TagOrderInput = await request.json();

    // Validate that the required data is present.
    if (!orderData.orderItems || !orderData.totalAmount) {
      return NextResponse.json({ message: 'Invalid order data provided.' }, { status: 400 });
    }

    console.log('--- New Order Webhook Received ---');
    console.log('Order Data:', JSON.stringify(orderData, null, 2));

    // Call the AI flow to generate tags for the order.
    const { tags } = await tagOrder(orderData);

    console.log('AI Generated Tags:', tags);

    // In a real-world scenario, you would now take these 'tags' and
    // save them to the corresponding order record in your database.
    // For example:
    // await db.orders.update({ where: { id: orderData.id }, data: { tags: tags } });

    // Return the generated tags as a success response.
    return NextResponse.json({
        message: 'Order processed and tagged successfully.',
        generatedTags: tags
    }, { status: 200 });

  } catch (error) {
    console.error('Failed to process new order webhook:', error);
    return NextResponse.json({ message: 'Error processing webhook', error: (error as Error).message }, { status: 500 });
  }
}
