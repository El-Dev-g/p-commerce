
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
import { CheckCircle, XCircle, Sparkles, Loader2, BrainCircuit } from 'lucide-react';
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
import { analyzeRefunds } from '@/ai/flows/analyze-refunds';
import type { AnalyzeRefundsOutput } from '@/ai/flows/analyze-refunds';
import { products } from '@/lib/products';

const refundRequestsData = [
    { id: 'REF001', orderId: 'ORD003', customer: 'Noah Williams', date: '2023-11-25', reason: 'Item arrived damaged', status: 'Pending', productId: 'prod_003' },
    { id: 'REF002', orderId: 'ORD005', customer: 'James Jones', date: '2023-11-24', reason: 'Changed my mind', status: 'Pending', productId: 'prod_005' },
    { id: 'REF003', orderId: 'ORD001', customer: 'Liam Johnson', date: '2023-11-23', reason: 'Received wrong item', status: 'Approved', productId: 'prod_001' },
    { id: 'REF004', orderId: 'ORD008', customer: 'Mason Davis', date: '2023-11-22', reason: 'Item not as described', status: 'Rejected', productId: 'prod_008' },
    { id: 'REF005', orderId: 'ORD002', customer: 'Olivia Smith', date: '2023-11-21', reason: 'Late delivery', status: 'Pending', productId: 'prod_002' },
    { id: 'REF006', orderId: 'ORD003', customer: 'Noah Williams', date: '2023-11-28', reason: 'Item arrived damaged', status: 'Pending', productId: 'prod_003' },
];

type RefundRequest = typeof refundRequestsData[0];

export default function RefundsPage() {
  const [refunds, setRefunds] = React.useState(refundRequestsData);
  const [analysis, setAnalysis] = React.useState<AnalyzeRefundsOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleStatusChange = (refundId: string, newStatus: 'Approved' | 'Rejected') => {
    setRefunds(prevRefunds =>
      prevRefunds.map(refund =>
        refund.id === refundId ? { ...refund, status: newStatus } : refund
      )
    );
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
        const refundInput = refunds.map(r => {
            const product = products.find(p => p.id === r.productId);
            return {
                reason: r.reason,
                productName: product?.name || 'Unknown Product',
                category: product?.category || 'Unknown',
            };
        });
        const result = await analyzeRefunds({ refunds: refundInput });
        setAnalysis(result);
    } catch (error) {
        console.error("Refund analysis failed:", error);
    } finally {
        setIsLoading(false);
    }
  }

  return (
     <main className="flex-1 p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Refund Requests</h1>
        <Button onClick={handleAnalyze} disabled={isLoading}>
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Sparkles className="mr-2 h-4 w-4" />
            )}
            Analyze Refunds
        </Button>
      </div>

      {analysis && (
          <Card className="mb-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-300">
                    <BrainCircuit /> AI Refund Analysis
                  </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div>
                      <h4 className="font-semibold">Summary</h4>
                      <p className="text-sm text-muted-foreground">{analysis.summary}</p>
                  </div>
                   <div>
                      <h4 className="font-semibold">Common Reasons</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {analysis.commonReasons.map(reason => <Badge key={reason} variant="secondary">{reason}</Badge>)}
                      </div>
                  </div>
                  <div>
                      <h4 className="font-semibold">Problematic Products</h4>
                       <div className="flex flex-wrap gap-2 mt-2">
                        {analysis.problematicProducts.map(product => <Badge key={product} variant="destructive">{product}</Badge>)}
                      </div>
                  </div>
              </CardContent>
          </Card>
      )}

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
