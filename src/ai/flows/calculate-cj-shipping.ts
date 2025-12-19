
'use server';

/**
 * @fileOverview This file defines a Genkit flow for calculating shipping freight from CJ Dropshipping.
 *
 * - calculateCjShipping: The main function to calculate shipping costs.
 * - CalculateCjShippingInput: The input type for the function.
 * - CalculateCjShippingOutput: The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getAccessToken } from '@/lib/cj-token-service';

const CalculateCjShippingInputSchema = z.object({
  startCountryCode: z.string().describe('The country code of the origin warehouse (e.g., "US").'),
  endCountryCode: z.string().describe('The country code of the destination (e.g., "GB").'),
  products: z.array(z.object({
    vid: z.string().describe('The variant ID of the product.'),
    quantity: z.number().int().min(1).describe('The quantity of the variant.'),
  })).min(1).describe('The list of products and quantities to calculate shipping for.'),
});
export type CalculateCjShippingInput = z.infer<typeof CalculateCjShippingInputSchema>;

// Define a flexible schema for the output as the structure can be complex.
const CalculateCjShippingOutputSchema = z.any().describe('The calculated freight costs for different logistics options.');
export type CalculateCjShippingOutput = z.infer<typeof CalculateCjShippingOutputSchema>;

export async function calculateCjShipping(
  input: CalculateCjShippingInput
): Promise<CalculateCjShippingOutput> {
  return calculateCjShippingFlow(input);
}

const calculateCjShippingFlow = ai.defineFlow(
  {
    name: 'calculateCjShippingFlow',
    inputSchema: CalculateCjShippingInputSchema,
    outputSchema: CalculateCjShippingOutputSchema,
  },
  async (input) => {
    const accessToken = await getAccessToken();
    
    const response = await fetch('https://developers.cjdropshipping.com/api2.0/v1/logistic/freightCalculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cj-Access-Token': accessToken,
        },
        body: JSON.stringify(input)
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`CJ Dropshipping API request failed: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const result = await response.json();
    if (!result.result) {
        throw new Error(result.message || 'Failed to calculate shipping freight from CJ API.');
    }

    return result.data;
  }
);
