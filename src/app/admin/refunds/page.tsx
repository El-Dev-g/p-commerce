
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
import { CheckCircle, XCircle } from 'lucide-react';
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

const refundRequestsData = [
    { id: 'REF001', orderId: 'ORD003', customer: 'Noah Williams', date: '2023-11-25', reason: 'Item arrived damaged', status: 'Pending' },
    { id: 'REF002', orderId: 'ORD005', customer: 'James Jones', date: '2023-11-24', reason: 'Changed my mind', status: 'Pending' },
    { id: 'REF003', orderId: 'ORD001', customer: 'Liam Johnson', date: '2023-11-23', reason: 'Received wrong item', status: 'Approved' },
    { id: 'REF004', orderId: 'ORD008', customer: 'Mason Davis', date: '2023-11-22', reason: 'Item not as described', status: 'Rejected' },
    { id: 'REF005', orderId: 'ORD002', customer: 'Olivia Smith', date: '2023-11-21', reason: 'Late delivery', status: 'Pending' },
];

type RefundRequest = typeof refundRequestsData[0];

export default function RefundsPage() {
  const [refunds, setRefunds] = React.useState(refundRequestsData);

  const handleStatusChange = (refundId: string, newStatus: 'Approved' | 'Rejected') => {
    setRefunds(prevRefunds =>
      prevRefunds.map(refund =>
        refund.id === refundId ? { ...refund, status: newStatus } : refund
      )
    );
  };

  return (
     <main className="flex-1 p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Refund Requests</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Refund Requests</CardTitle>
          <CardDescription>View and process customer refund requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {refunds.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>{request.orderId}</TableCell>
                  <TableCell>{request.customer}</TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        request.status === 'Approved' ? 'default' : 
                        request.status === 'Rejected' ? 'destructive' : 
                        'secondary'
                      }
                    >
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {request.status === 'Pending' && (
                      <div className="flex gap-2">
                        <ConfirmationDialog
                          action="Approve"
                          onConfirm={() => handleStatusChange(request.id, 'Approved')}
                        >
                          <Button variant="ghost" size="icon">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                        </ConfirmationDialog>
                         <ConfirmationDialog
                          action="Reject"
                          onConfirm={() => handleStatusChange(request.id, 'Rejected')}
                        >
                          <Button variant="ghost" size="icon">
                            <XCircle className="h-4 w-4 text-red-600" />
                          </Button>
                        </ConfirmationDialog>
                      </div>
                    )}
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

function ConfirmationDialog({
  action,
  children,
  onConfirm,
}: {
  action: 'Approve' | 'Reject';
  children: React.ReactNode;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to {action.toLowerCase()} this request?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will update the status of the refund request.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className={action === 'Reject' ? 'bg-destructive text-destructive-foreground' : ''}>
            {action}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
