
'use server';

/**
 * @fileOverview This file defines a Genkit flow for automatically tagging orders.
 *
 * - `tagOrder`: The main function to generate tags for an order.
 * - `TagOrderInput`: The input type for the `tagOrder` function.
 * - `TagOrderOutput`: The output type for the `tagOrder` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ProductInfoSchema = z.object({
  name: z.string(),
  category: z.string(),
  price: z.number(),
});

const TagOrderInputSchema = z.object({
  orderItems: z.array(ProductInfoSchema).describe('The items in the order.'),
  totalAmount: z.number().describe('The total amount of the order.'),
});
export type TagOrderInput = z.infer<typeof TagOrderInputSchema>;

const TagOrderOutputSchema = z.object({
  tags: z.array(z.enum(['High-Value', 'Fragile', 'Gift', 'Apparel', 'Electronics', 'Home Goods']))
    .describe('An array of relevant tags for the order.'),
});
export type TagOrderOutput = z.infer<typeof TagOrderOutputSchema>;

export async function tagOrder(
  input: TagOrderInput
): Promise<TagOrderOutput> {
  return tagOrderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tagOrderPrompt',
  input: { schema: TagOrderInputSchema },
  output: { schema: TagOrderOutputSchema },
  prompt: `You are an expert in e-commerce order management.

  Based on the items and total amount of the order, generate a list of relevant tags from the available options.

  Order Items:
  {{#each orderItems}}
  - Name: {{{name}}}, Category: {{{category}}}, Price: {{{price}}}
  {{/each}}

  Total Amount: {{{totalAmount}}}

  Consider the following when tagging:
  - 'High-Value' if the total is over $200.
  - 'Fragile' for categories like 'Home Goods' or 'Collectibles' that might contain breakable items.
  - 'Gift' if the items seem like they could be for a gift (e.g., high-end stationery, collectibles).
  - Add tags based on the categories of the products.
  `,
});

const tagOrderFlow = ai.defineFlow(
  {
    name: 'tagOrderFlow',
    inputSchema: TagOrderInputSchema,
    outputSchema: TagOrderOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
