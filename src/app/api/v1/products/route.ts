
import { NextResponse } from 'next/server';
import { products } from '@/lib/products';

/**
 * GET /api/v1/products
 * Retrieves the list of all products for the storefront.
 */
export async function GET() {
  try {
    // In a real application, you might add pagination or filtering here.
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ message: 'Error fetching products' }, { status: 500 });
  }
}
