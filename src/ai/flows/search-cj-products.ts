
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
  categoryId: z.string().optional().describe('The ID of the category to search within.'),
});
export type SearchCjProductsInput = z.infer<typeof SearchCjProductsInputSchema>;

const CjProductSchema = z.object({
    pid: z.string(),
    productName: z.string(),
    description: z.string().optional().default(''),
    categoryName: z.string(),
    productImage: z.string().url(),
    sellPrice: z.string(), // Price comes as a string
    productSku: z.string(),
});

const CjApiResponseSchema = z.object({
    result: z.boolean(),
    message: z.string(),
    data: z.object({
        total: z.number(),
        records: z.array(CjProductSchema),
    }),
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
      throw new Error("CJ Dropshipping API key is not configured in .env file.");
    }
    
    const requestBody: any = {
        productName: input.query,
        pageNum: 1,
        pageSize: 10,
    };

    if (input.categoryId) {
        requestBody.categoryId = input.categoryId;
    }

    const response = await fetch('https://developers.cjdropshipping.com/api2.0/v1/product/list', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cj-Access-Token': apiKey,
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`CJ Dropshipping API request failed: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const rawData: unknown = await response.json();
    const validationResult = CjApiResponseSchema.safeParse(rawData);

    if (!validationResult.success || !validationResult.data.result) {
        console.error("CJ API response validation error:", validationResult.success ? validationResult.data.message : validationResult.error.flatten());
        throw new Error("Failed to parse response from CJ Dropshipping API or request was unsuccessful.");
    }

    const cjProducts = validationResult.data.data.records;

    const products = cjProducts.map(p => {
        const price = parseFloat(p.sellPrice);
        return {
            id: p.pid,
            title: p.productName,
            description: p.description || 'No description available.',
            category: p.categoryName,
            imageUrl: p.productImage,
            price: isNaN(price) ? 0 : price,
            variants: [{
                sku: p.productSku,
                attributes: [],
                price: isNaN(price) ? 0 : price,
                stock: 99, // CJ API does not provide stock in list view, defaulting to 99
            }]
        }
    });

    return { products };
  }
);
