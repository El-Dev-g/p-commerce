
import { NextResponse } from 'next/server';
import { products } from '@/lib/products';

// This forces the route to be dynamic, making it publicly accessible.
export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/products/{id}
 * Retrieves a single product by its ID.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json({ message: 'Error fetching product' }, { status: 500 });
  }
}
