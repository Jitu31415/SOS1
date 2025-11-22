import { GoogleGenAI, Type } from "@google/genai";
import { EmergencyType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeSOSContext = async (userInput: string): Promise<{ type: EmergencyType; priority: string; summary: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze this distress call: "${userInput}". Categorize it and determine priority.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: {
              type: Type.STRING,
              enum: [
                EmergencyType.MEDICAL,
                EmergencyType.ENVIRONMENTAL,
                EmergencyType.SECURITY,
                EmergencyType.OTHER
              ]
            },
            priority: {
              type: Type.STRING,
              enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
            },
            summary: {
              type: Type.STRING,
              description: "A very short, tactical summary of the situation (max 5 words)."
            }
          },
          required: ["type", "priority", "summary"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No text in response");
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback
    return {
      type: EmergencyType.OTHER,
      priority: 'HIGH',
      summary: 'Unknown Emergency'
    };
  }
};
