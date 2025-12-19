
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating page content.
 *
 * - `generatePageContent`: The main function to generate content.
 * - `GeneratePageContentInput`: The input type for the `generatePageContent` function.
 * - `GeneratePageContentOutput`: The output type for the `generatePageContent` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePageContentInputSchema = z.object({
  topic: z.string().describe('The topic or title of the page.'),
  keywords: z.array(z.string()).optional().describe('A list of keywords to include.'),
  tone: z.enum(['professional', 'friendly', 'promotional']).default('friendly').describe('The desired tone of the content.'),
});
export type GeneratePageContentInput = z.infer<
  typeof GeneratePageContentInputSchema
>;

const GeneratePageContentOutputSchema = z.object({
  content: z.string().describe('The generated page content in Markdown format.'),
});
export type GeneratePageContentOutput = z.infer<
  typeof GeneratePageContentOutputSchema
>;

export async function generatePageContent(
  input: GeneratePageContentInput
): Promise<GeneratePageContentOutput> {
  return generatePageContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePageContentPrompt',
  input: { schema: GeneratePageContentInputSchema },
  output: { schema: GeneratePageContentOutputSchema },
  prompt: `You are an expert copywriter for an e-commerce store called "p-commerce".

  Generate compelling content for a webpage based on the following details. The content should be in Markdown.

  Topic/Title: {{{topic}}}
  Tone: {{{tone}}}
  {{#if keywords}}Keywords: {{#each keywords}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
  `,
});

const generatePageContentFlow = ai.defineFlow(
  {
    name: 'generatePageContentFlow',
    inputSchema: GeneratePageContentInputSchema,
    outputSchema: GeneratePageContentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
