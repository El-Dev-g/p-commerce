
import { NextResponse } from 'next/server';

// This is mock data. In a real app, you'd fetch this from a database.
const mockOrders = [
    { id: 'ORD001', customer: 'Liam Johnson', total: 250.00, status: 'Delivered' },
    { id: 'ORD002', customer: 'Olivia Smith', total: 150.75, status: 'Shipped' },
];

/**
 * GET /api/v1/orders/{id}
 * Retrieves a single order by its ID.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    const order = mockOrders.find((o) => o.id === orderId);

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return NextResponse.json({ message: 'Error fetching order' }, { status: 500 });
  }
}


/**
 * DELETE /api/v1/orders/{id}
 * Cancels a specific order.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    
    // In a real application, you would:
    // 1. Verify the user has permission to cancel this order.
    // 2. Find the order in your database.
    // 3. Update its status to 'Cancelled'.
    // 4. Potentially process a refund if payment was already captured.
    // 5. Reverse any stock deductions.

    console.log('--- Order Cancellation Request ---');
    console.log(`Order ID to cancel: ${orderId}`);
    console.log('---------------------------------');

    // For this prototype, we'll just simulate a successful cancellation.
    return NextResponse.json({ 
        message: 'Order cancelled successfully', 
        orderId: orderId 
    }, { status: 200 });

  } catch (error) {
    console.error('Failed to cancel order:', error);
    return NextResponse.json({ message: 'Error cancelling order', error: (error as Error).message }, { status: 500 });
  }
}
