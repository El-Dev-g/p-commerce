
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
import { products } from '@/lib/products';
import type { Product } from '@/lib/types';

// Define a schema for a searchable product, including only relevant fields.
const SearchableProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
});
type SearchableProduct = z.infer<typeof SearchableProductSchema>;

const ChatInputSchema = z.object({
  message: z.string().describe("The user's message."),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  reply: z.string().describe('The AI-generated reply to the user.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

// This function simulates searching the product database.
// In a real app, this could be a database query.
async function findProducts(query?: string): Promise<SearchableProduct[]> {
  console.log('Searching for products with query:', query);
  let results = products;

  if (query) {
    results = products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Map to the searchable schema
  return results.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category,
  }));
}

// Define a tool for the AI to search for products.
const productSearchTool = ai.defineTool(
    {
        name: 'productSearch',
        description: 'Search for products in the store catalog. Use this to answer questions about product availability, details, or to make recommendations.',
        inputSchema: z.object({
            query: z.string().optional().describe('A search query to filter products. Can be a product name, category, or keyword.'),
        }),
        outputSchema: z.array(SearchableProductSchema),
    },
    async (input) => findProducts(input.query)
);


export async function chat(
  input: ChatInput
): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatPrompt = ai.definePrompt({
  name: 'chatPrompt',
  input: { schema: ChatInputSchema },
  output: { schema: ChatOutputSchema },
  tools: [productSearchTool],
  prompt: `You are a friendly and helpful e-commerce assistant for an online store called "p-commerce".

  Your goal is to help users find the perfect products.
  - Use the productSearch tool to find information about products when a user asks about them.
  - You can answer questions about product details, pricing, and availability.
  - You can also make recommendations based on what the user is looking for.
  - If the user asks a general question, have a normal conversation.
  - Be concise and friendly in your responses.

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
