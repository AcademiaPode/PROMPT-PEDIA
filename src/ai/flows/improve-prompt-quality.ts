// src/ai/flows/improve-prompt-quality.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for improving the quality of a given prompt using AI.
 *
 * The flow accepts a prompt and an optional target AI model, and returns an improved version of the prompt.
 *
 * @exports improvePromptQuality
 * @exports ImprovePromptQualityInput
 * @exports ImprovePromptQualityOutput
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Input schema for the improvePromptQuality flow.
 */
const ImprovePromptQualityInputSchema = z.object({
  prompt: z.string().describe('The prompt to be improved.'),
  targetModel: z.string().optional().describe('The specific AI model for which the prompt should be optimized.'),
});
export type ImprovePromptQualityInput = z.infer<typeof ImprovePromptQualityInputSchema>;

/**
 * Output schema for the improvePromptQuality flow.
 */
const ImprovePromptQualityOutputSchema = z.object({
  improvedPrompt: z.string().describe('The improved prompt, optimized for the target AI model if provided.'),
});
export type ImprovePromptQualityOutput = z.infer<typeof ImprovePromptQualityOutputSchema>;

/**
 * Improves the quality of a given prompt using AI.
 * @param input The input object containing the prompt and optional target AI model.
 * @returns The improved prompt.
 */
export async function improvePromptQuality(input: ImprovePromptQualityInput): Promise<ImprovePromptQualityOutput> {
  return improvePromptQualityFlow(input);
}

const improvePromptQualityPrompt = ai.definePrompt({
  name: 'improvePromptQualityPrompt',
  input: {schema: ImprovePromptQualityInputSchema},
  output: {schema: ImprovePromptQualityOutputSchema},
  prompt: `You are an AI prompt optimizer. You will take a prompt as input and improve it to be higher quality.
Respond in the same language as the 'Original Prompt'. If the language of the 'Original Prompt' is unclear, respond in Spanish.

If a target AI model is specified, you will optimize the prompt for that specific model; otherwise, you will improve the prompt for general usage with large language models.

Original Prompt: {{{prompt}}}

{{#if targetModel}}
Target Model: {{{targetModel}}}
{{/if}}
  `,
});

const improvePromptQualityFlow = ai.defineFlow(
  {
    name: 'improvePromptQualityFlow',
    inputSchema: ImprovePromptQualityInputSchema,
    outputSchema: ImprovePromptQualityOutputSchema,
  },
  async input => {
    const {output} = await improvePromptQualityPrompt(input);
    return output!;
  }
);
