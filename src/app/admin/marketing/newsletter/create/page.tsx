
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Send, Mail } from 'lucide-react';
import { products as allProducts } from '@/lib/products';
import { Checkbox } from '@/components/ui/checkbox';
import { generateNewsletter } from '@/ai/flows/generate-newsletter';
import ReactMarkdown from 'react-markdown';
import { sendNewsletterAction } from './actions';

export default function CreateNewsletterPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [topic, setTopic] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [generatedContent, setGeneratedContent] = useState<{ subject: string; body: string } | null>(null);

  const handleProductSelect = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleGenerate = async () => {
    if (!topic) {
      toast({
        variant: 'destructive',
        title: 'Topic is required',
        description: 'Please enter a topic to generate the newsletter.',
      });
      return;
    }
    setIsGenerating(true);
    setGeneratedContent(null);
    try {
      const featuredProducts = allProducts.filter(p => selectedProducts.includes(p.id))
        .map(p => ({ id: p.id, name: p.name, description: p.description, price: p.price }));

      const result = await generateNewsletter({ topic, featuredProducts });
      setGeneratedContent(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Failed to generate newsletter content.',
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSend = async () => {
    if (!generatedContent) {
      toast({ variant: 'destructive', title: 'No content to send.' });
      return;
    }
      setIsSending(true);
      try {
        const result = await sendNewsletterAction(generatedContent);
        if (result.success) {
            toast({
                title: 'Newsletter Sent!',
                description: 'Your newsletter has been sent to all subscribers.',
            });
        } else {
             toast({
                variant: 'destructive',
                title: 'Sending Failed',
                description: result.error || 'An unknown error occurred.',
            });
        }
      } catch (error) {
         toast({
            variant: 'destructive',
            title: 'Sending Failed',
            description: (error as Error).message,
        });
      }
      setIsSending(false);
  }

  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Create Newsletter</h1>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Newsletter Details</CardTitle>
                    <CardDescription>Configure the content for your new email campaign.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="topic">Topic / Headline</Label>
                        <Input 
                            id="topic" 
                            placeholder="e.g., New Summer Collection" 
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Featured Products (optional)</Label>
                        <div className="space-y-2 max-h-60 overflow-y-auto rounded-md border p-2">
                            {allProducts.map(product => (
                                <div key={product.id} className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={`product-${product.id}`}
                                        checked={selectedProducts.includes(product.id)}
                                        onCheckedChange={() => handleProductSelect(product.id)}
                                    />
                                    <Label htmlFor={`product-${product.id}`} className="font-normal">{product.name}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
                        {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Content
                    </Button>
                </CardFooter>
            </Card>
        </div>
        <div className="lg:col-span-2">
           <Card>
                <CardHeader>
                    <CardTitle>AI Generated Preview</CardTitle>
                    <CardDescription>This is what the AI has generated. Review and send.</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[60vh]">
                   {generatedContent ? (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label>Subject</Label>
                                <p className="rounded-md border bg-muted px-3 py-2 text-sm">{generatedContent.subject}</p>
                            </div>
                             <div className="space-y-2">
                                <Label>Body</Label>
                                <div className="prose dark:prose-invert prose-sm max-w-none rounded-md border bg-muted p-4">
                                     <ReactMarkdown
                                        components={{
                                            a: ({ node, ...props }) => {
                                                if (props.href && props.href.startsWith('/')) {
                                                    // In a real email, this would be a full URL
                                                    const baseUrl = "https://prigidcommerce.shop";
                                                    return <a href={baseUrl + props.href} {...props} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" />;
                                                }
                                                return <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" />;
                                            }
                                        }}
                                     >
                                        {generatedContent.body}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                   ) : (
                       <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center">
                           <Mail className="h-12 w-12 mb-4" />
                           <p>Generated content will appear here.</p>
                       </div>
                   )}
                </CardContent>
                {generatedContent && (
                    <CardFooter>
                        <Button onClick={handleSend} disabled={isSending} className="w-full">
                            {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Send className="mr-2 h-4 w-4" />
                            {isSending ? 'Sending...' : 'Send to All Subscribers'}
                        </Button>
                    </CardFooter>
                )}
           </Card>
        </div>
      </div>
    </main>
  );
}
