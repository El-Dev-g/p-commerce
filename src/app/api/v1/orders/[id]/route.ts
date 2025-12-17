
import { NextResponse } from 'next/server';
import { getOrders, updateOrderStatus } from '@/app/admin/orders/actions';


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
    const orders = await getOrders();
    const order = orders.find((o) => o.id === orderId);

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

    const result = await updateOrderStatus(orderId, 'Cancelled');

    if (!result.success) {
      return NextResponse.json({ message: result.message || 'Error cancelling order' }, { status: 404 });
    }

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
