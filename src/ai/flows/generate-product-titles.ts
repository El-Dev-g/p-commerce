'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating product titles based on a product description and category.
 *
 * generateProductTitles - A function that generates product titles.
 * GenerateProductTitlesInput - The input type for the generateProductTitles function.
 * GenerateProductTitlesOutput - The output type for the generateProductTitles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductTitlesInputSchema = z.object({
  description: z.string().describe('The description of the product.'),
  category: z.string().describe('The category of the product.'),
});
export type GenerateProductTitlesInput = z.infer<
  typeof GenerateProductTitlesInputSchema
>;

const GenerateProductTitlesOutputSchema = z.object({
  titles: z
    .array(z.string())
    .describe('An array of generated product titles.'),
});
export type GenerateProductTitlesOutput = z.infer<
  typeof GenerateProductTitlesOutputSchema
>;

export async function generateProductTitles(
  input: GenerateProductTitlesInput
): Promise<GenerateProductTitlesOutput> {
  return generateProductTitlesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductTitlesPrompt',
  input: {schema: GenerateProductTitlesInputSchema},
  output: {schema: GenerateProductTitlesOutputSchema},
  prompt: `You are an expert in generating SEO-optimized product titles.

  Given the following product description and category, generate 5 different product titles that are likely to attract customers and rank well in search engines.

  Category: {{{category}}}
  Description: {{{description}}}

  Return the titles as a JSON array.
  `,
});

const generateProductTitlesFlow = ai.defineFlow(
  {
    name: 'generateProductTitlesFlow',
    inputSchema: GenerateProductTitlesInputSchema,
    outputSchema: GenerateProductTitlesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
