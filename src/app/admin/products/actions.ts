
'use server';

import { revalidatePath } from 'next/cache';
import { products } from '@/lib/products';
import type { Product } from '@/lib/types';
import type { z } from 'zod';
import type { productSchema } from '../products/product-form';

// CREATE (This is handled by importProductAction and the manual creation form)

// READ (This is handled by getProducts in lib/products.ts and page-level fetching)

// UPDATE
export async function updateProductAction(
  productId: string,
  data: z.infer<typeof productSchema>
): Promise<{ success: boolean; error?: string }> {
  try {
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      return { success: false, error: 'Product not found.' };
    }

    const updatedProduct: Product = {
      ...products[productIndex],
      name: data.name,
      nameB: data.nameB,
      description: data.description,
      price: data.price,
      category: data.category,
      image: data.image,
      variations: data.variations,
    };

    products[productIndex] = updatedProduct;

    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/edit/${productId}`);

    return { success: true };
  } catch (e) {
    const error = e as Error;
    console.error('Failed to update product:', error);
    return { success: false, error: error.message };
  }
}

// DELETE
export async function deleteProductAction(
  productId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      return { success: false, error: 'Product not found.' };
    }

    products.splice(productIndex, 1);

    revalidatePath('/admin/products');

    return { success: true };
  } catch (e) {
    const error = e as Error;
    console.error('Failed to delete product:', error);
    return { success: false, error: error.message };
  }
}

    