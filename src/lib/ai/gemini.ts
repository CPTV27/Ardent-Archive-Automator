
import { GoogleGenAI } from "@google/genai";

// The system requires process.env.API_KEY. 
// If you are using GEMINI_API_KEY locally, ensure it is assigned to API_KEY in your environment.
const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing API_KEY in environment variables");
}

export const ai = new GoogleGenAI({ apiKey });
