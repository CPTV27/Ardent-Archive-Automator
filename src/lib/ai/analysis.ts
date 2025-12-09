import { ai } from "./gemini";
import { Type, Schema } from "@google/genai";
import { AssetMetadata } from "../../types";

export async function analyzeUploadedAsset({ base64, mimeType }: { base64: string, mimeType: string }): Promise<AssetMetadata> {
  const model = "gemini-2.5-flash";

  const prompt = `
    Analyze this archival asset.
    Return a JSON object with the following structure:
    - assetType: 'Commercial', 'Document', 'Visual', or 'Audio'.
    - explicitData: Object containing title, artist, catalogNumber (for Commercial) or date, client (for Document).
    - visualCues: Array of strings describing visual elements.
    - potentialSessionGuess: String guessing the recording session context.
    - identifiedPeople: Array of names.
    - tags: General keywords.
    - confidenceScore: Number between 0 and 1.
    - reasoning: Short explanation of classification.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      assetType: { type: Type.STRING, enum: ['Commercial', 'Document', 'Visual', 'Audio', 'Unknown'] },
      explicitData: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, nullable: true },
          artist: { type: Type.STRING, nullable: true },
          catalogNumber: { type: Type.STRING, nullable: true },
          date: { type: Type.STRING, nullable: true },
          client: { type: Type.STRING, nullable: true },
        },
        nullable: true
      },
      visualCues: { type: Type.ARRAY, items: { type: Type.STRING } },
      potentialSessionGuess: { type: Type.STRING, nullable: true },
      identifiedPeople: { type: Type.ARRAY, items: { type: Type.STRING } },
      tags: { type: Type.ARRAY, items: { type: Type.STRING } },
      confidenceScore: { type: Type.NUMBER },
      reasoning: { type: Type.STRING, nullable: true }
    },
    required: ["assetType", "visualCues", "tags", "confidenceScore"]
  };

  const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64 } },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    
    return JSON.parse(text) as AssetMetadata;
}