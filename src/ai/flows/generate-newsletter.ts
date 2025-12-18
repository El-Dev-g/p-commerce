'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating newsletter content.
 *
 * - `generateNewsletter`: The main function to generate a newsletter.
 * - `GenerateNewsletterInput`: The input type for the `generateNewsletter` function.
 * - `GenerateNewsletterOutput`: The output type for the `generateNewsletter` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ProductInfoSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
});

const GenerateNewsletterInputSchema = z.object({
  topic: z.string().describe('The main topic or theme of the newsletter.'),
  featuredProducts: z.array(ProductInfoSchema).optional().describe('A list of products to feature in the newsletter.'),
});
export type GenerateNewsletterInput = z.infer<typeof GenerateNewsletterInputSchema>;

const GenerateNewsletterOutputSchema = z.object({
  subject: z.string().describe('The generated subject line for the newsletter.'),
  body: z.string().describe('The generated body of the newsletter in Markdown format.'),
});
export type GenerateNewsletterOutput = z.infer<typeof GenerateNewsletterOutputSchema>;

export async function generateNewsletter(
  input: GenerateNewsletterInput
): Promise<GenerateNewsletterOutput> {
  return generateNewsletterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNewsletterPrompt',
  input: { schema: GenerateNewsletterInputSchema },
  output: { schema: GenerateNewsletterOutputSchema },
  prompt: `You are an expert marketing copywriter for an e-commerce store called "Curated Finds".

  Your task is to write a compelling newsletter based on a given topic and a list of featured products.

  The tone should be engaging, friendly, and promotional. The output should be in Markdown.

  Topic: {{{topic}}}

  {{#if featuredProducts}}
  Featured Products:
  {{#each featuredProducts}}
  - Name: {{{name}}}
    Description: {{{description}}}
    Price: {{{price}}}
  {{/each}}
  {{/if}}

  Generate an exciting subject line and a newsletter body that highlights the topic and seamlessly integrates the featured products.
  `,
});

const generateNewsletterFlow = ai.defineFlow(
  {
    name: 'generateNewsletterFlow',
    inputSchema: GenerateNewsletterInputSchema,
    outputSchema: GenerateNewsletterOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
