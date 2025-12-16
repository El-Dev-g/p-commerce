
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
        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
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
            </div>
            <div className="lg:col-span-1">
                 <div className="space-y-8 sticky top-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-primary" />
                                    AI Content Generator
                                </div>
                            </CardTitle>
                            <CardDescription>
                            Generate content for the currently open page section.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="ai-topic">Topic / Headline</Label>
                                <Input 
                                    id="ai-topic"
                                    placeholder="e.g., Our Company Story"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="ai-keywords">Keywords (optional)</Label>
                                <Input 
                                    id="ai-keywords"
                                    placeholder="e.g., handmade, authentic, quality"
                                    value={keywords}
                                    onChange={(e) => setKeywords(e.target.value)}
                                />
                            </div>
                            <Button
                                className="w-full"
                                onClick={() => {
                                    const textareaIdMap: Record<string, string> = {
                                        'privacy-policy': 'privacy-policy-textarea',
                                        'terms-of-service': 'terms-of-service-textarea',
                                        'contact-us': 'contact-intro',
                                        'about-us': 'about-mission',
                                    };
                                    const textareaId = activeAccordion ? textareaIdMap[activeAccordion] : null;
                                    const textarea = textareaId ? document.getElementById(textareaId) as HTMLTextAreaElement | null : null;
                                    
                                    if (textarea) {
                                      handleGenerateContent((value) => {
                                        textarea.value = value;
                                      });
                                    }
                                }}
                                disabled={isLoading || !activeAccordion}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Generate Content
                            </Button>
                            <p className="text-xs text-muted-foreground text-center">Select a page section on the left to enable generation.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </main>
  );
}
