// This file uses server-side code.
'use server';

/**
 * @fileOverview Explains the functionality of a given code snippet in natural language.
 *
 * - codeExplanation - A function that accepts code and returns its explanation.
 * - CodeExplanationInput - The input type for the codeExplanation function.
 * - CodeExplanationOutput - The return type for the codeExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CodeExplanationInputSchema = z.object({
  code: z.string().describe('The code to be explained.')
});
export type CodeExplanationInput = z.infer<typeof CodeExplanationInputSchema>;

const CodeExplanationOutputSchema = z.object({
  explanation: z.string().describe('The natural language explanation of the code.')
});
export type CodeExplanationOutput = z.infer<typeof CodeExplanationOutputSchema>;

export async function codeExplanation(input: CodeExplanationInput): Promise<CodeExplanationOutput> {
  return codeExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'codeExplanationPrompt',
  input: {schema: CodeExplanationInputSchema},
  output: {schema: CodeExplanationOutputSchema},
  prompt: `You are an expert software developer. Explain the following code in natural language:

  {{code}}`,
});

const codeExplanationFlow = ai.defineFlow(
  {
    name: 'codeExplanationFlow',
    inputSchema: CodeExplanationInputSchema,
    outputSchema: CodeExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
