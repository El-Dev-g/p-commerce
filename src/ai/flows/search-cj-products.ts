
'use server';

/**
 * @fileOverview This file defines a Genkit flow for searching for products from a mock dropshipping supplier.
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

const prompt = ai.definePrompt({
  name: 'searchCjProductsPrompt',
  input: { schema: SearchCjProductsInputSchema },
  output: { schema: SearchCjProductsOutputSchema },
  prompt: `You are a product sourcing agent for a dropshipping business.
  A user is searching for products to sell in their store.

  Given the search query "{{query}}", generate a realistic list of 5-7 mock products that would be found on a platform like CJ Dropshipping.

  For each product:
  - Create a plausible title, description, category, and wholesale price.
  - Generate a placeholder image URL using "https://picsum.photos/seed/{a-random-word}/400/400".
  - For some products, include a few variants (e.g., different colors or sizes) with their own SKU, price, and stock levels.
  - The variant price should be the final price for that variant.
  `,
});

const searchCjProductsFlow = ai.defineFlow(
  {
    name: 'searchCjProductsFlow',
    inputSchema: SearchCjProductsInputSchema,
    outputSchema: SearchCjProductsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
