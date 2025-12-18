
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, PlusCircle } from 'lucide-react';
import Link from 'next/link';

const customersData = [
  { id: 'cus_001', name: 'Liam Johnson', email: 'liam@example.com', segment: 'Frequent Buyer', totalSpent: 1250.50, orderCount: 5 },
  { id: 'cus_002', name: 'Olivia Smith', email: 'olivia@example.com', segment: 'New Customer', totalSpent: 150.75, orderCount: 1 },
  { id: 'cus_003', name: 'Noah Williams', email: 'noah@example.com', segment: 'Top Spender', totalSpent: 3500.00, orderCount: 8 },
  { id: 'cus_004', name: 'Emma Brown', email: 'emma@example.com', segment: 'At-Risk', totalSpent: 450.50, orderCount: 2 },
  { id: 'cus_005', name: 'James Jones', email: 'james@example.com', segment: 'Top Spender', totalSpent: 5500.00, orderCount: 12 },
  { id: 'cus_006', name: 'Sophia Garcia', email: 'sophia@example.com', segment: 'New Customer', totalSpent: 50.25, orderCount: 1 },
  { id: 'cus_007', name: 'Isabella Miller', email: 'isabella@example.com', segment: 'Frequent Buyer', totalSpent: 1000.00, orderCount: 4 },
];

export default function CustomersPage() {
  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Customers</h1>
        <Button asChild>
          <Link href="/admin/customers/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Customer
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
          <CardDescription>View and manage all customer profiles.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>AI Segment</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customersData.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>
                    <Badge variant={customer.segment === 'New Customer' ? 'secondary' : customer.segment === 'At-Risk' ? 'destructive' : 'default'}>
                        {customer.segment}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">${customer.totalSpent.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{customer.orderCount}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="#">
                            <Eye className="h-4 w-4" />
                        </Link>
                    </Button>
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
