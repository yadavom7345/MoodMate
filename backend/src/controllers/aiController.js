import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function fallbackAnalyze(text) {
    const lowerText = text.toLowerCase();
    const positive = ['happy', 'good', 'great', 'love', 'excited'].filter(w => lowerText.includes(w)).length;
    const negative = ['sad', 'bad', 'hate', 'tired', 'angry'].filter(w => lowerText.includes(w)).length;

    let score = 5 + positive - negative;
    return {
        moodScore: Math.max(1, Math.min(10, score)),
        tags: ['offline-analysis']
    };
}

export const analyzeEntry = async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
      Analyze the following journal entry and return a JSON object with exactly two keys:
      1. "moodScore": an integer from 1 (lowest/sad) to 10 (highest/happy) based on the sentiment.
      2. "tags": an array of short strings (1-2 words) representing key activities, topics, or emotions found in the text.
      
      Ensure the response is valid JSON. Do not include markdown code blocks.
      
      Entry: "${text}"
    `;

        console.log("Sending to Gemini...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();
        console.log("Gemini Raw Response:", textResponse);

        const cleanJson = textResponse.replace(/```json|```/g, '').trim();
        const data = JSON.parse(cleanJson);

        const resultData = {
            moodScore: Math.max(1, Math.min(10, Number(data.moodScore) || 5)),
            tags: Array.isArray(data.tags) ? data.tags.slice(0, 5) : ['general']
        };
        res.json(resultData);
    } catch (error) {
        console.error("Gemini Analysis Failed:", error);
        res.json(fallbackAnalyze(text));
    }
};

export const semanticSearch = async (req, res) => {
    const { query, entries } = req.body;
    if (!query || !entries) return res.status(400).json({ error: "Query and entries are required" });

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const simplifiedEntries = entries.map(e => ({
            id: e.id,
            text: e.text.substring(0, 200),
            tags: e.tags
        }));

        const prompt = `
      I have a list of journal entries. I need you to find the ones that are semantically relevant to the user's search query.
      
      User Query: "${query}"
      
      Entries:
      ${JSON.stringify(simplifiedEntries)}
      
      Task: Return a JSON array of strings containing ONLY the "id" of the entries that match the query's meaning.
      If no entries match, return an empty array [].
      Do not include any explanation, just the JSON array.
    `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleanJson = text.replace(/```json|```/g, '').trim();
        const ids = JSON.parse(cleanJson);
        res.json(ids);
    } catch (error) {
        console.error("Semantic Search Failed:", error);
        res.json([]);
    }
};
