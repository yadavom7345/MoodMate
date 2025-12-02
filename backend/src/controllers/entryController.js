import JournalEntry from '../models/JournalEntry.js';
import { analyzeEntry as aiAnalyze } from './aiController.js';

// Helper to reuse AI logic or call it internally
// Ideally, we refactor aiController to export the logic function, not just the req/res handler.
// For now, let's keep it simple: The frontend calls /analyze to get data, then calls /entries to save it.
// OR: We can do it all in one go here. Let's do it all in one go for better UX (one API call).



async function getAiAnalysis(text) {
    try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
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
        const { page = 1, limit = 8, startDate, endDate, mood, search, sortBy = 'latest' } = req.query;
        const query = { userId: req.user.id };

        // Date Filtering
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999); // Include the whole end day
                query.createdAt.$lte = end;
            }
        }

        // Mood Filtering
        if (mood && mood !== 'all') {
            if (mood === 'happy') query.moodScore = { $gte: 7 };
            else if (mood === 'neutral') query.moodScore = { $gte: 5, $lt: 7 };
            else if (mood === 'sad') query.moodScore = { $lt: 5 };
        }

        // Search Filtering
        if (search) {
            query.$or = [
                { text: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }

        // Sorting
        let sortOptions = { createdAt: -1 }; // Default: Latest
        if (sortBy === 'oldest') sortOptions = { createdAt: 1 };
        else if (sortBy === 'highest') sortOptions = { moodScore: -1 };
        else if (sortBy === 'lowest') sortOptions = { moodScore: 1 };

        const total = await JournalEntry.countDocuments(query);
        const entries = await JournalEntry.find(query)
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.json({
            entries,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page: Number(page),
                limit: Number(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateEntry = async (req, res) => {
    const { id } = req.params;
    const { text, tags, createdAt } = req.body;

    try {
        const entry = await JournalEntry.findById(id);

        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        // Check ownership
        if (entry.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        entry.text = text || entry.text;
        entry.tags = tags || entry.tags;
        if (createdAt) entry.createdAt = createdAt;

        const updatedEntry = await entry.save();
        res.json(updatedEntry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteEntry = async (req, res) => {
    const { id } = req.params;

    try {
        const entry = await JournalEntry.findById(id);

        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        // Check ownership
        if (entry.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await entry.deleteOne();
        res.json({ message: 'Entry removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
