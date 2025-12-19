
'use server';

/**
 * @fileOverview This file defines a Genkit flow for fetching product reviews from CJ Dropshipping.
 *
 * - getCjProductReviews: The main function to fetch product reviews.
 * - GetCjProductReviewsInput: The input type for the function.
 * - GetCjProductReviewsOutput: The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetCjProductReviewsInputSchema = z.object({
  pid: z.string().describe('The Product ID (pid) from CJ Dropshipping.'),
  pageSize: z.number().int().min(1).max(100).default(10).describe('Number of reviews per page.'),
  pageNum: z.number().int().min(1).default(1).describe('The page number to retrieve.'),
});
export type GetCjProductReviewsInput = z.infer<typeof GetCjProductReviewsInputSchema>;

// Define a flexible schema for the output as the structure can be complex.
const GetCjProductReviewsOutputSchema = z.any().describe('The list of product reviews.');
export type GetCjProductReviewsOutput = z.infer<typeof GetCjProductReviewsOutputSchema>;

export async function getCjProductReviews(
  input: GetCjProductReviewsInput
): Promise<GetCjProductReviewsOutput> {
  return getCjProductReviewsFlow(input);
}

const getCjProductReviewsFlow = ai.defineFlow(
  {
    name: 'getCjProductReviewsFlow',
    inputSchema: GetCjProductReviewsInputSchema,
    outputSchema: GetCjProductReviewsOutputSchema,
  },
  async (input) => {
    const apiKey = process.env.CJ_DROPSHIPPING_API_KEY;
    if (!apiKey) {
      throw new Error("CJ Dropshipping API key is not configured in .env file.");
    }
    
    const response = await fetch('https://developers.cjdropshipping.com/api2.0/v1/product/productComments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cj-Access-Token': apiKey,
        },
        body: JSON.stringify(input)
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`CJ Dropshipping API request failed: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const result = await response.json();
    if (!result.result) {
        throw new Error(result.message || 'Failed to fetch product reviews from CJ API.');
    }

    return result.data;
  }
);
