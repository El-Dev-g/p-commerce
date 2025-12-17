
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
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import type { Order, OrderStatus } from './actions';
import { getOrders, updateOrderStatus, updateShippingInfo } from './actions';
import { OrderStatusBadge } from './order-status-badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function OrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);

  React.useEffect(() => {
    getOrders().then(setOrders);
  }, []);


  const handleSaveTracking = async (orderId: string, trackingNumber: string) => {
    try {
        await updateShippingInfo(orderId, trackingNumber, '+15551234567'); // Using a dummy phone number
        
        // Data is revalidated by server action, just need to fetch it again
        getOrders().then(setOrders);

        toast({
            title: "Shipping Updated",
            description: `Order ${orderId} has been marked as shipped and a notification has been sent.`,
        });

    } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: "Could not update shipping. Please try again.",
        });
    }
  };

  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
     try {
        await updateOrderStatus(orderId, status);
        getOrders().then(setOrders);
        toast({
            title: "Order Status Updated",
            description: `Order ${orderId} has been updated to "${status}".`,
        });
     } catch (error) {
         console.error(error);
         toast({
            variant: "destructive",
            title: "Update Failed",
            description: "Could not update order status. Please try again.",
        });
     }
  }

  const handleCancelOrder = async (orderId: string) => {
    await handleStatusUpdate(orderId, 'Cancelled');
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
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                        {order.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{order.total}</TableCell>
                  <TableCell className="text-center">
                    <OrderDetailsDialog order={order} onSaveTracking={handleSaveTracking} onCancel={handleCancelOrder} onStatusUpdate={handleStatusUpdate} />
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

function OrderDetailsDialog({ 
    order, 
    onSaveTracking, 
    onCancel,
    onStatusUpdate
}: { 
    order: Order; 
    onSaveTracking: (orderId: string, trackingNumber: string) => void; 
    onCancel: (orderId: string) => void;
    onStatusUpdate: (orderId: string, status: OrderStatus) => void;
}) {
  const [trackingNumber, setTrackingNumber] = React.useState(order.trackingNumber);
  const [currentStatus, setCurrentStatus] = React.useState<OrderStatus>(order.status as OrderStatus);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    if (trackingNumber !== order.trackingNumber) {
        await onSaveTracking(order.id, trackingNumber);
    }
    if (currentStatus !== order.status) {
        await onStatusUpdate(order.id, currentStatus);
    }
    setIsSaving(false);
    setIsOpen(false);
  };

  const handleCancel = () => {
    onCancel(order.id);
    setIsOpen(false);
  }

  const isCancelable = order.status !== 'Delivered' && order.status !== 'Cancelled';
  const orderStatuses: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

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
            View details, update status, and add tracking for this order.
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
            
            <div className="space-y-2">
              <Label htmlFor="order-status">Order Status</Label>
              <Select value={currentStatus} onValueChange={(value: OrderStatus) => setCurrentStatus(value)}>
                  <SelectTrigger id="order-status">
                      <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {orderStatuses.map(status => (
                        <SelectItem key={status} value={status} disabled={status === 'Cancelled'}>
                           {status}
                        </SelectItem>
                    ))}
                  </SelectContent>
              </Select>
            </div>

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
