
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, PlusCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const subscribersData = [
  { id: 'sub_001', email: 'liam@example.com', date: '2024-07-28', status: 'Subscribed' },
  { id: 'sub_002', email: 'olivia@example.com', date: '2024-07-27', status: 'Subscribed' },
  { id: 'sub_003', email: 'noah@example.com', date: '2024-07-26', status: 'Subscribed' },
  { id: 'sub_004', email: 'emma@example.com', date: '2024-07-25', status: 'Unsubscribed' },
  { id: 'sub_005', email: 'james@example.com', date: '2024-07-24', status: 'Subscribed' },
];

export default function NewsletterPage() {
  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Newsletter Subscribers</h1>
        <div className="flex gap-2">
            <Button asChild>
                <Link href="/admin/marketing/newsletter/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Newsletter
                </Link>
            </Button>
            <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Export
            </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Subscribers</CardTitle>
          <CardDescription>View and manage your newsletter subscribers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Subscription Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribersData.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.email}</TableCell>
                  <TableCell>{sub.date}</TableCell>
                  <TableCell>
                    <Badge variant={sub.status === 'Subscribed' ? 'default' : 'secondary'}>{sub.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
