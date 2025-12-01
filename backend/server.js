import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import aiRoutes from './src/routes/aiRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import entryRoutes from './src/routes/entryRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/ai', aiRoutes); // Keep for standalone search if needed
app.use('/api/auth', authRoutes);
app.use('/api/entries', entryRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
