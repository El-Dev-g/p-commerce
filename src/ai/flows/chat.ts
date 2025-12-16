
'use server';

/**
 * @fileOverview This file defines a Genkit flow for handling conversational AI chat.
 *
 * - `chat`: The main function to generate a chat response.
 * - `ChatInput`: The input type for the chat function.
 * - `ChatOutput`: The output type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatInputSchema = z.object({
  message: z.string().describe('The user\'s message.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  reply: z.string().describe('The AI-generated reply to the user.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(
  input: ChatInput
): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatPrompt = ai.definePrompt({
  name: 'chatPrompt',
  input: { schema: ChatInputSchema },
  output: { schema: ChatOutputSchema },
  prompt: `You are a helpful assistant.

  User Message: {{{message}}}
  `,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const { output } = await chatPrompt(input);
    return output!;
  }
);
