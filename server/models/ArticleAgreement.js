const mongoose = require('mongoose');

const ArticleAgreementSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    articleId: {
        type: mongoose.Schema.Types.Mixed,
        required: false
    },
    agreementValue: {
        type: Number,
        min: 0,
        max: 10,
        required: true
    },
    lastInteractedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

ArticleAgreementSchema.index({ userId: 1, postId: 1 }, { unique: true });
ArticleAgreementSchema.index({ postId: 1, createdAt: -1 });

module.exports = mongoose.model('ArticleAgreement', ArticleAgreementSchema);
