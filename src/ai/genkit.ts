import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Initialize Genkit with Google AI (Gemini)
// Requires GOOGLE_GENAI_API_KEY environment variable
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    })
  ],
  model: 'googleai/gemini-2.0-flash-exp',
});

// Export a helper function to check if AI is configured
export function isAIConfigured(): boolean {
  return !!process.env.GOOGLE_GENAI_API_KEY;
}
