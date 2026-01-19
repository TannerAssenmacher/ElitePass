
import { GoogleGenAI, Type } from "@google/genai";
import { SecurityReport } from "../types";

export const analyzePassword = async (password: string): Promise<SecurityReport> => {
  // Always initialize right before making an API call to ensure it uses the most up-to-date API key from process.env.API_KEY.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      // Upgraded to gemini-3-pro-preview as password security analysis involves technical reasoning (STEM task).
      model: "gemini-3-pro-preview",
      contents: `Analyze the security of this password: "${password}". 
      Return the evaluation in a strict JSON format. Include a very short, one-line fun improvement tip.
      
      CRITICAL INSTRUCTION: Do NOT suggest adding emojis. Only suggest valid password characters like symbols, numbers, or changing case/length. Emojis are not supported characters in this generator.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "A score from 0-100" },
            strength: { type: Type.STRING, enum: ["Weak", "Moderate", "Strong", "Elite"] },
            analysis: { type: Type.STRING, description: "A concise security tip or analysis" },
            timeToCrack: { type: Type.STRING, description: "Estimated time to brute-force" },
            improvementTip: { type: Type.STRING, description: "A very short one-line tip on what to add for max strength + fun feedback. MUST NOT mention emojis." }
          },
          required: ["score", "strength", "analysis", "timeToCrack", "improvementTip"]
        }
      }
    });

    // The .text property is a getter that directly returns the string output from the model.
    const resultText = response.text;
    if (!resultText) {
      throw new Error("Received empty response from the AI model");
    }
    return JSON.parse(resultText.trim());
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback if API fails to ensure the application remains functional.
    return {
      score: 50,
      strength: "Moderate",
      analysis: "Unable to reach AI for deep analysis. Ensure connectivity.",
      timeToCrack: "N/A",
      improvementTip: "Add some spice with symbols! (AI is sleeping)"
    };
  }
};
