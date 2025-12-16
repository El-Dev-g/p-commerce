
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, ShoppingCart, Settings, Trash2 } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

type App = {
  id: string;
  name: string;
  description: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
};

const availableApps: App[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Integration',
    description: 'Engage with customers directly via WhatsApp for support and order notifications.',
    icon: MessageSquare,
  },
  {
    id: 'supplier',
    name: 'Supplier Integration',
    description: 'Automate order forwarding to your dropshipping supplier (e.g., AliExpress).',
    icon: ShoppingCart,
  },
];

export default function AppStorePage() {
  const [installedApps, setInstalledApps] = useState<Record<string, boolean>>({
    whatsapp: true, // Let's assume WhatsApp is pre-installed
  });

  const handleInstall = (appId: string) => {
    setInstalledApps(prev => ({ ...prev, [appId]: true }));
  };

  const handleUninstall = (appId: string) => {
    setInstalledApps(prev => ({ ...prev, [appId]: false }));
  };

  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">App Store</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {availableApps.map((app) => {
            const isInstalled = !!installedApps[app.id];
            const Icon = app.icon;

            return (
                <Card key={app.id} className="flex flex-col">
                    <CardHeader className="flex flex-row items-start gap-4">
                        <div className="bg-muted p-3 rounded-lg">
                           <Icon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                            <CardTitle>{app.name}</CardTitle>
                            <CardDescription className="mt-1">{app.description}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1" />
                    <CardFooter className="flex justify-end gap-2 bg-muted/50 p-4 rounded-b-lg">
                       {isInstalled ? (
                        <>
                            <Button variant="outline" asChild>
                                <Link href="/admin/settings">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Manage
                                </Link>
                            </Button>
                            <Button variant="destructive" onClick={() => handleUninstall(app.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Uninstall
                            </Button>
                        </>
                       ) : (
                        <Button onClick={() => handleInstall(app.id)}>
                            Install
                        </Button>
                       )}
                    </CardFooter>
                </Card>
            )
        })}
      </div>
    </main>
  );
}
