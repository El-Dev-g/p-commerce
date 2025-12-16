
'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing refund requests.
 *
 * - `analyzeRefunds`: The main function to analyze refund data.
 * - `AnalyzeRefundsInput`: The input type for the `analyzeRefunds` function.
 * - `AnalyzeRefundsOutput`: The output type for the `analyzeRefunds` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RefundInfoSchema = z.object({
  reason: z.string(),
  productName: z.string(),
  category: z.string(),
});

const AnalyzeRefundsInputSchema = z.object({
  refunds: z.array(RefundInfoSchema).describe('A list of recent refund requests.'),
});
export type AnalyzeRefundsInput = z.infer<typeof AnalyzeRefundsInputSchema>;

const AnalyzeRefundsOutputSchema = z.object({
  commonReasons: z.array(z.string()).describe('The most common reasons for refunds.'),
  problematicProducts: z.array(z.string()).describe('Products with a high number of refund requests.'),
  summary: z.string().describe('A brief summary of the refund analysis.'),
});
export type AnalyzeRefundsOutput = z.infer<
  typeof AnalyzeRefundsOutputSchema
>;

export async function analyzeRefunds(
  input: AnalyzeRefundsInput
): Promise<AnalyzeRefundsOutput> {
  return analyzeRefundsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeRefundsPrompt',
  input: { schema: AnalyzeRefundsInputSchema },
  output: { schema: AnalyzeRefundsOutputSchema },
  prompt: `You are an e-commerce analyst specializing in returns and refunds.

  Analyze the following list of refund requests and provide insights.
  - Identify the most common reasons for refunds.
  - List any products that seem to have a high rate of returns.
  - Provide a short summary of your findings.

  Refund Data:
  {{#each refunds}}
  - Reason: {{{reason}}}, Product: {{{productName}}}, Category: {{{category}}}
  {{/each}}
  `,
});

const analyzeRefundsFlow = ai.defineFlow(
  {
    name: 'analyzeRefundsFlow',
    inputSchema: AnalyzeRefundsInputSchema,
    outputSchema: AnalyzeRefundsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
