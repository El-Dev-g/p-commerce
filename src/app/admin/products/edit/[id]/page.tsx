
'use client';

import { ProductForm } from '../../product-form';
import { products as allProducts } from '@/lib/products';
import { useParams, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';

export default function EditProductPage() {
  const params = useParams();
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundProduct = allProducts.find(p => p.id === id);
      setProduct(foundProduct || null);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return <main className="flex-1 p-6 md:p-8">Loading...</main>;
  }

  if (!product) {
    notFound();
  }

  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Edit Product</h1>
      </div>
      <ProductForm product={product} />
    </main>
  );
}
