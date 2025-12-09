
import { ai } from "./gemini";
import { Type } from "@google/genai";

export interface AnalysisResult {
  classification: 'COMMERCIAL' | 'DOCUMENT' | 'VISUAL';
  commercialData?: {
    artist?: string;
    title?: string;
    catalogNumber?: string;
  };
  documentData?: {
    date?: string;
    client?: string;
    personnel?: string[];
  };
  visualData?: {
    tags?: string[];
    description?: string;
    potentialSessionGuess?: string;
  };
}

export async function analyzeUploadedAsset(base64Data: string, mimeType: string): Promise<AnalysisResult> {
  const model = "gemini-2.5-flash";

  const prompt = `
    Analyze this archival asset from a recording studio. 
    1. Classify it strictly as one of: COMMERCIAL (Vinyl, Tape boxes, Album art), DOCUMENT (Track sheets, Letters, Invoices), or VISUAL (Photos of people, studio equipment, sessions).
    2. Based on the classification, extract the following details:
       - If COMMERCIAL: Artist, Title, Catalog Number.
       - If DOCUMENT: Date (YYYY-MM-DD if possible), Client Name, Personnel/Engineers listed.
       - If VISUAL: Visual descriptive tags (e.g., 'Studio A', 'Spectra Sonics Console', 'Guitar'), a short description, and a "potentialSessionGuess" (e.g., "Big Star 1972" or "Stax Era late 60s") based on visual cues if possible.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      classification: {
        type: Type.STRING,
        enum: ["COMMERCIAL", "DOCUMENT", "VISUAL"],
      },
      commercialData: {
        type: Type.OBJECT,
        properties: {
          artist: { type: Type.STRING, nullable: true },
          title: { type: Type.STRING, nullable: true },
          catalogNumber: { type: Type.STRING, nullable: true },
        },
        nullable: true,
      },
      documentData: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING, nullable: true },
          client: { type: Type.STRING, nullable: true },
          personnel: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            nullable: true
          },
        },
        nullable: true,
      },
      visualData: {
        type: Type.OBJECT,
        properties: {
          tags: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            nullable: true
          },
          description: { type: Type.STRING, nullable: true },
          potentialSessionGuess: { type: Type.STRING, nullable: true },
        },
        nullable: true,
      },
    },
    required: ["classification"],
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("AI Analysis Failed:", error);
    throw error;
  }
}
