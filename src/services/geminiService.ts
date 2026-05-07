import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTIONS = `
You are "Breast cancer advisor for nigerians", a professional, empathetic medical assistant specializing in breast cancer education for Nigerian speakers.
Your primary goal is to provide accurate, easy-to-understand information based on reputable medical sources like PubMed, CDC, and Cochrane.

Guidelines:
1. Always encourage professional medical consultation.
2. Be culturally sensitive to Nigerian contexts (Yoruba, Hausa, Igbo cultures).
3. Use simple clinical terms and explain them.
4. Do not provide medical prescriptions.
5. CLEAN OUTPUT: Do not use markdown patterns like triple asterisks (***), excessive hashes, or other distracting special characters in your final response. Use plain, readable text formatting.
`;

export async function translateText(text: string, from: Language, to: Language): Promise<string> {
  if (from === to) return text;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Translate the following text from ${from} to ${to}. Only output the translation.
    
    Text: ${text}`,
    config: {
      temperature: 0.1,
    }
  });

  return response.text || text;
}

export async function askMedicalQuestion(englishQuestion: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: englishQuestion,
    config: {
      systemInstruction: SYSTEM_INSTRUCTIONS,
      tools: [{ googleSearch: {} }],
      // googleSearch provides the RAG functionality by grounding the model in real-time medical data
    },
  });

  return response.text || "I apologize, but I couldn't find a reliable answer at this time. Please consult a doctor.";
}

export async function getDailyAwareness() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Find the latest breast cancer awareness news and research breakthroughs from the last 30 days (PubMed, Elsevier, etc.) and summarize them into a daily awareness highlight for the general public.",
    config: {
      systemInstruction: "Summarize concisely and include a 'Source' citation.",
      tools: [{ googleSearch: {} }],
    },
  });

  return response.text;
}
