
'use server';

import { revalidatePath } from 'next/cache';
import { products } from '@/lib/products';
import type { Product } from '@/lib/types';
import type { SearchCjProductsOutput } from '@/ai/flows/search-cj-products';

// This is a mock action. In a real app, this would write to a database.
export async function importProductAction(productToImport: SearchCjProductsOutput['products'][0]): Promise<{ success: boolean; error?: string }> {
  try {
    const newProduct: Product = {
      id: `prod_${Math.floor(Math.random() * 100000)}`,
      name: productToImport.title,
      description: productToImport.description,
      price: productToImport.price, // Price is now a number
      category: productToImport.category,
      image: {
        src: productToImport.imageUrl,
        alt: productToImport.title,
        'data-ai-hint': 'imported product',
      },
      variations: productToImport.variants?.map((v, i) => ({
        id: `var_${Math.floor(Math.random() * 100000)}`,
        attributes: v.attributes,
        stock: v.stock,
        // The price from CJ is the base price of the variant, so modifier is 0 relative to that.
        priceModifier: 0, 
        sku: v.sku,
      })),
    };

    // Add the new product to our mock database
    products.unshift(newProduct);
    
    // Revalidate the products page to show the new product
    revalidatePath('/admin/products');

    return { success: true };
  } catch (e) {
    const error = e as Error;
    console.error('Failed to import product:', error);
    return { success: false, error: error.message };
  }
}
