
import { GoogleGenAI, Type } from "@google/genai";

// Securely access the API key from process.env
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing. AI features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export interface AnalysisResult {
  priority: 'Low' | 'Medium' | 'High';
  summary: string;
  categorySuggestion: string;
}

export const analyzeReport = async (description: string): Promise<AnalysisResult> => {
  const ai = getAIClient();
  
  if (!ai) {
    return {
      priority: 'Medium',
      summary: 'AI analysis is currently unavailable.',
      categorySuggestion: 'Other'
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this report of extortion or corruption in Bangladesh. Summarize it in Bengali and determine priority (Low/Medium/High) based on severity. Report: ${description}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            priority: {
              type: Type.STRING,
              description: 'The priority of the case.',
            },
            summary: {
              type: Type.STRING,
              description: 'A brief summary of the incident in Bengali.',
            },
            categorySuggestion: {
              type: Type.STRING,
              description: 'Suggested category for this report.',
            }
          },
          required: ["priority", "summary", "categorySuggestion"],
        },
      },
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      priority: 'Medium',
      summary: 'Analysis unavailable.',
      categorySuggestion: 'Other'
    };
  }
};
