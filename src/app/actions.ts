"use server";

import { codeImprovements } from '@/ai/flows/code-improvements';
import { redesignFromHtml } from '@/ai/flows/redesign-from-html';
import { SetStateAction } from 'react';

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
    <!-- Your HTML here -->
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
        // The service returns markdown, let's find the HTML block
        const htmlMatch = text.match(/```html([\s\S]*?)```/);
        if (htmlMatch && htmlMatch[1]) {
            return htmlMatch[1].trim();
        }
        // Fallback if no specific HTML block is found
        return text;
    } catch (e: any) {
        console.error("Error fetching URL:", e);
        throw new Error("Could not retrieve content from the provided URL. Please check the URL and try again.");
    }
}


export async function generateCode(prompt: string, template: string): Promise<{
  [x: string]: SetStateAction<string | null>; code: string | null; error: string | null 
}> {
  try {
    if (template === 'redesign' || template === 'url_redesign') {
      let htmlContent = prompt;
      if (template === 'url_redesign') {
        htmlContent = await fetchHtmlFromUrl(prompt);
      }

      const result = await redesignFromHtml({
        html: htmlContent,
        description: "Redesign this HTML code into a modern layout with Tailwind CSS and subtle animations.",
      });
      if (result.redesignedCode) {
        return { code: result.redesignedCode, error: null };
      } else {
        return { code: null, error: "Failed to redesign code. The AI returned an empty response." };
      }
    }

    const baseCode = templates[template] || templates['react'];
    
    const result = await codeImprovements({
      code: baseCode,
      description: prompt,
    });

    if (result.improvedCode) {
      return { code: result.improvedCode, error: null };
    } else {
      return { code: null, error: "Failed to generate code. The AI returned an empty response." };
    }
  } catch (e: any) {
    console.error(e);
    return { code: null, error: e.message || "An unknown error occurred during code generation." };
  }
}