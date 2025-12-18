
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
import { Edit, PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
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
import { toast } from '@/hooks/use-toast';

const variationsData = [
  { id: 'var_001', productId: 'prod_004', sku: 'SCRF-WL-RD-M', attributes: [ { name: 'color', value: 'Red' }, { name: 'size', value: 'Medium' } ], stock: 25, priceModifier: 0 },
  { id: 'var_002', productId: 'prod_004', sku: 'SCRF-WL-BL-M', attributes: [ { name: 'color', value: 'Blue' }, { name: 'size', value: 'Medium' } ], stock: 15, priceModifier: 0 },
  { id: 'var_003', productId: 'prod_003', sku: 'MUG-CRM-WHT-OS', attributes: [ { name: 'color', value: 'White' } ], stock: 50, priceModifier: 0 },
  { id: 'var_004', productId: 'prod_003', sku: 'MUG-CRM-BLK-OS', attributes: [ { name: 'color', value: 'Black' } ], stock: 40, priceModifier: 2.50 },
  { id: 'var_005', productId: 'prod_009', sku: 'TOTE-CNV-NAT-LG', attributes: [ { name: 'color', value: 'Natural' }, { name: 'size', value: 'Large' } ], stock: 100, priceModifier: 0 },
  { id: 'var_006', productId: 'prod_002', sku: 'JRNL-LTH-BRN-SM', attributes: [ { name: 'color', value: 'Brown' }, { name: 'size', value: 'Small' } ], stock: 30, priceModifier: -5.00 },
  { id: 'var_007', productId: 'prod_002', sku: 'JRNL-LTH-BRN-LG', attributes: [ { name: 'color', value: 'Brown' }, { name: 'size', value: 'Large' } ], stock: 20, priceModifier: 5.00 },
];

export default function VariationsPage() {
  const [variations, setVariations] = useState(variationsData);

  const handleDeleteVariation = (variationId: string) => {
    // In a real app, you would make an API call to delete the variation
    // For this prototype, we'll just filter it from the local state
    setVariations(prev => prev.filter(v => v.id !== variationId));
    toast({
        title: "Variation Deleted",
        description: "The variation has been removed.",
    });
  }

  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Variations & SKUs</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Variation
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Product Variations</CardTitle>
          <CardDescription>Manage SKUs, stock, and pricing for product variants.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product ID</TableHead>
                <TableHead>Attributes</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Price Modifier</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variations.map((variation) => (
                <TableRow key={variation.id}>
                  <TableCell className="font-medium">{variation.sku}</TableCell>
                  <TableCell>{variation.productId}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {variation.attributes.map((attr) => (
                        <Badge key={`${attr.name}-${attr.value}`} variant="secondary">
                          {attr.name}: {attr.value}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{variation.stock}</TableCell>
                  <TableCell className="text-right">
                    {variation.priceModifier !== 0 ? (
                        `${variation.priceModifier > 0 ? '+' : ''}$${variation.priceModifier.toFixed(2)}`
                    ) : (
                        '-'
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/products/edit/${variation.productId}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit variation</span>
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete variation</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the variation.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteVariation(variation.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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
