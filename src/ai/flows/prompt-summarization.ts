'use server';

/**
 * @fileOverview Summarizes long prompts into shorter, more concise prompts.
 *
 * - summarizePrompt - A function that handles the prompt summarization process.
 * - SummarizePromptInput - The input type for the summarizePrompt function.
 * - SummarizePromptOutput - The return type for the summarizePrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePromptInputSchema = z.object({
  prompt: z.string().describe('The prompt to be summarized.'),
});

export type SummarizePromptInput = z.infer<typeof SummarizePromptInputSchema>;

const SummarizePromptOutputSchema = z.object({
  summary: z.string().describe('The summarized prompt.'),
});

export type SummarizePromptOutput = z.infer<typeof SummarizePromptOutputSchema>;

export async function summarizePrompt(input: SummarizePromptInput): Promise<SummarizePromptOutput> {
  return summarizePromptFlow(input);
}

const summarizePromptPrompt = ai.definePrompt({
  name: 'summarizePromptPrompt',
  input: {schema: SummarizePromptInputSchema},
  output: {schema: SummarizePromptOutputSchema},
  prompt: `Summarize the following prompt into a shorter, more concise prompt while preserving its core meaning and intent.
Respond in the same language as the input 'Prompt'. If the language of the input 'Prompt' is unclear, respond in Spanish.

Prompt: {{{prompt}}}`,
});

const summarizePromptFlow = ai.defineFlow(
  {
    name: 'summarizePromptFlow',
    inputSchema: SummarizePromptInputSchema,
    outputSchema: SummarizePromptOutputSchema,
  },
  async input => {
    const {output} = await summarizePromptPrompt(input);
    return output!;
  }
);
