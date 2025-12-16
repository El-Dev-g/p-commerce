
import { NextResponse } from 'next/server';
import { pagesData } from '@/lib/pages';

/**
 * GET /api/v1/pages/{slug}
 * Retrieves a single page by its slug.
 */
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const pageSlug = params.slug;
    const page = pagesData.find((p) => p.slug === pageSlug);

    if (!page) {
      return NextResponse.json({ message: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ page }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch page:', error);
    return NextResponse.json({ message: 'Error fetching page' }, { status: 500 });
  }
}
