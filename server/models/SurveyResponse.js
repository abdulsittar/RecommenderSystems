const mongoose = require('mongoose');

const SurveyResponseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    uniqueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'IDStorage',
        required: false
    },
    topic: {
        type: String,
        required: true
    },
    weekNumber: {
        type: Number,
        default: 1
    },
    
    // Survey responses (same as WeeklyResponse)
    topicAttitude: {
        type: Number,
        min: 0,
        max: 100,
        default: 50
    },
    oneSide_openminded: { type: Number, min: 1, max: 10, default: 5 },
    oneSide_moderate: { type: Number, min: 1, max: 10, default: 5 },
    oneSide_moral: { type: Number, min: 1, max: 10, default: 5 },
    oneSide_family: { type: Number, min: 1, max: 10, default: 5 },
    oneSide_friend: { type: Number, min: 1, max: 10, default: 5 },
    oneSide_coworker: { type: Number, min: 1, max: 10, default: 5 },
    otherSide_openminded: { type: Number, min: 1, max: 10, default: 5 },
    otherSide_moderate: { type: Number, min: 1, max: 10, default: 5 },
    otherSide_moral: { type: Number, min: 1, max: 10, default: 5 },
    otherSide_family: { type: Number, min: 1, max: 10, default: 5 },
    otherSide_friend: { type: Number, min: 1, max: 10, default: 5 },
    otherSide_coworker: { type: Number, min: 1, max: 10, default: 5 },
    
    // Calculated fields (saved for analysis)
    calculatedStanceScore: {
        type: Number,
        min: -1,
        max: 1,
        default: 0
    },
    calculatedOvertonWindow: {
        min: { type: Number, default: -0.5 },
        max: { type: Number, default: 0.5 }
    },
    
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    timestamps: true
});

// Index for efficient querying
SurveyResponseSchema.index({ userId: 1, topic: 1, timestamp: -1 });
SurveyResponseSchema.index({ timestamp: -1 });

module.exports = mongoose.model('SurveyResponse', SurveyResponseSchema);
