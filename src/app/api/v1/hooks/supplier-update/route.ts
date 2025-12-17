
'use server';

import { NextResponse } from 'next/server';
import { updateOrderStatus, updateShippingInfo, getOrders } from '@/app/admin/orders/actions';
import type { OrderStatus } from '@/app/admin/orders/actions';

/**
 * POST /api/v1/hooks/supplier-update
 * This endpoint acts as a webhook for an external supplier to update order status.
 * It expects an API key for security.
 */
export async function POST(request: Request) {
  try {
    const supplierApiKey = request.headers.get('X-Supplier-API-Key');

    // IMPORTANT: In a real application, this key should be stored securely
    // in environment variables (e.g., process.env.SUPPLIER_API_KEY)
    const SECRET_KEY = 'your-secret-supplier-key'; 

    if (supplierApiKey !== SECRET_KEY) {
      return NextResponse.json({ message: 'Unauthorized: Invalid API Key' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, trackingNumber, status, customerPhone } = body;

    if (!orderId) {
      return NextResponse.json({ message: 'Missing orderId' }, { status: 400 });
    }

    console.log(`--- Supplier Webhook Update for Order ${orderId} ---`);
    console.log(`Status: ${status}, Tracking: ${trackingNumber}`);

    const orders = await getOrders();
    const orderExists = orders.some(o => o.id === orderId);

    if (!orderExists) {
        return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // If a tracking number is provided, update shipping info. This action also updates status to 'Shipped'.
    if (trackingNumber) {
        // We need a customer phone number to send a notification.
        // In a real app, you'd look this up from the orderId in your DB.
        const phone = customerPhone || '+15551234567'; // Fallback for simulation
        await updateShippingInfo(orderId, trackingNumber, phone);
    } 
    // If a status is provided (and it's a valid status), update it.
    else if (status && ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
        await updateOrderStatus(orderId, status as OrderStatus);
    }

    return NextResponse.json({ message: 'Order updated successfully' }, { status: 200 });

  } catch (error) {
    console.error('Failed to process supplier webhook:', error);
    return NextResponse.json({ message: 'Error processing webhook', error: (error as Error).message }, { status: 500 });
  }
}
