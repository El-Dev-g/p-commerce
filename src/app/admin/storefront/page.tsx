
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, GripVertical, Image as ImageIcon, Type, Bell } from 'lucide-react';

const sections = [
    { name: 'Announcement Bar', icon: Bell },
    { name: 'Header', icon: Type },
    { name: 'Image with Text', icon: ImageIcon },
    { name: 'New Arrivals', icon: ImageIcon },
    { name: 'Image Banner', icon: ImageIcon },
];

export default function StorefrontEditorPage() {
  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Storefront Editor</h1>
        <Button>Save Changes</Button>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Homepage Sections</CardTitle>
                    <CardDescription>Drag and drop to reorder sections on your homepage.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        {sections.map((section, index) => (
                            <div key={index} className="flex items-center justify-between rounded-lg border bg-card p-3 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                                    <section.icon className="h-5 w-5 text-muted-foreground" />
                                    <span className="font-medium">{section.name}</span>
                                </div>
                                <Button variant="ghost" size="icon">
                                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                                </Button>
                            </div>
                        ))}
                    </div>
                     <Button variant="outline" className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Section
                    </Button>
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
                            src="http://localhost:9001"
                            title="Storefront Preview"
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
