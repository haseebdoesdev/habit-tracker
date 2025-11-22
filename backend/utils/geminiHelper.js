// app.js
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

// Initialize the new client
// It automatically looks for GEMINI_API_KEY in process.env, 
// but passing it explicitly is good practice.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Define the model once to reuse
const MODEL_NAME = "gemini-2.5-flash";

/**
 * Basic content generation
 */
export const generateContent = async (prompt) => {
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt, // The new SDK handles simple string prompts automatically
        });

        return response.text;
    } catch (error) {
        console.error("Error generating content:", error);
        throw new Error("AI generation failed");
    }
};

/**
 * Analysis with text output
 */
export const analyzeHabits = async (habitData) => {
    const prompt = `Analyze this habit data for consistency and improvements: ${JSON.stringify(habitData)}`;
    return await generateContent(prompt);
};

/**
 * Structured output (JSON) using the new 'responseSchema'
 */
export const suggestHabits = async (userGoals) => {
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `Suggest 3 daily habits based on these goals: ${userGoals}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "ARRAY",
                    items: { type: "STRING" }
                },
            },
        });

        // The new SDK allows automatic parsing if the schema is set
        // But response.text is still the raw JSON string.
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error suggesting habits:", error);
        return [];
    }
};