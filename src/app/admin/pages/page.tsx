
'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2 } from 'lucide-react';
import { generatePageContent } from '@/ai/flows/generate-page-content';
import { toast } from '@/hooks/use-toast';
import { pagesData } from '@/lib/pages';

export default function PagesManagementPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [topic, setTopic] = useState('');
    const [keywords, setKeywords] = useState('');
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
    const [pageContents, setPageContents] = useState(pagesData);

    const handleGenerateContent = async (setValue: (value: string) => void) => {
        if (!topic) {
            toast({
                variant: 'destructive',
                title: 'Topic is required',
                description: 'Please enter a topic to generate content.',
            });
            return;
        }

        setIsLoading(true);
        try {
            const result = await generatePageContent({
                topic,
                keywords: keywords.split(',').map(k => k.trim()),
            });
            setValue(result.content);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'AI Error',
                description: 'Failed to generate page content.',
            });
        } finally {
            setIsLoading(false);
        }
    };


  return (
    <main className="flex-1 p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
            <h1 className="font-headline text-3xl font-bold tracking-tight">Manage Pages</h1>
            <Button>Save All Changes</Button>
        </div>
        <Card>
            <CardHeader>
            <CardTitle>Page Content</CardTitle>
            <CardDescription>
                Edit the content for the public-facing pages of your storefront.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <Accordion type="single" collapsible onValueChange={setActiveAccordion} defaultValue="about-us" className="w-full">
                <AccordionItem value="about-us">
                <AccordionTrigger className="text-lg font-semibold">About Us</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                    <div className="space-y-2">
                    <Label htmlFor="about-mission" className="text-base">Our Mission</Label>
                    <Textarea
                        id="about-mission"
                        placeholder="Describe your company's mission..."
                        defaultValue={pageContents.find(p => p.slug === 'about-us')?.content.mission}
                        className="min-h-[120px]"
                    />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="about-story" className="text-base">Our Story</Label>
                    <Textarea
                        id="about-story"
                        placeholder="Tell your company's story..."
                        defaultValue={pageContents.find(p => p.slug === 'about-us')?.content.story}
                        className="min-h-[200px]"
                    />
                    </div>
                    <Button variant="outline">Save About Us</Button>
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="contact-us">
                <AccordionTrigger className="text-lg font-semibold">Contact Us</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                    <div className="space-y-2">
                    <Label htmlFor="contact-intro" className="text-base">Introductory Text</Label>
                    <Textarea
                        id="contact-intro"
                        placeholder="Enter the text for your contact page..."
                        defaultValue={pageContents.find(p => p.slug === 'contact-us')?.content.intro}
                        className="min-h-[100px]"
                    />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="contact-email">Contact Email</Label>
                            <Input id="contact-email" defaultValue={pageContents.find(p => p.slug === 'contact-us')?.content.email} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact-phone">Phone Number</Label>
                            <Input id="contact-phone" defaultValue={pageContents.find(p => p.slug === 'contact-us')?.content.phone} />
                        </div>
                    </div>
                    <Button variant="outline">Save Contact Us</Button>
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq">
                  <AccordionTrigger className="text-lg font-semibold">FAQ</AccordionTrigger>
                  <AccordionContent className="space-y-6 pt-4">
                      {Object.keys(pageContents.find(p => p.slug === 'faq')?.content || {}).filter(k => k.startsWith('question')).map((key, i) => {
                          const questionKey = `question${i+1}`;
                          const answerKey = `answer${i+1}`;
                          return (
                              <div key={i} className="space-y-2">
                                  <Label htmlFor={`faq-q${i+1}`}>Question {i+1}</Label>
                                  <Input id={`faq-q${i+1}`} defaultValue={pageContents.find(p => p.slug === 'faq')?.content[questionKey]} />
                                  <Label htmlFor={`faq-a${i+1}`}>Answer {i+1}</Label>
                                  <Textarea id={`faq-a${i+1}`} defaultValue={pageContents.find(p => p.slug === 'faq')?.content[answerKey]} className="min-h-[100px]" />
                              </div>
                          )
                      })}
                      <Button variant="outline">Save FAQ</Button>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping-policy">
                  <AccordionTrigger className="text-lg font-semibold">Shipping Policy</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                      <div className="space-y-2">
                          <Label htmlFor="shipping-processing">Processing Time</Label>
                          <Textarea id="shipping-processing" defaultValue={pageContents.find(p => p.slug === 'shipping-policy')?.content.processingTime} className="min-h-[100px]" />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="shipping-rates">Shipping Rates</Label>
                          <Textarea id="shipping-rates" defaultValue={pageContents.find(p => p.slug === 'shipping-policy')?.content.shippingRates} className="min-h-[100px]" />
                      </div>
                      <Button variant="outline">Save Shipping Policy</Button>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="return-policy">
                  <AccordionTrigger className="text-lg font-semibold">Return Policy</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                      <Textarea
                          id="return-policy-textarea"
                          placeholder="Enter your return policy text here..."
                          className="min-h-[200px]"
                          defaultValue={pageContents.find(p => p.slug === 'return-policy')?.content.policy}
                      />
                      <Button variant="outline">Save Return Policy</Button>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="privacy-policy">
                <AccordionTrigger className="text-lg font-semibold">Privacy Policy</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                    <Textarea
                    id="privacy-policy-textarea"
                    placeholder="Enter your privacy policy text here..."
                    className="min-h-[400px]"
                    defaultValue={pageContents.find(p => p.slug === 'privacy-policy')?.content.policy}
                    />
                    <Button variant="outline">Save Privacy Policy</Button>
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="terms-of-service">
                <AccordionTrigger className="text-lg font-semibold">Terms of Service</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                    <Textarea
                    id="terms-of-service-textarea"
                    placeholder="Enter your terms of service text here..."
                    className="min-h-[400px]"
                    defaultValue={pageContents.find(p => p.slug === 'terms-of-service')?.content.terms}
                    />
                    <Button variant="outline">Save Terms of Service</Button>
                </AccordionContent>
                </AccordionItem>
            </Accordion>
            </CardContent>
        </Card>
    </main>
  );
}
