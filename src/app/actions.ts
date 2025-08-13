// src/app/actions.ts
"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const templates: Record<string, string> = {
  react: `import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// When creating components, use shadcn/ui components by default.
// Available components: Button, Input, Card, Label, Select, Textarea, Checkbox, etc.
// Use Tailwind CSS for styling.
// Make sure to return a single root element.

export default function MyComponent() {
  return (
    <div>
      {/* Your component here */}
    </div>
  );
}`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
    </style>
</head>
<body class="bg-gray-100">
    </body>
</html>`,
};

async function fetchHtmlFromUrl(url: string): Promise<string> {
    try {
        const response = await fetch(`https://r.jina.ai/${encodeURIComponent(url)}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch URL content. Status: ${response.status}`);
        }
        const text = await response.text();
        const htmlMatch = text.match(/```html\n([\s\S]*?)\n```/);
        if (htmlMatch && htmlMatch[1]) {
            return htmlMatch[1].trim();
        }
        return text.replace(/##/g, '').replace(/\[.*?\]\(.*?\)/g, '');
    } catch (e: any) {
        console.error("Error fetching URL:", e);
        throw new Error("Could not retrieve content from the provided URL. Please check the URL and try again.");
    }
}

export async function generateCode(prompt: string, template: string, apiKey: string, reasoning: string | null): Promise<{
  code: string | null;
  reasoning: string | null;
  error: string | null;
}> {
  try {
    if (!apiKey) {
      throw new Error("API Key is missing. Please provide your API Key.");
    }
    
    const geminiModel = 'gemini-2.5-flash';

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: geminiModel, generationConfig: { responseMimeType: 'application/json' } });

    let fullPrompt = "";
    const isRedesignFromHtml = template === 'redesign';
    const isRedesignFromUrl = template === 'url_redesign';

    if (isRedesignFromUrl) {
      const htmlContent = await fetchHtmlFromUrl(prompt);
      fullPrompt = `You are an expert web designer. Your task is to take the provided HTML content, which might be a partial representation of a webpage's main content, and redesign it into a complete, modern, and visually appealing full-page layout using Tailwind CSS.
      
      - You MUST build a full-page structure from top to bottom. This includes creating a suitable header, navigation, the main content area using the provided HTML, and a footer.
      - The final output must be a single HTML file.
      - Ensure the redesign is fully responsive.
      - The response MUST be a JSON object with two keys: "redesignedCode" and "reasoning".
      
      Existing HTML Content to use for the main body:
      \`\`\`html
      ${htmlContent}
      \`\`\`
      
      Description of Desired Redesign: "Redesign this content into a complete, modern webpage with a full top-to-bottom layout."`;
    
    } else if (isRedesignFromHtml) {
        const htmlContent = prompt;
        fullPrompt = `You are an expert web designer. Your task is to redesign the given HTML code into a modern, visually appealing layout using Tailwind CSS and subtle JavaScript animations.

      - The final output must be a single HTML file with Tailwind CSS classes.
      - The response MUST be a JSON object with two keys: "redesignedCode" and "reasoning".

      Existing HTML:
      \`\`\`html
      ${htmlContent}
      \`\`\`

      Description of Desired Redesign: "Redesign this HTML code into a modern layout with Tailwind CSS."`;

    } else { // **PROMPT DIPERBAIKI DI SINI**
      const baseCode = templates[template] || templates['react'];
      fullPrompt = `You are an expert software developer specializing in REACT and HTML. Based on the user's request, you will modify the provided base code.

      - For "REACT" requests, you MUST use shadcn/ui components and ensure the code is a valid React component.
      - For "HTML" requests, you MUST generate a complete and valid HTML document with Tailwind CSS.
      - The response MUST be a JSON object with two keys: "improvedCode" (containing the final code) and "reasoning" (a brief explanation of your changes).

      Existing Code (template to modify):
      \`\`\`${template}
      ${baseCode}
      \`\`\`

      Description of Desired Changes:
      "${prompt}"`;
    }

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    let text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch && jsonMatch[0]) {
      text = jsonMatch[0];
    }

    const jsonResponse = JSON.parse(text);
    const code = isRedesignFromHtml || isRedesignFromUrl ? jsonResponse.redesignedCode : jsonResponse.improvedCode;
    const reasoning = jsonResponse.reasoning;

    if (code) {
      return { code, reasoning, error: null };
    } else {
      return { code: null, reasoning: null, error: "Failed to generate code. The AI returned an empty response." };
    }
  } catch (e: any) {
    console.error("Full error:", e);
    if (e.message.includes('API_KEY_INVALID')) {
        return { code: null, reasoning: null, error: "The provided API Key is invalid. Please check your key and try again." };
    }
     if (e instanceof SyntaxError) {
      return { code: null, reasoning: null, error: "Failed to parse the AI's response. It may have generated an invalid format." };
    }
    return { code: null, reasoning: null, error: e.message || "An unknown error occurred." };
  }
}