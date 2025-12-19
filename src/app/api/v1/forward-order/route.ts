

import { NextResponse } from 'next/server';
import { getCjOrderDetail } from '@/ai/flows/get-cj-order-detail';
import { getAccessToken } from '@/lib/cj-token-service';

const CJ_API_BASE = 'https://developers.cjdropshipping.com/api2.0/v1';

async function getCjClient() {
    const accessToken = await getAccessToken();
    return {
        async post(endpoint: string, body: any) {
            const response = await fetch(`${CJ_API_BASE}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cj-Access-Token': accessToken,
                },
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`CJ API Error for ${endpoint}: ${response.status} - ${errorBody}`);
            }
            return response.json();
        },
        async delete(endpoint: string, body: any) {
             const response = await fetch(`${CJ_API_BASE}${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Cj-Access-Token': accessToken,
                },
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`CJ API Error for ${endpoint}: ${response.status} - ${errorBody}`);
            }
            return response.json();
        }
    }
}


/**
 * POST /api/v1/forward-order
 * Forwards a new order to CJ Dropshipping for fulfillment.
 */
export async function POST(request: Request) {
  try {
    const orderData = await request.json();

    // Basic validation
    if (!orderData.shipping || !orderData.products || orderData.products.length === 0) {
        return NextResponse.json({ message: 'Invalid order data: missing shipping or products.' }, { status: 400 });
    }

    const cjClient = await getCjClient();

    const cjOrderPayload = {
      ...orderData,
      fromCountry: "US", // Assuming orders ship from the US warehouse
      logisticName: "CJPacket", // Default shipping method, can be changed
    };

    console.log('Forwarding order to CJ Dropshipping with payload:', cjOrderPayload);

    const cjResponse = await cjClient.post('/order/create', cjOrderPayload);

    if (!cjResponse.result || !cjResponse.data) {
        throw new Error(cjResponse.message || 'Failed to create CJ Dropshipping order.');
    }

    // Immediately confirm the order for payment (as per CJ docs for dropshippers)
    const orderIds = cjResponse.data.map((order: any) => order.orderId);
    const confirmResponse = await cjClient.post('/order/confirmOrder', { orderIdList: orderIds });

    if (!confirmResponse.result) {
        // If confirmation fails, we should still let the user know the order was created but needs manual payment.
        console.warn(`CJ Order(s) ${orderIds.join(', ')} created but failed to confirm automatically.`);
    }

    return NextResponse.json({
        message: 'Order forwarded to CJ Dropshipping successfully.',
        cjData: cjResponse.data,
        confirmationStatus: confirmResponse.result ? 'Confirmed' : 'Confirmation Failed',
    }, { status: 200 });

  } catch (error) {
    const err = error as Error;
    console.error('Failed to process order for forwarding:', err);
    return NextResponse.json({ message: 'Error forwarding order', error: err.message }, { status: 500 });
  }
}

/**
 * GET /api/v1/forward-order?orderId={cjOrderId}
 * Retrieves order details from CJ Dropshipping.
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get('orderId');
        if (!orderId) {
            return NextResponse.json({ message: 'CJ Order ID is required.' }, { status: 400 });
        }

        const orderDetails = await getCjOrderDetail({ orderId });

        return NextResponse.json({
            message: 'Order details fetched successfully.',
            data: orderDetails,
        }, { status: 200 });

    } catch (error) {
        const err = error as Error;
        console.error('Failed to get CJ order details:', err);
        return NextResponse.json({ message: 'Error fetching order details', error: err.message }, { status: 500 });
    }
}

/**
 * PUT /api/v1/forward-order
 * Confirms a CJ Dropshipping order for payment.
 */
export async function PUT(request: Request) {
    try {
        const { orderIds } = await request.json(); // Expects a list of CJ order IDs
        if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
            return NextResponse.json({ message: 'orderIds array is required.' }, { status: 400 });
        }
        
        const cjClient = await getCjClient();
        const confirmResponse = await cjClient.post('/order/confirmOrder', { orderIdList: orderIds });

        if (!confirmResponse.result) {
            throw new Error(confirmResponse.message || 'Failed to confirm CJ Dropshipping order(s).');
        }

        return NextResponse.json({ message: 'CJ order(s) confirmed successfully.', data: confirmResponse.data }, { status: 200 });

    } catch (error) {
        const err = error as Error;
        console.error('Failed to confirm CJ order:', err);
        return NextResponse.json({ message: 'Error confirming order', error: err.message }, { status: 500 });
    }
}

/**
 * DELETE /api/v1/forward-order
 * Cancels an order on CJ Dropshipping.
 */
export async function DELETE(request: Request) {
    try {
        const { orderId } = await request.json(); // Expects a single CJ order ID
        if (!orderId) {
            return NextResponse.json({ message: 'orderId is required.' }, { status: 400 });
        }

        const cjClient = await getCjClient();
        const deleteResponse = await cjClient.delete('/order/deleteOrder', { orderId: orderId });
        
        if (!deleteResponse.result) {
            throw new Error(deleteResponse.message || 'Failed to delete CJ Dropshipping order.');
        }

        return NextResponse.json({ message: `Forwarded order ${orderId} cancelled successfully.` }, { status: 200 });
    } catch (error) {
        const err = error as Error;
        console.error('Failed to cancel CJ order:', err);
        return NextResponse.json({ message: 'Error cancelling order', error: err.message }, { status: 500 });
    }
}
