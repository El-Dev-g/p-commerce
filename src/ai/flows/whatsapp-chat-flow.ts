'use server';

/**
 * @fileOverview This file defines a Genkit flow for handling conversational AI chat for WhatsApp.
 *
 * - `whatsAppChat`: The main function to generate a chat response.
 * - `WhatsAppChatInput`: The input type for the chat function.
 * - `WhatsAppChatOutput`: The output type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const WhatsAppChatInputSchema = z.object({
  message: z.string().describe('The customer message from WhatsApp.'),
});
export type WhatsAppChatInput = z.infer<typeof WhatsAppChatInputSchema>;

const WhatsAppChatOutputSchema = z.object({
  reply: z.string().describe('The AI-generated reply to the customer.'),
});
export type WhatsAppChatOutput = z.infer<typeof WhatsAppChatOutputSchema>;

export async function whatsAppChat(
  input: WhatsAppChatInput
): Promise<WhatsAppChatOutput> {
  return whatsAppChatFlow(input);
}

const chatPrompt = ai.definePrompt({
  name: 'whatsAppChatPrompt',
  input: { schema: WhatsAppChatInputSchema },
  output: { schema: WhatsAppChatOutputSchema },
  prompt: `You are an AI assistant for an online store called p-commerce.
  You are friendly, helpful, and concise.

  A customer sent the following message from WhatsApp. Respond to it.

  Customer Message: {{{message}}}
  `,
});

const whatsAppChatFlow = ai.defineFlow(
  {
    name: 'whatsAppChatFlow',
    inputSchema: WhatsAppChatInputSchema,
    outputSchema: WhatsAppChatOutputSchema,
  },
  async (input) => {
    const { output } = await chatPrompt(input);
    return output!;
  }
);
