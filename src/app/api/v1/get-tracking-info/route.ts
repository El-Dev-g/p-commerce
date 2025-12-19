
import { NextResponse } from 'next/server';
import { getCjTrackingInfo } from '@/ai/flows/get-cj-tracking-info';

/**
 * POST /api/v1/get-tracking-info
 * Retrieves live tracking information from CJ Dropshipping for a given tracking number.
 */
export async function POST(request: Request) {
  try {
    const { trackNumber } = await request.json();

    if (!trackNumber) {
      return NextResponse.json({ message: 'Tracking number is required.' }, { status: 400 });
    }

    const trackingData = await getCjTrackingInfo({ trackNumber });

    return NextResponse.json({
        message: 'Tracking information retrieved successfully.',
        data: trackingData
    }, { status: 200 });

  } catch (error) {
    const err = error as Error;
    console.error('Failed to get tracking information:', err);
    return NextResponse.json({ message: 'Error retrieving tracking information', error: err.message }, { status: 500 });
  }
}
