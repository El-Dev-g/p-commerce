
'use server';

import { getOrders } from '@/app/admin/orders/actions';
import { getCjTrackingInfo } from '@/ai/flows/get-cj-tracking-info';

type TrackOrderInput = {
  orderId: string;
  email: string;
};

type TrackOrderResult = {
  success: boolean;
  order?: {
    id: string;
    status: string;
    date: string;
    trackingNumber?: string;
    trackingDetails?: any;
  };
  error?: string;
};

export async function trackOrderAction(input: TrackOrderInput): Promise<TrackOrderResult> {
  try {
    const allOrders = await getOrders();
    const order = allOrders.find(
      (o) => o.id === input.orderId && o.email.toLowerCase() === input.email.toLowerCase()
    );

    if (!order) {
      return { success: false, error: 'No order found with that ID and email address.' };
    }

    let trackingDetails;
    if (order.trackingNumber) {
        try {
            trackingDetails = await getCjTrackingInfo({ trackNumber: order.trackingNumber });
        } catch (e) {
            console.error(`Failed to get tracking info for ${order.trackingNumber}`, e);
            // Don't fail the whole request, just log the error
        }
    }

    return {
      success: true,
      order: {
        id: order.id,
        status: order.status,
        date: order.date,
        trackingNumber: order.trackingNumber,
        trackingDetails: trackingDetails,
      },
    };
  } catch (error) {
    console.error('Error in trackOrderAction:', error);
    return { success: false, error: 'An unexpected error occurred while tracking the order.' };
  }
}
