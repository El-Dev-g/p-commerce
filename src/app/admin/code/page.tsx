
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const webhookExample = `
fetch('/api/v1/hooks/new-order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    orderItems: [
      { name: 'Artisan Ceramic Mug', category: 'Home Goods', price: 28.00 },
      { name: 'Classic Fountain Pen', category: 'Stationery', price: 85.00 }
    ],
    totalAmount: 113.00
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
`;

export default function CodePage() {
  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Code Snippets</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Webhook Example: New Order</CardTitle>
          <CardDescription>
            Use this code to send a notification to your server when a new order is created. This can be used to trigger AI flows like order tagging.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
            <code>{webhookExample.trim()}</code>
          </pre>
        </CardContent>
      </Card>
    </main>
  );
}
