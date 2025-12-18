
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { pagesData, type Page } from '@/lib/pages';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

async function getPage(slug: string): Promise<Page | null> {
  const page = pagesData.find((p) => p.slug === slug) || null;
  return Promise.resolve(page);
}

function renderContentAsText(content: Record<string, any>) {
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

function renderFaqAccordion(content: Record<string, any>) {
    const faqPairs: { question: string, answer: string }[] = [];
    for (let i = 1; content[`question${i}`]; i++) {
        faqPairs.push({
            question: content[`question${i}`],
            answer: content[`answer${i}`],
        });
    }

    return (
        <Accordion type="single" collapsible className="w-full">
            {faqPairs.map((pair, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-lg font-semibold text-left">{pair.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground whitespace-pre-line">
                        {pair.answer}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
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
                {page.slug === 'faq' ? renderFaqAccordion(page.content) : renderContentAsText(page.content)}
            </CardContent>
        </Card>
    </div>
  );
}
