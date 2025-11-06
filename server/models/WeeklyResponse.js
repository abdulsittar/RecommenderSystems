const mongoose = require('mongoose');

const WeeklyResponseSchema = new mongoose.Schema({
    uniqueId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'IDStorage' 
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    },
    topic: {
        type: String,
        required: false,
        default: null
    },
    weekNumber: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    },
    // Topic-specific questions (3 questions, 0-10 scale)
    // Q1: Attitude toward the topic (0 = Very negative, 10 = Very positive)
    topicAttitude: {
        type: Number,
        required: false,
        min: 0,
        max: 10,
        default: 5
    },
    // Q2: Interest in learning more about this topic (0 = Not interested, 10 = Very interested)
    topicInterest: {
        type: Number,
        required: false,
        min: 0,
        max: 10,
        default: 5
    },
    // Q3: Confidence in your knowledge about this topic (0 = Not confident, 10 = Very confident)
    topicKnowledge: {
        type: Number,
        required: false,
        min: 0,
        max: 10,
        default: 5
    }
}, {
    timestamps: true
});

// Index to ensure we can efficiently query by user and week
WeeklyResponseSchema.index({ uniqueId: 1, weekNumber: 1 });

module.exports = mongoose.model('WeeklyResponse', WeeklyResponseSchema);