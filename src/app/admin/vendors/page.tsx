
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const vendorsData = [
    { id: 'ven_001', name: 'Artisan Goods Co.', contact: 'contact@artisangoods.com', productCount: 5 },
    { id: 'ven_002', name: 'Global Imports', contact: 'sales@globalimports.net', productCount: 12 },
    { id: 'ven_003', name: 'The Leathercrafters', contact: 'info@theleathercrafters.com', productCount: 3 },
];

export default function VendorsPage() {
  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Vendors</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Vendor
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
                  <TableCell className="text-right">{vendor.productCount}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">View</Button>
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
