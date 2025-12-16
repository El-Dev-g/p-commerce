'use server';

/**
 * @fileOverview AI-powered product recommendations based on browsing history and cart items.
 *
 * - getProductRecommendations - A function that provides product recommendations.
 * - GetProductRecommendationsInput - The input type for the getProductRecommendations function.
 * - GetProductRecommendationsOutput - The return type for the getProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetProductRecommendationsInputSchema = z.object({
  browsingHistory: z.array(
    z.string().describe('The IDs of products the customer has viewed')
  ).optional().describe('Customer browsing history product IDs, optional.'),
  cartItems: z.array(
    z.string().describe('The IDs of products currently in the cart')
  ).optional().describe('Customer cart item product IDs, optional.'),
  numberOfRecommendations: z.number().default(3).describe('Number of product recommendations to return.'),
});
export type GetProductRecommendationsInput = z.infer<typeof GetProductRecommendationsInputSchema>;

const GetProductRecommendationsOutputSchema = z.object({
  productRecommendations: z.array(
    z.string().describe('Recommended product IDs')
  ).describe('List of recommended product IDs based on browsing history and cart items.'),
});
export type GetProductRecommendationsOutput = z.infer<typeof GetProductRecommendationsOutputSchema>;

export async function getProductRecommendations(input: GetProductRecommendationsInput): Promise<GetProductRecommendationsOutput> {
  return getProductRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getProductRecommendationsPrompt',
  input: {schema: GetProductRecommendationsInputSchema},
  output: {schema: GetProductRecommendationsOutputSchema},
  prompt: `You are an expert product recommendation engine for an online store.

  Based on the customer's browsing history and items currently in their cart, recommend {{numberOfRecommendations}} relevant products that they might be interested in.

  Return only a list of product IDs.  Do not include any other text.

  Browsing History: {{#if browsingHistory}}{{{browsingHistory}}}{{else}}No browsing history{{/if}}
  Cart Items: {{#if cartItems}}{{{cartItems}}}{{else}}No cart items{{/if}}
  `, 
});

const getProductRecommendationsFlow = ai.defineFlow(
  {
    name: 'getProductRecommendationsFlow',
    inputSchema: GetProductRecommendationsInputSchema,
    outputSchema: GetProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
