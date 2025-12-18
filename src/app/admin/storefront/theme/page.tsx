
'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export default function ThemeEditorPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('240 5.9% 10%');
  const [backgroundColor, setBackgroundColor] = useState('0 0% 100%');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const sendThemeUpdate = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'UPDATE_THEME',
          theme: {
            '--primary': primaryColor,
            '--background': backgroundColor,
          },
        },
        '*'
      );
    }
  };

  useEffect(() => {
    sendThemeUpdate();
  }, [primaryColor, backgroundColor]);

  const handleSaveChanges = async () => {
    // Save logic will be implemented in a future step
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
  };

  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Theme Editor</h1>
        <Button onClick={handleSaveChanges} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Colors</CardTitle>
              <CardDescription>Customize the main colors of your storefront.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color (HSL)</Label>
                <Input
                  id="primaryColor"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="e.g., 240 5.9% 10%"
                />
                <p className="text-xs text-muted-foreground">
                  Use HSL format (e.g., Hue Saturation% Lightness%).
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="backgroundColor">Background Color (HSL)</Label>
                <Input
                  id="backgroundColor"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  placeholder="e.g., 0 0% 100%"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card className="h-[calc(100vh-12rem)]">
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>Your storefront will update in real-time.</CardDescription>
            </CardHeader>
            <CardContent className="h-full p-0">
              <div className="w-full h-full bg-muted rounded-b-lg border-t overflow-hidden">
                <iframe
                  ref={iframeRef}
                  src="/storefront"
                  title="Theme Preview"
                  className="w-full h-full border-none"
                  onLoad={sendThemeUpdate}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
