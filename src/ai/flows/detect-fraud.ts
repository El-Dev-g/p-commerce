
'use server';

/**
 * @fileOverview This file defines a Genkit flow for detecting potentially fraudulent orders.
 *
 * - `detectFraud`: The main function to analyze an order for fraud risk.
 * - `DetectFraudInput`: The input type for the `detectFraud` function.
 * - `DetectFraudOutput`: The output type for the `detectFraud` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DetectFraudInputSchema = z.object({
  orderTotal: z.number(),
  billingAddress: z.string(),
  shippingAddress: z.string(),
  customerHistory: z.object({
    orderCount: z.number(),
    isNew: z.boolean(),
  }),
});
export type DetectFraudInput = z.infer<typeof DetectFraudInputSchema>;

const DetectFraudOutputSchema = z.object({
  isFraudulent: z.boolean().describe('Whether the order is likely fraudulent.'),
  riskScore: z.number().min(0).max(100).describe('A risk score from 0 to 100.'),
  reason: z.string().describe('The reason for the fraud assessment.'),
});
export type DetectFraudOutput = z.infer<typeof DetectFraudOutputSchema>;

export async function detectFraud(
  input: DetectFraudInput
): Promise<DetectFraudOutput> {
  return detectFraudFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectFraudPrompt',
  input: { schema: DetectFraudInputSchema },
  output: { schema: DetectFraudOutputSchema },
  prompt: `You are a fraud detection expert for an e-commerce company.

  Analyze the following order details and determine if it is likely to be fraudulent.

  - Order Total: {{{orderTotal}}}
  - Billing Address: {{{billingAddress}}}
  - Shipping Address: {{{shippingAddress}}}
  - New Customer: {{{customerHistory.isNew}}}
  - Previous Orders: {{{customerHistory.orderCount}}}

  Consider these factors for high risk:
  - Mismatched billing and shipping addresses.
  - Unusually large order total, especially for a new customer.
  - Use of freight forwarders or temporary addresses.
  `,
});

const detectFraudFlow = ai.defineFlow(
  {
    name: 'detectFraudFlow',
    inputSchema: DetectFraudInputSchema,
    outputSchema: DetectFraudOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
