import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');

export async function askGemini(prompt: string): Promise<string> {
  if (!apiKey) {
    return 'Gemini API key is missing. Please check your .env.local file.';
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini Error:', error);
    return 'Sorry, I encountered an error answering your request.';
  }
}