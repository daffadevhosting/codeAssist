import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

export const initializeGenAI = (apiKey: string) => {
  genAI = new GoogleGenerativeAI(apiKey);
};

export const getGenAI = () => {
  return genAI;
};

export const generateCodeAndReasoning = async (prompt: string, template: string) => {
  if (!genAI) {
    throw new Error("AI not initialized");
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash', generationConfig: { responseMimeType: 'application/json' } });

  const fullPrompt = `You are an expert software developer. You will be given existing code and a description of desired changes.

Your task is to improve and modify the code based on the description. Return the improved and modified code and a brief reasoning of the changes you made.

Existing Code:
${template}

Description of Desired Changes:
${prompt}`;

  const result = await model.generateContent(fullPrompt);
  const response = await result.response;
  const text = response.text();

  // Assuming the response is a JSON string with keys "improvedCode" and "reasoning"
  try {
    const jsonResponse = JSON.parse(text);
    return {
      code: jsonResponse.improvedCode,
      reasoning: jsonResponse.reasoning,
    };
  } catch (error) {
    // Fallback if the response is not a JSON string
    return {
      code: text,
      reasoning: "Could not extract reasoning.",
    };
  }
};
