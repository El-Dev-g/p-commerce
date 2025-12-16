
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AppStorePage() {
  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">App Store</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Discover Apps</CardTitle>
          <CardDescription>
            Browse and install apps to extend the functionality of your admin dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">The App Store is coming soon. Check back later for exciting new integrations!</p>
        </CardContent>
      </Card>
    </main>
  );
}
