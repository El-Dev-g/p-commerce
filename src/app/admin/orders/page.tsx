
'use client';

import * as React from 'react';
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
import { Eye, FileDown, PlusCircle, Truck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ordersData = [
    { id: 'ORD001', customer: 'Liam Johnson', date: '2023-11-23', status: 'Delivered', total: '$250.00', trackingNumber: '1Z999AA10123456784' },
    { id: 'ORD002', customer: 'Olivia Smith', date: '2023-11-22', status: 'Shipped', total: '$150.75', trackingNumber: '1Z999AA10123456785' },
    { id: 'ORD003', customer: 'Noah Williams', date: '2023-11-21', status: 'Delivered', total: '$350.00', trackingNumber: '1Z999AA10123456786' },
    { id: 'ORD004', customer: 'Emma Brown', date: '2023-11-20', status: 'Processing', total: '$450.50', trackingNumber: '' },
    { id: 'ORD005', customer: 'James Jones', date: '2023-11-19', status: 'Delivered', total: '$550.00', trackingNumber: '1Z9A9A9A0192783421' },
    { id: 'ORD006', customer: 'Sophia Garcia', date: '2023-11-18', status: 'Cancelled', total: '$50.25', trackingNumber: '' },
    { id: 'ORD007', customer: 'Isabella Miller', date: '2023-11-17', status: 'Delivered', total: '$100.00', trackingNumber: '1Z999AA10123456789' },
    { id: 'ORD008', customer: 'Mason Davis', date: '2023-11-16', status: 'Shipped', total: '$120.80', trackingNumber: '1Z999AA10123456790' },
    { id: 'ORD009', customer: 'Ava Rodriguez', date: '2023-11-15', status: 'Delivered', total: '$275.00', trackingNumber: '1Z999AA10123456791' },
    { id: 'ORD010', customer: 'Ethan Martinez', date: '2023-11-14', status: 'Processing', total: '$80.90', trackingNumber: '' },
];

type Order = typeof ordersData[0];

export default function OrdersPage() {
  const [orders, setOrders] = React.useState(ordersData);

  const handleSaveTracking = (orderId: string, trackingNumber: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, trackingNumber, status: trackingNumber ? 'Shipped' : order.status } : order
      )
    );
  };

  return (
     <main className="flex-1 p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Orders</h1>
        <div className="flex gap-2">
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Order
            </Button>
            <Button variant="outline">
              <FileDown className="mr-2 h-4 w-4" />
              Export
            </Button>
        </div>
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
                    <OrderDetailsDialog order={order} onSave={handleSaveTracking} />
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

function OrderDetailsDialog({ order, onSave }: { order: Order; onSave: (orderId: string, trackingNumber: string) => void }) {
  const [trackingNumber, setTrackingNumber] = React.useState(order.trackingNumber);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSave = () => {
    onSave(order.id, trackingNumber);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
          <span className="sr-only">View order</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Order {order.id}</DialogTitle>
          <DialogDescription>
            View details and update tracking for this order.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <p><strong>Customer:</strong> {order.customer}</p>
            <p><strong>Date:</strong> {order.date}</p>
            <p><strong>Total:</strong> {order.total}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <div className="space-y-2">
              <Label htmlFor="tracking-number">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Tracking Number
                </div>
              </Label>
              <Input
                id="tracking-number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
              />
            </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
