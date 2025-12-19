
'use server';

/**
 * @fileOverview This file defines a Genkit flow for fetching tracking information from CJ Dropshipping.
 *
 * - getCjTrackingInfo: The main function to fetch tracking details.
 * - GetCjTrackingInfoInput: The input type for the function.
 * - GetCjTrackingInfoOutput: The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getAccessToken } from '@/lib/cj-token-service';

const GetCjTrackingInfoInputSchema = z.object({
  trackNumber: z.string().describe('The tracking number of the shipment.'),
});
export type GetCjTrackingInfoInput = z.infer<typeof GetCjTrackingInfoInputSchema>;

// Define a flexible schema for the output as the structure can be complex.
const GetCjTrackingInfoOutputSchema = z.any().describe('The detailed tracking information for the shipment.');
export type GetCjTrackingInfoOutput = z.infer<typeof GetCjTrackingInfoOutputSchema>;

export async function getCjTrackingInfo(
  input: GetCjTrackingInfoInput
): Promise<GetCjTrackingInfoOutput> {
  return getCjTrackingInfoFlow(input);
}

const getCjTrackingInfoFlow = ai.defineFlow(
  {
    name: 'getCjTrackingInfoFlow',
    inputSchema: GetCjTrackingInfoInputSchema,
    outputSchema: GetCjTrackingInfoOutputSchema,
  },
  async (input) => {
    const accessToken = await getAccessToken();
    
    const response = await fetch(`https://developers.cjdropshipping.com/api2.0/v1/logistic/trackInfo?trackNumber=${input.trackNumber}`, {
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
        throw new Error(result.message || 'Failed to fetch tracking info from CJ API.');
    }

    return result.data;
  }
);
