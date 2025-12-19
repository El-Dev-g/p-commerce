
'use server';

/**
 * @fileOverview This file defines a Genkit flow for fetching product categories from CJ Dropshipping.
 *
 * - getCjCategories: The main function to fetch categories.
 * - GetCjCategoriesOutput: The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CjCategorySchema = z.object({
    categoryFirstId: z.string(),
    categoryFirstName: z.string(),
    categorySecondId: z.string(),
    categorySecondName: z.string(),
    categoryThirdId: z.string().optional(),
    categoryThirdName: z.string().optional(),
});

const GetCjCategoriesOutputSchema = z.object({
  categories: z.array(CjCategorySchema).describe('The list of product categories from CJ Dropshipping.'),
});
export type GetCjCategoriesOutput = z.infer<typeof GetCjCategoriesOutputSchema>;


export async function getCjCategories(): Promise<GetCjCategoriesOutput> {
  return getCjCategoriesFlow();
}

const getCjCategoriesFlow = ai.defineFlow(
  {
    name: 'getCjCategoriesFlow',
    inputSchema: z.void(),
    outputSchema: GetCjCategoriesOutputSchema,
  },
  async () => {
    const apiKey = process.env.CJ_DROPSHIPPING_API_KEY;
    if (!apiKey) {
      throw new Error("CJ Dropshipping API key is not configured in .env file.");
    }
    
    const response = await fetch('https://developers.cjdropshipping.com/api/product/getCategory', {
        method: 'GET',
        headers: {
            'Cj-Access-Token': apiKey,
        },
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`CJ Dropshipping API request failed: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const result = await response.json();
    if (!result.result) {
        throw new Error(result.message || 'Failed to fetch categories from CJ API.');
    }

    return { categories: result.data };
  }
);
