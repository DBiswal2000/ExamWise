import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
    email: String,
    category: String,
    correct: Number,
    wrong: Number,
    total: Number,
    analysis: [
        {
            topic: String,
            correct: Number,
            total: Number
        }
    ],
    focusTopics: [String],
    submittedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Result || mongoose.model('Result', resultSchema);
