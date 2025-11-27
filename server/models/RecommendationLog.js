const mongoose = require('mongoose');

const RecommendationLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    controlGroup: {
        type: String,
        enum: ['control', 'edge', 'center'],
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    postIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    algorithm: {
        type: String,
        required: true
    },
    stanceScore: {
        type: Number
    },
    overtonWindow: {
        min: Number,
        max: Number
    },
    pageNumber: {
        type: Number,
        default: 0
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    timestamps: true
});

// Indices for efficient querying
RecommendationLogSchema.index({ userId: 1, timestamp: -1 });
RecommendationLogSchema.index({ controlGroup: 1, topic: 1 });
RecommendationLogSchema.index({ timestamp: -1 });

module.exports = mongoose.model('RecommendationLog', RecommendationLogSchema);
