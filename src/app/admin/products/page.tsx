
'use client';

import Image from 'next/image';
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
import { Input } from '@/components/ui/input';
import { Edit, PlusCircle, Trash2, Search, Loader2 } from 'lucide-react';
import { getProducts, products as allProducts } from '@/lib/products';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { useDebounce } from '@/hooks/use-debounce';
import { searchProducts } from '@/ai/flows/search-products';

function ProductTable({ products }: { products: Product[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <Image
                src={product.image.src}
                alt={product.image.alt}
                width={64}
                height={64}
                className="rounded-md object-cover"
              />
            </TableCell>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>
              <Badge variant="secondary">{product.category}</Badge>
            </TableCell>
            <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
            <TableCell className="text-center">
              <div className="flex justify-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/admin/products/edit/${product.id}`}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit product</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete product</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchQuery) {
        setIsSearching(true);
        try {
          const result = await searchProducts(debouncedSearchQuery, allProducts);
          const filteredProducts = allProducts.filter(p => result.productIds.includes(p.id));
          setProducts(filteredProducts);
        } catch (error) {
          console.error("AI search failed:", error);
          setProducts(allProducts.filter(p => p.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())));
        } finally {
          setIsSearching(false);
        }
      } else {
        setProducts(allProducts);
      }
    };
    performSearch();
  }, [debouncedSearchQuery]);

  return (
     <main className="flex-1 p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <div className="flex justify-between items-center">
            <CardDescription>View and manage all products in your store.</CardDescription>
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="AI-powered search..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                 {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ProductTable products={products} />
        </CardContent>
      </Card>
     </main>
  );
}
