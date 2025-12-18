
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { products } from '@/lib/products';

const vendorsData = [
    { id: 'ven_001', name: 'Artisan Goods Co.', contact: 'contact@artisangoods.com', productIds: ['prod_002', 'prod_003', 'prod_007'] },
    { id: 'ven_002', name: 'Global Imports', contact: 'sales@globalimports.net', productIds: ['prod_001', 'prod_005', 'prod_008'] },
    { id: 'ven_003', name: 'The Woolen Mill', contact: 'info@thewoolenmill.com', productIds: ['prod_004'] },
];

export default function VendorsPage() {
  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Vendors</h1>
        <Button asChild>
          <Link href="/admin/vendors/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Vendor
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Vendors</CardTitle>
          <CardDescription>Manage your product suppliers and vendors.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor Name</TableHead>
                <TableHead>Contact Email</TableHead>
                <TableHead className="text-right">Products</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendorsData.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>{vendor.contact}</TableCell>
                  <TableCell className="text-right">{vendor.productIds.length}</TableCell>
                  <TableCell>
                    <VendorDetailsDialog vendor={vendor} />
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

function VendorDetailsDialog({ vendor }: { vendor: typeof vendorsData[0] }) {
    const vendorProducts = products.filter(p => vendor.productIds.includes(p.id));

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">View</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{vendor.name}</DialogTitle>
                    <DialogDescription>{vendor.contact}</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <h4 className="font-semibold mb-2">Products from this vendor:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {vendorProducts.map(p => (
                            <li key={p.id}>{p.name}</li>
                        ))}
                    </ul>
                </div>
            </DialogContent>
        </Dialog>
    );
}
