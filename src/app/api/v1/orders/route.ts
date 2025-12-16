
import { NextResponse } from 'next/server';

/**
 * POST /api/v1/orders
 * Creates a new order. This endpoint would be called by the storefront
 * after a customer completes the checkout process.
 */
export async function POST(request: Request) {
  try {
    const orderData = await request.json();

    // In a real-world application, you would:
    // 1. Validate the order data.
    // 2. Process the payment with a payment provider (e.g., Stripe).
    // 3. Save the new order to your database.
    // 4. Decrease stock for the purchased products.
    // 5. Trigger other workflows (like sending a confirmation email/WhatsApp message).

    console.log('--- New Order Received ---');
    console.log(JSON.stringify(orderData, null, 2));
    console.log('--------------------------');
    
    // For this prototype, we'll just simulate a successful order creation.
    const newOrderId = `ORD${Math.floor(Math.random() * 90000) + 10000}`;

    return NextResponse.json({ 
        message: 'Order created successfully', 
        orderId: newOrderId 
    }, { status: 201 });

  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ message: 'Error creating order', error: (error as Error).message }, { status: 500 });
  }
}

/**
 * GET /api/v1/orders
 * Retrieves a list of all orders. This is typically a protected admin-only endpoint.
 */
export async function GET() {
    try {
        // In a real app, you'd fetch this from a database.
        // This is a simplified example. The actual orders page in the admin
        // dashboard uses mock data directly for now.
        const mockOrders = [
            { id: 'ORD001', customer: 'Liam Johnson', total: '$250.00' },
            { id: 'ORD002', customer: 'Olivia Smith', total: '$150.75' },
        ];
        
        return NextResponse.json({ orders: mockOrders }, { status: 200 });

    } catch (error) {
        console.error('Failed to fetch orders:', error);
        return NextResponse.json({ message: 'Error fetching orders' }, { status: 500 });
    }
}
