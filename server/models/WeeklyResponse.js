const mongoose = require('mongoose');

const WeeklyResponseSchema = new mongoose.Schema({
    uniqueId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'IDStorage' 
    },
    weekNumber: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    },
    // Q4: Political issue attitudes (0-100 scale)
    politicalIssueRating: {
        type: Number,
        required: false,
        min: 0,
        max: 100,
        default: 50
    },
    // Political outgroup ratings (0-10 scales)
    openmindedRating: {
        type: Number,
        required: false,
        min: 0,
        max: 10,
        default: 5
    },
    extremistRating: {
        type: Number,
        required: false,
        min: 0,
        max: 10,
        default: 5
    },
    moralRating: {
        type: Number,
        required: false,
        min: 0,
        max: 10,
        default: 5
    },
    // Social distance measures (0-10 scales)
    familyHappiness: {
        type: Number,
        required: false,
        min: 0,
        max: 10,
        default: 5
    },
    friendHappiness: {
        type: Number,
        required: false,
        min: 0,
        max: 10,
        default: 5
    },
    coworkerHappiness: {
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