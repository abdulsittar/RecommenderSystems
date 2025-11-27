const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    articleId: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    strength: {
        type: Number,
        default: null
    },
    stance: {
        type: String,
        default: null
    },
    perspectiveScore: {
        type: Number,
        min: -1,
        max: 1,
        default: 0,
        required: false
    }
}, 
{timestamps: true}
);

module.exports = mongoose.model('Article', ArticleSchema);