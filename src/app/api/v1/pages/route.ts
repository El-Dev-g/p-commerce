
import { NextResponse } from 'next/server';
import { pagesData } from '@/lib/pages';

/**
 * GET /api/v1/pages
 * Retrieves a list of all static pages.
 */
export async function GET() {
  try {
    const pages = pagesData.map(({ slug, title }) => ({ slug, title }));
    return NextResponse.json({ pages }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch pages:', error);
    return NextResponse.json({ message: 'Error fetching pages' }, { status: 500 });
  }
}
