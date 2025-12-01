import JournalEntry from '../models/JournalEntry.js';
import { analyzeEntry as aiAnalyze } from './aiController.js';

// Helper to reuse AI logic or call it internally
// Ideally, we refactor aiController to export the logic function, not just the req/res handler.
// For now, let's keep it simple: The frontend calls /analyze to get data, then calls /entries to save it.
// OR: We can do it all in one go here. Let's do it all in one go for better UX (one API call).

import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getAiAnalysis(text) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
      Analyze the following journal entry and return a JSON object with exactly two keys:
      1. "moodScore": an integer from 1 (lowest/sad) to 10 (highest/happy) based on the sentiment.
      2. "tags": an array of short strings (1-2 words) representing key activities, topics, or emotions found in the text.
      Entry: "${text}"
      Ensure valid JSON.
    `;
        const result = await model.generateContent(prompt);
        const textResponse = result.response.text();
        const cleanJson = textResponse.replace(/```json|```/g, '').trim();
        const data = JSON.parse(cleanJson);
        return {
            moodScore: Math.max(1, Math.min(10, Number(data.moodScore) || 5)),
            tags: Array.isArray(data.tags) ? data.tags.slice(0, 5) : ['general']
        };
    } catch (error) {
        console.error("AI Analysis Error:", error);
        // Fallback
        return { moodScore: 5, tags: ['offline'] };
    }
}

export const createEntry = async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ message: 'Text is required' });
    }

    try {
        // 1. Analyze with AI
        const analysis = await getAiAnalysis(text);

        // 2. Save to DB
        const entry = await JournalEntry.create({
            userId: req.user.id,
            text,
            moodScore: analysis.moodScore,
            tags: analysis.tags
        });

        res.status(201).json(entry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getEntries = async (req, res) => {
    try {
        const entries = await JournalEntry.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
