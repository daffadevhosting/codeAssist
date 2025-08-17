// src/app/api/bot-actions.ts
"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";


type ChatMessage = {
  role: 'user' | 'assist';
  content: string;
};

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
        const bodyMatch = text.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        if (bodyMatch && bodyMatch[1]) {
            return bodyMatch[1].trim();
        }
        const htmlMatch = text.match(/```html\n([\s\S]*?)\n```/);
        if (htmlMatch && htmlMatch[1]) {
            return htmlMatch[1].trim();
        }
        return text.replace(/##/g, '').replace(/\\\[.*?\\\\]\(.*?\\\\\)/g, '');
    } catch (e: any) {
        console.error("Error fetching URL:", e);
        throw new Error("Could not retrieve content from the provided URL. Please check the URL and try again.");
    }
}

const botApiKey = process.env.BOT_API_KEY_SERVER;

export async function botCoder(messages: ChatMessage[], prompt: string, template: string, existingCode: string | null, model: string): Promise<{
  code: string | null;
  reasoning: string | null;
  error: string | null;
}> {
    const geminiModel = model || 'gemini-2.5-flash';
    
  try {
    if (!botApiKey) {
      throw new Error("API Key is missing. Please configure the BOT_API_KEY_SERVER environment variable.");
    };

    const genAI = new GoogleGenerativeAI(botApiKey);
    const model = genAI.getGenerativeModel({ model: geminiModel, generationConfig: { responseMimeType: 'application/json' } });

    let fullPrompt = "";
    const isRedesignFromHtml = template === 'redesign';
    const isRedesignFromUrl = template === 'url_redesign';
    const isPublicChat = template === 'public_chat';

    if (isRedesignFromUrl) {
      const htmlContent = await fetchHtmlFromUrl(prompt);
      fullPrompt = `You are an expert web designer. Your task is to take the provided HTML content and redesign it into a complete, modern, and visually appealing full-page layout using Tailwind CSS.

      - You MUST build a full-page structure (header, main content, footer).
      - The final output must be a single HTML file.
      - The response MUST be a valid JSON object with two keys: \"redesignedCode\" and \"reasoning\".
      - The value for \"redesignedCode\" MUST be a single JSON string containing the full HTML. Ensure all special characters and newlines within the HTML are properly escaped to create a valid JSON string.

      Existing HTML Content to use for the main body:
      \`\`\`html
      ${htmlContent}
      \`\`\`

      Description of Desired Redesign: "Redesign this content into a complete, modern webpage with a full top-to-bottom layout."
      `;
    
    } else if (isRedesignFromHtml) {
        const htmlContent = prompt;
        fullPrompt = `You are an expert web designer. Your task is to redesign the given HTML code into a modern, visually appealing layout using Tailwind CSS and subtle JavaScript animations.

      - The final output must be a single HTML file with Tailwind CSS classes.
      - The response MUST be a valid JSON object with two keys: \"redesignedCode\" and \"reasoning\". The value for \"redesignedCode\" MUST be a single JSON string with the HTML content properly escaped.

      Existing HTML:
      \`\`\`html
      ${htmlContent}
      \`\`\`
      Description of Desired Redesign: "Redesign this HTML code into a modern layout with Tailwind CSS."
      `;

    } else if (isPublicChat) {
      const historyText = messages.map(msg => {
        return `${msg.role === 'user' ? 'user' : 'assist'}: ${msg.content}`;
      }).join('\n\n');
      fullPrompt = `You are **CoDa** the "CodeAssist AI Companion", a friendly and knowledgeable AI assistant specializing in software development, technology, and AI news.

      Your goal is to engage users in discussions and provide expert assistance. Your functions include:
      
      1.  **General Conversation**: Discuss coding projects, challenges, and the latest in technology and AI.
      2.  **Code Debugging**: If a user provides a code snippet, you MUST act as an expert debugger.
          -   Analyze the code for errors (syntax, logic, etc.).
          -   Clearly explain the error and its cause.
          -   Provide the corrected code snippet.
          -   If the code is functional, suggest improvements for performance or readability.
      
      Your Rules:
      -   Maintain a positive, supportive, and enthusiastic tone.
      -   Use Unicode emojis to be more expressive (e.g., ✅, 💡, 🐛).
      -   Provide informative and in-depth answers.
      -   Your responses MUST be in JSON format with a single key: "chatResponse".
      
      User Message History:
      ${historyText}
      
      assist:`;
    } else { 
      const baseCode = existingCode || templates[template] || templates['react'];
      fullPrompt = `You are an expert software developer specializing in REACT and HTML. Based on the user's request, you will modify the provided base code.\n\n      - For \"REACT\" requests, you MUST use shadcn/ui components and ensure the code is a valid React component.\n      - For \"HTML\" requests, you MUST generate a complete and valid HTML document with Tailwind CSS.\n      - The response MUST be a JSON object with two keys: \"improvedCode\" (containing the final code) and \"reasoning\" (a brief explanation of your changes).\n\n      Existing Code (template to modify):\n      \n      \
      ${template}\n      ${baseCode}\n      \
\n      Description of Desired Changes:\n      \"${prompt}\"
      `;
    }

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    let text = response.text();
    
    if (text.startsWith("```json")) {
        text = text.substring(7, text.length - 3).trim();
    } else if (text.startsWith("```")) {
        text = text.substring(3, text.length - 3).trim();
    }


    const jsonResponse = JSON.parse(text);
    
    let code;
    if (isPublicChat) {
      code = jsonResponse.chatResponse;
    } else if (isRedesignFromHtml || isRedesignFromUrl) {
      code = jsonResponse.redesignedCode;
    } else {
      code = jsonResponse.improvedCode;
    }
    
    const reasoning = jsonResponse.reasoning;

    if (code) {
      return { code, reasoning, error: null };
    } else {
      return { code: null, reasoning, error: "Failed to generate code. The AI returned an empty response." };
    }
  } catch (e: any) {
    console.error("Full error:", e);
    const errorMessage = e.message || "";

    if (errorMessage.includes('429') || errorMessage.toLowerCase().includes('quota')) {
        return { code: null, reasoning: null, error: "Kuota API Anda telah habis atau Anda mengirim terlalu banyak permintaan. Silakan coba lagi nanti." };
    }
    
    if (errorMessage.includes('API_KEY_INVALID')) {
        return { code: null, reasoning: null, error: "The provided API Key is invalid. Please check your key and try again." };
    }
     if (e instanceof SyntaxError) {
      return { code: null, reasoning: null, error: "Failed to parse the AI's response. It may have generated an invalid format." };
    }
    return { code: null, reasoning: null, error: e.message || "An unknown error occurred." };
  }
}