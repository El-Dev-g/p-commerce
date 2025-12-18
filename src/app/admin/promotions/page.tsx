
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

const promotionsData = [
  { id: 'promo_001', code: 'SUMMER20', description: '20% off all orders', status: 'Active' },
  { id: 'promo_002', code: 'FREESHIP', description: 'Free shipping on orders over $50', status: 'Active' },
  { id: 'promo_003', code: 'WINTER10', description: '10% off winter collection', status: 'Expired' },
];

export default function PromotionsPage() {

  const handleEditClick = (promoId: string) => {
    toast({
      title: 'Edit Promotion',
      description: `This would open an editor for promotion ${promoId}.`,
    });
  };

  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Promotions</h1>
        <Button asChild>
          <Link href="/admin/promotions/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Promotion
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Promotions</CardTitle>
          <CardDescription>View and manage all your discount codes and promotions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotionsData.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell className="font-medium">{promo.code}</TableCell>
                  <TableCell>{promo.description}</TableCell>
                  <TableCell>
                    <Badge variant={promo.status === 'Active' ? 'default' : 'secondary'}>{promo.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(promo.id)}>Edit</Button>
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
