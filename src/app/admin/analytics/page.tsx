
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Analytics & Insights</h1>
      </div>
      <Card className="flex flex-col items-center justify-center text-center p-8 border-dashed">
          <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Bot className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="mt-4">AI-Powered Analytics Coming Soon</CardTitle>
            <CardDescription className="max-w-md mx-auto">
                This is where your AI-driven sales insights and customer behavior analysis will appear. We're working on turning your data into actionable advice.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground">Check back later for updates!</p>
          </CardContent>
      </Card>
    </main>
  );
}
