'use server';

/**
 * @fileOverview AI-powered product search using natural language.
 *
 * - searchProducts - A function that returns product recommendations based on a search query.
 * - SearchProductsInput - The input type for the searchProducts function.
 * - SearchProductsOutput - The return type for the searchProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { products } from '@/lib/products';
import type { Product } from '@/lib/types';


const SearchableProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
});

const SearchProductsInputSchema = z.object({
  query: z.string().describe('The user\'s search query.'),
  products: z.array(SearchableProductSchema).describe('A list of available products to search from.'),
});
export type SearchProductsInput = z.infer<typeof SearchProductsInputSchema>;

const SearchProductsOutputSchema = z.object({
  productIds: z.array(
    z.string().describe('The ID of a recommended product.')
  ).describe('A list of product IDs that best match the search query.'),
});
export type SearchProductsOutput = z.infer<typeof SearchProductsOutputSchema>;

export async function searchProducts(query: string, allProducts: Product[]): Promise<SearchProductsOutput> {
    const searchableProducts = allProducts.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
    }));

  return searchProductsFlow({ query, products: searchableProducts });
}

const prompt = ai.definePrompt({
  name: 'searchProductsPrompt',
  input: {schema: SearchProductsInputSchema},
  output: {schema: SearchProductsOutputSchema},
  prompt: `You are a helpful e-commerce search assistant for an online store called Curated Finds.

  A user has provided the following search query: "{{query}}"

  Based on this query, please find the most relevant products from the following list. Analyze the user's intent. For example, if they search for "a gift for a writer," you should look for items related to writing like journals or pens.

  Available Products:
  {{#each products}}
  - ID: {{{id}}}, Name: {{{name}}}, Category: {{{category}}}, Description: {{{description}}}
  {{/each}}

  Return only an array of the product IDs that are the best matches for the query.
  `, 
});

const searchProductsFlow = ai.defineFlow(
  {
    name: 'searchProductsFlow',
    inputSchema: SearchProductsInputSchema,
    outputSchema: SearchProductsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
