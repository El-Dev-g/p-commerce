
'use server';

/**
 * @fileOverview This file defines a Genkit flow for fetching variant details from CJ Dropshipping.
 *
 * - getCjVariantDetails: The main function to fetch variant details.
 * - GetCjVariantDetailsInput: The input type for the function.
 * - GetCjVariantDetailsOutput: The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetCjVariantDetailsInputSchema = z.object({
  vid: z.string().describe('The Variant ID (vid) from CJ Dropshipping.'),
});
export type GetCjVariantDetailsInput = z.infer<typeof GetCjVariantDetailsInputSchema>;

// Define a flexible schema for the output as the structure can be complex.
const GetCjVariantDetailsOutputSchema = z.any().describe('The detailed information for the specified variant.');
export type GetCjVariantDetailsOutput = z.infer<typeof GetCjVariantDetailsOutputSchema>;

export async function getCjVariantDetails(
  input: GetCjVariantDetailsInput
): Promise<GetCjVariantDetailsOutput> {
  return getCjVariantDetailsFlow(input);
}

const getCjVariantDetailsFlow = ai.defineFlow(
  {
    name: 'getCjVariantDetailsFlow',
    inputSchema: GetCjVariantDetailsInputSchema,
    outputSchema: GetCjVariantDetailsOutputSchema,
  },
  async (input) => {
    const apiKey = process.env.CJ_DROPSHIPPING_API_KEY;
    if (!apiKey) {
      throw new Error("CJ Dropshipping API key is not configured in .env file.");
    }
    
    const response = await fetch(`https://developers.cjdropshipping.com/api2.0/v1/product/variant/queryByVid?vid=${input.vid}`, {
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
        throw new Error(result.message || 'Failed to fetch variant details from CJ API.');
    }

    return result.data;
  }
);
