import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    moodScore: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    tags: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('JournalEntry', entrySchema);
