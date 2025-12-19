
'use server';

/**
 * @fileOverview This file defines a Genkit flow for fetching product categories from CJ Dropshipping.
 *
 * - getCjCategories: The main function to fetch categories.
 * - GetCjCategoriesOutput: The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getAccessToken } from '@/lib/cj-token-service';

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
    const accessToken = await getAccessToken();
    
    const response = await fetch('https://developers.cjdropshipping.com/api2.0/v1/product/getCategory', {
        method: 'GET',
        headers: {
            'Cj-Access-Token': accessToken,
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

    // Flatten the nested category structure
    const flattenedCategories: z.infer<typeof CjCategorySchema>[] = [];
    result.data.forEach((cat1: any) => {
        cat1.categoryFirstList?.forEach((cat2: any) => {
            if (cat2.categorySecondList && cat2.categorySecondList.length > 0) {
                 cat2.categorySecondList.forEach((cat3: any) => {
                    flattenedCategories.push({
                        categoryFirstId: cat1.categoryFirstId,
                        categoryFirstName: cat1.categoryFirstName,
                        categorySecondId: cat2.categorySecondId,
                        categorySecondName: cat2.categorySecondName,
                        categoryThirdId: cat3.categoryId,
                        categoryThirdName: cat3.categoryName,
                    });
                });
            } else {
                 flattenedCategories.push({
                    categoryFirstId: cat1.categoryFirstId,
                    categoryFirstName: cat1.categoryFirstName,
                    categorySecondId: cat2.categorySecondId,
                    categorySecondName: cat2.categorySecondName,
                });
            }
        });
    });

    return { categories: flattenedCategories };
  }
);
