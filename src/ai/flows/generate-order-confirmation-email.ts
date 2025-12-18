
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating order confirmation emails.
 *
 * - `generateOrderConfirmationEmail`: The main function to generate the email content.
 * - `GenerateOrderConfirmationEmailInput`: The input type for the function.
 * - `GenerateOrderConfirmationEmailOutput`: The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CartItemSchema = z.object({
  productName: z.string(),
  quantity: z.number(),
  price: z.number(),
});

export const GenerateOrderConfirmationEmailInputSchema = z.object({
  customerName: z.string().describe('The name of the customer.'),
  orderId: z.string().describe('The unique ID of the order.'),
  cartItems: z.array(CartItemSchema).describe('A list of items in the order.'),
  total: z.number().describe('The total amount of the order.'),
});
export type GenerateOrderConfirmationEmailInput = z.infer<
  typeof GenerateOrderConfirmationEmailInputSchema
>;

const GenerateOrderConfirmationEmailOutputSchema = z.object({
  subject: z.string().describe('The generated subject line for the email.'),
  body: z.string().describe('The generated body of the email in HTML format.'),
});
export type GenerateOrderConfirmationEmailOutput = z.infer<
  typeof GenerateOrderConfirmationEmailOutputSchema
>;

export async function generateOrderConfirmationEmail(
  input: GenerateOrderConfirmationEmailInput
): Promise<GenerateOrderConfirmationEmailOutput> {
  return generateOrderConfirmationEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateOrderConfirmationEmailPrompt',
  input: { schema: GenerateOrderConfirmationEmailInputSchema },
  output: { schema: GenerateOrderConfirmationEmailOutputSchema },
  prompt: `You are a helpful e-commerce assistant for a store called "Curated Finds".

  Your task is to generate a friendly and professional order confirmation email. The output should be in HTML.

  - Start with a warm greeting to the customer.
  - Clearly state the order ID.
  - List the items in the order in a simple, clean format (a table is not necessary, simple paragraphs or a list is fine).
  - Include the total price.
  - End with a thank you message and mention that they will receive another notification when the order ships.
  - Do not include any product links.

  Order Details:
  Customer Name: {{{customerName}}}
  Order ID: {{{orderId}}}
  Total: {{{total}}}

  Items:
  {{#each cartItems}}
  - {{{this.quantity}}}x {{{this.productName}}} (\${{{this.price}}})
  {{/each}}
  `,
});

const generateOrderConfirmationEmailFlow = ai.defineFlow(
  {
    name: 'generateOrderConfirmationEmailFlow',
    inputSchema: GenerateOrderConfirmationEmailInputSchema,
    outputSchema: GenerateOrderConfirmationEmailOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
