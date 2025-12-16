
'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing customer support chat logs.
 *
 * - `analyzeCustomerSupport`: The main function to analyze chat logs.
 * - `AnalyzeCustomerSupportInput`: The input type for the `analyzeCustomerSupport` function.
 * - `AnalyzeCustomerSupportOutput`: The output type for the `analyzeCustomerSupport` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeCustomerSupportInputSchema = z.object({
  chatLogs: z.array(z.string()).describe('An array of customer chat messages.'),
});
export type AnalyzeCustomerSupportInput = z.infer<
  typeof AnalyzeCustomerSupportInputSchema
>;

const AnalyzeCustomerSupportOutputSchema = z.object({
  commonTopics: z.array(z.string()).describe('A list of common topics mentioned in the chat logs.'),
  sentiment: z.enum(['positive', 'negative', 'neutral']).describe('The overall sentiment of the conversations.'),
  suggestedActions: z.array(z.string()).describe('A list of suggested actions to improve customer experience.'),
});
export type AnalyzeCustomerSupportOutput = z.infer<
  typeof AnalyzeCustomerSupportOutputSchema
>;

export async function analyzeCustomerSupport(
  input: AnalyzeCustomerSupportInput
): Promise<AnalyzeCustomerSupportOutput> {
  return analyzeCustomerSupportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCustomerSupportPrompt',
  input: { schema: AnalyzeCustomerSupportInputSchema },
  output: { schema: AnalyzeCustomerSupportOutputSchema },
  prompt: `You are an expert in customer support analysis.

  Given the following chat logs, please analyze them and provide insights.
  Identify common topics, the overall sentiment, and suggest actions to improve the customer experience.

  Chat Logs:
  {{#each chatLogs}}
  - {{{this}}}
  {{/each}}
  `,
});

const analyzeCustomerSupportFlow = ai.defineFlow(
  {
    name: 'analyzeCustomerSupportFlow',
    inputSchema: AnalyzeCustomerSupportInputSchema,
    outputSchema: AnalyzeCustomerSupportOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
