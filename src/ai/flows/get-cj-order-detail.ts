
'use server';

/**
 * @fileOverview This file defines a Genkit flow for fetching order details from CJ Dropshipping.
 *
 * - getCjOrderDetail: The main function to fetch order details.
 * - GetCjOrderDetailInput: The input type for the function.
 * - GetCjOrderDetailOutput: The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getAccessToken } from '@/lib/cj-token-service';

const GetCjOrderDetailInputSchema = z.object({
  orderId: z.string().describe('The CJ Dropshipping order ID.'),
});
export type GetCjOrderDetailInput = z.infer<typeof GetCjOrderDetailInputSchema>;

// Define a flexible schema for the output since the API response can be complex.
const GetCjOrderDetailOutputSchema = z.any().describe('The detailed information about the CJ Dropshipping order.');
export type GetCjOrderDetailOutput = z.infer<typeof GetCjOrderDetailOutputSchema>;


export async function getCjOrderDetail(
  input: GetCjOrderDetailInput
): Promise<GetCjOrderDetailOutput> {
  return getCjOrderDetailFlow(input);
}


const getCjOrderDetailFlow = ai.defineFlow(
  {
    name: 'getCjOrderDetailFlow',
    inputSchema: GetCjOrderDetailInputSchema,
    outputSchema: GetCjOrderDetailOutputSchema,
  },
  async (input) => {
    const accessToken = await getAccessToken();
    
    const response = await fetch('https://developers.cjdropshipping.com/api2.0/v1/order/getOrderDetail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cj-Access-Token': accessToken,
        },
        body: JSON.stringify({
            orderId: input.orderId,
        })
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`CJ Dropshipping API request failed: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const result = await response.json();
    if (!result.result) {
        throw new Error(result.message || 'Failed to fetch order details from CJ API.');
    }

    return result.data;
  }
);
