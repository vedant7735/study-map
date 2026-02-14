// src/lib/groq.ts

import Groq from 'groq-sdk';

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is not set in environment variables');
}

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Model configuration
export const GROQ_CONFIG = {
  model: 'groq/compound', // Best for complex analysis
  fallbackModel: 'llama-3.3-70b-versatile', // Fallback if compound fails
  temperature: 0.3, // Lower = more consistent
  maxTokens: 4000, // Response limit
};