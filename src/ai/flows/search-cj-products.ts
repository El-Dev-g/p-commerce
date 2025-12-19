
'use server';

/**
 * @fileOverview This file defines a Genkit flow for searching for products from CJ Dropshipping.
 *
 * - searchCjProducts: The main function to search for products.
 * - SearchCjProductsInput: The input type for the searchCjProducts function.
 * - SearchCjProductsOutput: The output type for the searchCjProducts function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SearchCjProductsInputSchema = z.object({
  query: z.string().describe('The search query for products.'),
});
export type SearchCjProductsInput = z.infer<typeof SearchCjProductsInputSchema>;

const CjProductSchema = z.object({
    pid: z.string(),
    productName: z.string(),
    description: z.string().optional().default(''),
    categoryName: z.string(),
    productImage: z.string().url(),
    sellPrice: z.number(),
    productSku: z.string(),
});

const CjApiResponseSchema = z.object({
    code: z.number(),
    message: z.string(),
    data: z.array(CjProductSchema),
});


const SearchCjProductsOutputSchema = z.object({
  products: z.array(
    z.object({
      id: z.string().describe('The unique ID of the product from the supplier.'),
      title: z.string().describe('The title of the product.'),
      description: z.string().describe('The product description.'),
      category: z.string().describe('The product category.'),
      imageUrl: z.string().url().describe('The URL of the main product image.'),
      price: z.number().describe('The wholesale price of the product.'),
      variants: z.array(z.object({
        sku: z.string().describe('The SKU of the variant.'),
        attributes: z.array(z.object({
            name: z.string().describe('e.g., Color'),
            value: z.string().describe('e.g., Red'),
        })).describe('The attributes of the variant.'),
        price: z.number().describe('The price of the variant.'),
        stock: z.number().describe('The available stock for the variant.'),
      })).optional().describe('An array of product variants (e.g., sizes, colors).'),
    })
  ).describe('A list of products matching the search query.'),
});
export type SearchCjProductsOutput = z.infer<typeof SearchCjProductsOutputSchema>;

export async function searchCjProducts(
  input: SearchCjProductsInput
): Promise<SearchCjProductsOutput> {
  return searchCjProductsFlow(input);
}


const searchCjProductsFlow = ai.defineFlow(
  {
    name: 'searchCjProductsFlow',
    inputSchema: SearchCjProductsInputSchema,
    outputSchema: SearchCjProductsOutputSchema,
  },
  async (input) => {
    const apiKey = process.env.CJ_DROPSHIPPING_API_KEY;
    if (!apiKey) {
      throw new Error("CJ Dropshipping API key is not configured.");
    }
    
    const response = await fetch('https://developers.cjdropshipping.com/api/v1/product/list', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'CJ-Access-Token': apiKey,
        },
        body: JSON.stringify({
            productName: input.query,
            pageSize: 10,
        })
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`CJ Dropshipping API request failed: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const rawData: unknown = await response.json();
    const validationResult = CjApiResponseSchema.safeParse(rawData);

    if (!validationResult.success) {
        console.error("CJ API response validation error:", validationResult.error.flatten());
        throw new Error("Failed to parse response from CJ Dropshipping API.");
    }

    const { data: cjProducts } = validationResult.data;

    const products = cjProducts.map(p => ({
        id: p.pid,
        title: p.productName,
        description: p.description || 'No description available.',
        category: p.categoryName,
        imageUrl: p.productImage,
        price: p.sellPrice,
        variants: [{
            sku: p.productSku,
            attributes: [],
            price: p.sellPrice,
            stock: 99, // CJ API does not seem to provide stock in list view, defaulting to 99
        }]
    }));

    return { products };
  }
);
