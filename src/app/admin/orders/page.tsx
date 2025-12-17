
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
import { Eye, FileDown, PlusCircle, Truck, AlertTriangle, Ban } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

const ordersData = [
    { id: 'ORD001', customer: 'Liam Johnson', date: '2023-11-23', status: 'Delivered', total: '$250.00', trackingNumber: '1Z999AA10123456784', tags: ['High-Value'], fraudRisk: 'low' },
    { id: 'ORD002', customer: 'Olivia Smith', date: '2023-11-22', status: 'Shipped', total: '$150.75', trackingNumber: '1Z999AA10123456785', tags: ['Apparel'], fraudRisk: 'low' },
    { id: 'ORD003', customer: 'Noah Williams', date: '2023-11-21', status: 'Delivered', total: '$350.00', trackingNumber: '1Z999AA10123456786', tags: ['High-Value', 'Fragile'], fraudRisk: 'low' },
    { id: 'ORD004', customer: 'Emma Brown', date: '2023-11-20', status: 'Processing', total: '$450.50', trackingNumber: '', tags: ['High-Value'], fraudRisk: 'high' },
    { id: 'ORD005', customer: 'James Jones', date: '2023-11-19', status: 'Delivered', total: '$550.00', trackingNumber: '1Z9A9A9A0192783421', tags: ['High-Value', 'Gift'], fraudRisk: 'low' },
    { id: 'ORD006', customer: 'Sophia Garcia', date: '2023-11-18', status: 'Cancelled', total: '$50.25', trackingNumber: '', tags: ['Home Goods'], fraudRisk: 'low' },
    { id: 'ORD007', customer: 'Isabella Miller', date: '2023-11-17', status: 'Delivered', total: '$100.00', trackingNumber: '1Z999AA10123456789', tags: ['Stationery'], fraudRisk: 'low' },
    { id: 'ORD008', customer: 'Mason Davis', date: '2023-11-16', status: 'Shipped', total: '$120.80', trackingNumber: '1Z999AA10123456790', tags: [], fraudRisk: 'medium' },
    { id: 'ORD009', customer: 'Ava Rodriguez', date: '2023-11-15', status: 'Delivered', total: '$275.00', trackingNumber: '1Z999AA10123456791', tags: ['High-Value'], fraudRisk: 'low' },
    { id: 'ORD010', customer: 'Ethan Martinez', date: '2023-11-14', status: 'Processing', total: '$80.90', trackingNumber: '', tags: [], fraudRisk: 'low' },
];

type Order = typeof ordersData[0];

async function updateShipping(orderId: string, trackingNumber: string, customerPhone: string) {
    // Simulate API call to our backend
    const response = await fetch('/api/v1/update-shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            orderId,
            trackingNumber,
            carrier: 'Auto-Detect', // Carrier detection could be another AI feature!
            customer: { phone: customerPhone }, // Assuming a customer phone number for notifications
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to update shipping information.');
    }

    return response.json();
}


export default function OrdersPage() {
  const [orders, setOrders] = React.useState(ordersData);

  const handleSaveTracking = async (orderId: string, trackingNumber: string) => {
    try {
        await updateShipping(orderId, trackingNumber, '+15551234567'); // Using a dummy phone number
        
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === orderId ? { ...order, trackingNumber, status: trackingNumber ? 'Shipped' : order.status } : order
            )
        );

        toast({
            title: "Shipping Updated",
            description: `Order ${orderId} has been marked as shipped and a notification has been sent.`,
        });

    } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: "Could not send shipping notification. Please try again.",
        });
    }
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(prevOrders =>
        prevOrders.map(order =>
            order.id === orderId ? { ...order, status: 'Cancelled' } : order
        )
    );
    toast({
        title: "Order Cancelled",
        description: `Order ${orderId} has been successfully cancelled.`,
    });
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
                <TableHead>AI Tags</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className={order.fraudRisk === 'high' ? 'bg-destructive/10' : ''}>
                  <TableCell className="font-medium flex items-center gap-2">
                    {order.id}
                    {order.fraudRisk === 'high' && <AlertTriangle className="h-4 w-4 text-destructive" title="High Fraud Risk" />}
                  </TableCell>
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
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                        {order.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{order.total}</TableCell>
                  <TableCell className="text-center">
                    <OrderDetailsDialog order={order} onSave={handleSaveTracking} onCancel={handleCancelOrder} />
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

function OrderDetailsDialog({ order, onSave, onCancel }: { order: Order; onSave: (orderId: string, trackingNumber: string) => void; onCancel: (orderId: string) => void; }) {
  const [trackingNumber, setTrackingNumber] = React.useState(order.trackingNumber);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(order.id, trackingNumber);
    setIsSaving(false);
    setIsOpen(false);
  };

  const handleCancel = () => {
    onCancel(order.id);
    setIsOpen(false);
  }

  const isCancelable = order.status !== 'Delivered' && order.status !== 'Cancelled';

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
            {order.fraudRisk === 'high' && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/50 text-destructive-foreground">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <h4 className="font-semibold text-destructive">High Fraud Risk Detected</h4>
                    </div>
                    <p className="text-sm text-destructive/80 mt-1">Reason: Mismatched billing and shipping addresses.</p>
                </div>
            )}
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
        <DialogFooter className="sm:justify-between">
          <div>
            {isCancelable && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button type="button" variant="destructive">
                           <Ban className="mr-2 h-4 w-4" />
                           Cancel Order
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to cancel this order?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. The order status will be permanently set to "Cancelled".
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Close</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground">
                            Yes, Cancel Order
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
                Close
            </Button>
            <Button type="submit" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save & Notify'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
