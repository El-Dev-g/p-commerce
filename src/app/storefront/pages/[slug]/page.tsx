
import { pagesData } from '@/lib/pages';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// This function can be used to generate static pages at build time
// export async function generateStaticParams() {
//   return pagesData.map((page) => ({
//     slug: page.slug,
//   }));
// }

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

export default function StorefrontPage({ params }: { params: { slug: string } }) {
  const page = pagesData.find((p) => p.slug === params.slug);

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
