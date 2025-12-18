
'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Image as ImageIcon, Type, Bell, Sparkles, Loader2, Trash2, Library, Star, Megaphone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { generatePageContent } from '@/ai/flows/generate-page-content';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const initialSections = [
    { id: 'hero', name: 'Hero Section', icon: ImageIcon, type: 'hero' },
    { id: 'featured-products', name: 'Featured Products', icon: Library, type: 'featured-collection' },
];

const availableSectionTypes = [
    { type: 'header-banner', name: 'Header Banner', icon: Megaphone },
    { type: 'featured-collection', name: 'Featured Collection', icon: Library },
    { type: 'testimonials', name: 'Testimonials', icon: Star },
    { type: 'newsletter', name: 'Newsletter Signup', icon: Bell },
    { type: 'rich-text', name: 'Rich Text', icon: Type },
]

export default function StorefrontEditorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [sections, setSections] = useState(initialSections);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Send updated sections to the iframe preview
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      // Create a serializable version of the sections without the component icons
      const serializableSections = sections.map(({ id, type }) => ({ id, type }));
      
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'UPDATE_SECTIONS',
          sections: serializableSections,
        },
        '*' // In production, you should use a specific target origin
      );
    }
  }, [sections]);

  const handleGenerateContent = async () => {
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
        console.log("Generated content for section " + activeSection + ":", result.content);
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

  const handleRemoveSection = (sectionId: string) => {
    setSections(prev => prev.filter(s => s.id !== sectionId));
    if (activeSection === sectionId) {
        setActiveSection(null);
    }
  };

  const handleAddSection = (sectionType: { type: string; name: string; icon: React.ElementType }) => {
    const newSection = {
        id: `${sectionType.type}-${Date.now()}`,
        name: sectionType.name,
        icon: sectionType.icon,
        type: sectionType.type,
    };
    setSections(prev => [...prev, newSection]);
    setIsAddSectionOpen(false);
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
                    <CardDescription>Add, remove, and reorder sections on your homepage.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        {sections.map((section) => (
                            <div key={section.id} className="group flex items-center gap-2">
                                <Button 
                                    variant="outline" 
                                    className={`w-full justify-start ${activeSection === section.id ? 'ring-2 ring-primary' : ''}`}
                                    onClick={() => setActiveSection(section.id)}
                                >
                                    <section.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                                    {section.name}
                                </Button>
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive opacity-50 group-hover:opacity-100" onClick={() => handleRemoveSection(section.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                     <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
                        <DialogTrigger asChild>
                             <Button variant="outline" className="w-full border-dashed">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Section
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add a new section</DialogTitle>
                                <DialogDescription>Choose a section type to add to your homepage.</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 py-4">
                                {availableSectionTypes.map((type) => {
                                    const Icon = type.icon;
                                    return (
                                        <button
                                            key={type.type}
                                            onClick={() => handleAddSection(type)}
                                            className="flex flex-col items-center justify-center gap-2 rounded-lg border p-4 text-center hover:bg-accent hover:text-accent-foreground transition-colors"
                                        >
                                            <Icon className="h-8 w-8 text-muted-foreground" />
                                            <span className="text-sm font-medium">{type.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </DialogContent>
                     </Dialog>
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
                            ref={iframeRef}
                            src="/storefront"
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

    


