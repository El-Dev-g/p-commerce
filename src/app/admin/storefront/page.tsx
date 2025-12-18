
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, GripVertical, Image as ImageIcon, Type, Bell, Sparkles, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { generatePageContent } from '@/ai/flows/generate-page-content';

const sections = [
    { id: 'announcement', name: 'Announcement Bar', icon: Bell },
    { id: 'header', name: 'Header', icon: Type },
    { id: 'hero', name: 'Image with Text', icon: ImageIcon },
    { id: 'new-arrivals', name: 'New Arrivals', icon: ImageIcon },
    { id: 'image-banner', name: 'Image Banner', icon: ImageIcon },
];

export default function StorefrontEditorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleGenerateContent = async () => {
    // This is a placeholder for now. In a real app, you'd have a way to target
    // the content area of the selected section in the iframe.
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
            tone: 'promotional',
        });
        console.log("Generated content:", result.content);
        toast({
            title: 'Content Generated',
            description: 'The AI content has been generated and printed to the console.',
        });
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
        <h1 className="font-headline text-3xl font-bold tracking-tight">Storefront Editor</h1>
        <Button>Save Changes</Button>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Homepage Sections</CardTitle>
                    <CardDescription>Select a section to edit its content with AI.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        {sections.map((section) => (
                            <Button 
                                key={section.id} 
                                variant="outline" 
                                className={`w-full justify-start ${activeSection === section.id ? 'ring-2 ring-primary' : ''}`}
                                onClick={() => setActiveSection(section.id)}
                            >
                                <section.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                                {section.name}
                            </Button>
                        ))}
                    </div>
                     <Button variant="outline" className="w-full border-dashed">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Section
                    </Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            AI Content Generator
                        </div>
                    </CardTitle>
                    <CardDescription>
                    Generate content for the selected page section.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="ai-topic">Topic / Headline</Label>
                        <Input 
                            id="ai-topic"
                            placeholder="e.g., Summer Sale Announcement"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="ai-keywords">Keywords (optional)</Label>
                        <Input 
                            id="ai-keywords"
                            placeholder="e.g., 20% off, limited time"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                        />
                    </div>
                    <Button
                        className="w-full"
                        onClick={handleGenerateContent}
                        disabled={isLoading || !activeSection}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate Content
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">Select a homepage section above to enable generation.</p>
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-2">
           <Card className="h-[calc(100vh-12rem)]">
                <CardHeader>
                    <CardTitle>Live Preview</CardTitle>
                    <CardDescription>A live preview of your public-facing storefront.</CardDescription>
                </CardHeader>
                <CardContent className="h-full p-0">
                    <div className="w-full h-full bg-muted rounded-b-lg border-t overflow-hidden">
                        <iframe
                            src="https://6000-firebase-curated-dashboard-1765891223552.cluster-64pjnskmlbaxowh5lzq6i7v4ra.cloudworkstations.dev/"
                            title="Curated Finds - Storefront Preview"
                            className="w-full h-full border-none"
                        />
                    </div>
                </CardContent>
           </Card>
        </div>
      </div>
    </main>
  );
}
