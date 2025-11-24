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
    // Q1: Overall attitude toward the topic (1-100 scale)
    topicAttitude: {
        type: Number,
        required: false,
        min: 1,
        max: 100,
        default: 50
    },
    // Q2-Q4: Perception of ONE SIDE advocates
    oneSide_openminded: {
        type: Number,
        required: false,
        min: 1,
        max: 10,
        default: 5
    },
    oneSide_moderate: {
        type: Number,
        required: false,
        min: 1,
        max: 10,
        default: 5
    },
    oneSide_moral: {
        type: Number,
        required: false,
        min: 1,
        max: 10,
        default: 5
    },
    oneSide_family: {
        type: Number,
        required: false,
        min: 1,
        max: 10,
        default: 5
    },
    oneSide_friend: {
        type: Number,
        required: false,
        min: 1,
        max: 10,
        default: 5
    },
    oneSide_coworker: {
        type: Number,
        required: false,
        min: 1,
        max: 10,
        default: 5
    },
    // Q5-Q7: Perception of OTHER SIDE advocates
    otherSide_openminded: {
        type: Number,
        required: false,
        min: 1,
        max: 10,
        default: 5
    },
    otherSide_moderate: {
        type: Number,
        required: false,
        min: 1,
        max: 10,
        default: 5
    },
    otherSide_moral: {
        type: Number,
        required: false,
        min: 1,
        max: 10,
        default: 5
    },
    otherSide_family: {
        type: Number,
        required: false,
        min: 1,
        max: 10,
        default: 5
    },
    otherSide_friend: {
        type: Number,
        required: false,
        min: 1,
        max: 10,
        default: 5
    },
    otherSide_coworker: {
        type: Number,
        required: false,
        min: 1,
        max: 10,
        default: 5
    }
}, {
    timestamps: true
});

// Index to ensure we can efficiently query by user and week
WeeklyResponseSchema.index({ uniqueId: 1, weekNumber: 1 });

module.exports = mongoose.model('WeeklyResponse', WeeklyResponseSchema);