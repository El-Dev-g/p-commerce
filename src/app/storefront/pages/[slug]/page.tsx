
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Page } from '@/lib/pages';


async function getPage(slug: string): Promise<Page | null> {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9002';
    const res = await fetch(`${apiBaseUrl}/api/v1/pages/${slug}`, { 
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return data.page;
  } catch (error) {
    console.error('Failed to fetch page:', error);
    return null;
  }
}

function renderContent(content: Record<string, any>) {
    return Object.entries(content).map(([key, value]) => {
        if (typeof value === 'string' && !key.toLowerCase().includes('title')) {
             const title = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
             return (
                <div key={key} className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2 capitalize">{title}</h2>
                    <p className="text-muted-foreground whitespace-pre-line">{value}</p>
                </div>
             )
        }
        return null;
    })
}

export default async function StorefrontPage({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
        <Card>
            <CardHeader>
                <CardTitle className="text-4xl font-bold tracking-tighter">{page.title}</CardTitle>
            </CardHeader>
            <CardContent>
                {renderContent(page.content)}
            </CardContent>
        </Card>
    </div>
  );
}
