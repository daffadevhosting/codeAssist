// This file uses server-side code.
'use server';

/**
 * @fileOverview implements the codeImprovements flow to provide suggestions for code improvements and modifications based on a description of desired changes.
 *
 * - codeImprovements - A function that handles the code improvement process.
 * - CodeImprovementsInput - The input type for the codeImprovements function.
 * - CodeImprovementsOutput - The return type for the codeImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CodeImprovementsInputSchema = z.object({
  code: z.string().describe('The existing code to be improved.'),
  description: z
    .string()
    .describe('The description of desired changes and improvements.'),
});
export type CodeImprovementsInput = z.infer<typeof CodeImprovementsInputSchema>;

const CodeImprovementsOutputSchema = z.object({
  improvedCode: z.string().describe('The improved and modified code.'),
});
export type CodeImprovementsOutput = z.infer<typeof CodeImprovementsOutputSchema>;

export async function codeImprovements(input: CodeImprovementsInput): Promise<CodeImprovementsOutput> {
  return codeImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'codeImprovementsPrompt',
  input: {
    schema: CodeImprovementsInputSchema,
  },
  output: {
    schema: CodeImprovementsOutputSchema,
  },
  prompt: `You are an expert software developer. You will be given existing code and a description of desired changes.

  Your task is to improve and modify the code based on the description. Return the improved and modified code.

  Existing Code:
  {{code}}

  Description of Desired Changes:
  {{description}}`,
});

const codeImprovementsFlow = ai.defineFlow(
  {
    name: 'codeImprovementsFlow',
    inputSchema: CodeImprovementsInputSchema,
    outputSchema: CodeImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
