import { GoogleGenAI, Type } from "@google/genai";
import { EwcCode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

const EWC_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      code: { type: Type.STRING, description: "The 6-digit EWC code (formatted XX XX XX)" },
      description: { type: Type.STRING, description: "Official description of the waste" },
      category: { type: Type.STRING, description: "The broader chapter/category name" },
      hazardous: { type: Type.BOOLEAN, description: "Whether this waste is typically classified as hazardous" },
      confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 100 based on the input" }
    },
    required: ["code", "description", "category", "hazardous"],
  },
};

const SYSTEM_INSTRUCTION = `
You are an expert European Waste Catalogue (EWC) consultant. 
Your goal is to help users identify the correct EWC code for their waste.
Strictly adhere to the official European Waste Catalogue list.
If a code ends with an asterisk (*), it is hazardous.
Provide the most specific codes possible. 
If the input is vague, provide the most likely relevant codes.
Ensure the 'code' format is always 'XX XX XX'.
`;

export const searchEwcByText = async (query: string): Promise<EwcCode[]> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Find relevant EWC codes for: "${query}".`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: EWC_SCHEMA,
        temperature: 0.3, // Low temperature for factual accuracy
      },
    });

    if (!response.text) return [];
    return JSON.parse(response.text) as EwcCode[];
  } catch (error) {
    console.error("Gemini Text Search Error:", error);
    throw new Error("Failed to search for EWC codes. Please try again.");
  }
};

export const searchEwcByImage = async (base64Image: string): Promise<EwcCode[]> => {
  try {
    // Remove data URL prefix if present for the API call
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: "image/jpeg", // Assuming JPEG for simplicity from canvas/input, Gemini handles most types
            },
          },
          {
            text: "Analyze this image of waste. Identify what it is and provide the most relevant European Waste Catalogue (EWC) codes.",
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: EWC_SCHEMA,
        temperature: 0.4,
      },
    });

    if (!response.text) return [];
    return JSON.parse(response.text) as EwcCode[];
  } catch (error) {
    console.error("Gemini Image Search Error:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
};