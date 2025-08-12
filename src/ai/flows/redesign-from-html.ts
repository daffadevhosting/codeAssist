'use server';

/**
 * @fileOverview Implements the redesignFromHtml flow to redesign an existing HTML structure.
 *
 * - redesignFromHtml - A function that handles the HTML redesign process.
 * - RedesignFromHtmlInput - The input type for the redesignFromHtml function.
 * - RedesignFromHtmlOutput - The return type for the redesignFromHtml function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RedesignFromHtmlInputSchema = z.object({
  html: z.string().describe('The existing HTML code to be redesigned.'),
  description: z
    .string()
    .describe('A description of the desired style or changes for the redesign.'),
});
export type RedesignFromHtmlInput = z.infer<typeof RedesignFromHtmlInputSchema>;

const RedesignFromHtmlOutputSchema = z.object({
  redesignedCode: z.string().describe('The redesigned HTML code with Tailwind CSS and JavaScript for animations.'),
});
export type RedesignFromHtmlOutput = z.infer<typeof RedesignFromHtmlOutputSchema>;

export async function redesignFromHtml(input: RedesignFromHtmlInput): Promise<RedesignFromHtmlOutput> {
  return redesignFromHtmlFlow(input);
}

const prompt = ai.definePrompt({
  name: 'redesignFromHtmlPrompt',
  input: {
    schema: RedesignFromHtmlInputSchema,
  },
  output: {
    schema: RedesignFromHtmlOutputSchema,
  },
  prompt: `You are an expert web designer and developer. You will be given existing HTML code and a description of the desired redesign.

Your task is to redesign the given HTML into a modern, visually appealing layout using Tailwind CSS and add subtle JavaScript animations for a better user experience.

- The final output must be a single HTML file with Tailwind CSS classes and inline JavaScript.
- Do not use external CSS or JavaScript files.
- Use placeholder images from https://placehold.co if needed.

Existing HTML:
\`\`\`html
{{{html}}}
\`\`\`

Description of Desired Redesign:
"{{description}}"

Return the full, redesigned HTML code.`,
});

const redesignFromHtmlFlow = ai.defineFlow(
  {
    name: 'redesignFromHtmlFlow',
    inputSchema: RedesignFromHtmlInputSchema,
    outputSchema: RedesignFromHtmlOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
