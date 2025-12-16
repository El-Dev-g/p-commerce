
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
import { Eye, FileDown } from 'lucide-react';

const orders = [
    { id: 'ORD001', customer: 'Liam Johnson', date: '2023-11-23', status: 'Delivered', total: '$250.00' },
    { id: 'ORD002', customer: 'Olivia Smith', date: '2023-11-22', status: 'Shipped', total: '$150.75' },
    { id: 'ORD003', customer: 'Noah Williams', date: '2023-11-21', status: 'Delivered', total: '$350.00' },
    { id: 'ORD004', customer: 'Emma Brown', date: '2023-11-20', status: 'Processing', total: '$450.50' },
    { id: 'ORD005', customer: 'James Jones', date: '2023-11-19', status: 'Delivered', total: '$550.00' },
    { id: 'ORD006', customer: 'Sophia Garcia', date: '2023-11-18', status: 'Cancelled', total: '$50.25' },
    { id: 'ORD007', customer: 'Isabella Miller', date: '2023-11-17', status: 'Delivered', total: '$100.00' },
    { id: 'ORD008', customer: 'Mason Davis', date: '2023-11-16', status: 'Shipped', total: '$120.80' },
    { id: 'ORD009', customer: 'Ava Rodriguez', date: '2023-11-15', status: 'Delivered', total: '$275.00' },
    { id: 'ORD010', customer: 'Ethan Martinez', date: '2023-11-14', status: 'Processing', total: '$80.90' },
];

export default function OrdersPage() {
  return (
     <main className="flex-1 p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Orders</h1>
        <Button>
          <FileDown className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>View and manage all customer orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        order.status === 'Delivered' ? 'default' : 
                        order.status === 'Cancelled' ? 'destructive' : 
                        'secondary'
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{order.total}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View order</span>
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
