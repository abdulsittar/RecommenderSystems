# Control Group Recommendation System - Implementation Plan

**Date Created:** November 26, 2025  
**Status:** Ready for Implementation  
**Case Study:** Three-group recommendation algorithm experiment

---

## Overview

This plan implements three control group recommendation algorithms (control, edge, center) with comprehensive survey data logging for case study analysis. Users are randomly assigned to groups on first login and shown personalized posts based on their stance from weekly surveys.

---

## Quick Start Implementation Prompt

```
Implement the control group recommendation system according to CONTROL_GROUP_IMPLEMENTATION_PLAN.md:

1. Create SurveyResponse model for historical logging
2. Extend User model with controlGroup, stanceScore, overtonWindow fields
3. Add perspectiveScore to Article model
4. Assign control groups randomly on user registration
5. Create stance calculation utilities
6. Build recommendation service with three algorithms (control/edge/center)
7. Update weekly survey endpoint to calculate and save stance data
8. Modify timeline endpoint to use recommendation service
9. Create migration script for existing data
10. Add testing UI elements to show control group and post metadata
11. Update frontend survey handler
12. Create analytics logging infrastructure

Follow the detailed specifications in each section below. All survey data must be logged with timestamps. Control groups should be visible in UI for testing but hidden in production.
```

---

## Architecture Context

### Existing Infrastructure (Already Implemented)
- **User Model:** `/server/models/User.js` - has `pool`, `version`, `currentTopic`, `lastSurveyDate`
- **WeeklyResponse Model:** `/server/models/WeeklyResponse.js` - stores current survey state with 13 fields
- **Article Model:** `/server/models/Article.js` - has `stance` (pro/con/neutral) and `strength` fields
- **Post Model:** `/server/models/Post.js` - has `content` (topic), `rank`, `articleId`, `title`, `desc`
- **Weekly Survey Endpoint:** `/server/routes/users.js` line 808 - POST `/:userId/weekly-survey`
- **Timeline Endpoint:** `/server/routes/posts.js` line 1035 - GET `/timelinePag/:userId`
- **Feed Component:** `/client/src/components/feed/Feed.js` - handles weekly survey with 13 slider inputs
- **Articles Data:** `/server/utils/articlesData.js` - loads articles from CSV with 409 articles

### Key Data Flow
```
User completes survey → Calculate stanceScore → Assign/use controlGroup → 
Fetch posts by topic → Apply recommendation algorithm → Filter by Overton window → 
Sort by algorithm logic → Return posts → Log recommendation event
```

---

## Implementation Steps

### 1. Create Survey Response Logging Model

**File:** `/server/models/SurveyResponse.js` (NEW)

```javascript
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
```

**Purpose:** Immutable log of every survey submission for temporal analysis. Enables tracking stance evolution over time per user per topic.

---

### 2. Extend User Model with Control Group Fields

**File:** `/server/models/User.js` (UPDATE)

Add these fields to the existing User schema:

```javascript
// Add after existing fields in UserSchema

controlGroup: {
    type: String,
    enum: ['control', 'edge', 'center', null],
    default: null
},

stanceScore: {
    type: Number,
    min: -1,
    max: 1,
    default: 0
},

overtonWindow: {
    min: { type: Number, default: -0.5 },
    max: { type: Number, default: 0.5 }
},

latestSurveyResults: {
    topicAttitude: { type: Number, default: 50 },
    oneSide_openminded: { type: Number, default: 5 },
    oneSide_moderate: { type: Number, default: 5 },
    oneSide_moral: { type: Number, default: 5 },
    oneSide_family: { type: Number, default: 5 },
    oneSide_friend: { type: Number, default: 5 },
    oneSide_coworker: { type: Number, default: 5 },
    otherSide_openminded: { type: Number, default: 5 },
    otherSide_moderate: { type: Number, default: 5 },
    otherSide_moral: { type: Number, default: 5 },
    otherSide_family: { type: Number, default: 5 },
    otherSide_friend: { type: Number, default: 5 },
    otherSide_coworker: { type: Number, default: 5 }
},

controlGroupAssignedAt: {
    type: Date,
    default: null
}
```

**Keep existing fields:** `pool`, `version`, `currentTopic`, `lastSurveyDate` for backward compatibility.

---

### 3. Add Perspective Score to Article Model

**File:** `/server/models/Article.js` (UPDATE)

Add this field to the existing Article schema:

```javascript
// Add after existing fields in ArticleSchema

perspectiveScore: {
    type: Number,
    min: -1,
    max: 1,
    default: 0,
    required: false
}
```

**Calculation formula:**
- If `stance === 'pro'`: `perspectiveScore = strength / 5` (assuming strength is 0-5)
- If `stance === 'con'`: `perspectiveScore = -(strength / 5)`
- If `stance === 'neutral'`: `perspectiveScore = 0`

---

### 4. Assign Control Groups on Registration

**File:** `/server/routes/auth.js` (UPDATE - find the login endpoint)

Add control group assignment on first successful login (after user verification):

```javascript
// In the login route, after successful authentication and before sending response

if (!user.controlGroup) {
    // Randomly assign control group on first login
    const groups = ['control', 'edge', 'center'];
    const assignedGroup = groups[Math.floor(Math.random() * groups.length)];
    
    user.controlGroup = assignedGroup;
    user.controlGroupAssignedAt = new Date();
    await user.save();
    
    logger.info('Control group assigned', { 
        userId: user._id, 
        controlGroup: assignedGroup 
    });
}
```

---

### 5. Create Stance Calculation Utilities

**File:** `/server/utils/stanceCalculations.js` (NEW)

```javascript
/**
 * Stance and Overton Window Calculation Utilities
 * For Control Group Recommendation System
 */

/**
 * Convert survey topicAttitude (0-100) to stanceScore (-1 to 1)
 * @param {number} topicAttitude - Survey response 0=strongly against, 50=neutral, 100=strongly for
 * @returns {number} Stance score in range [-1, 1]
 */
function surveyToStanceScore(topicAttitude) {
    if (topicAttitude === undefined || topicAttitude === null) {
        return 0; // Default to neutral
    }
    // Map 0-100 to -1 to 1
    return (topicAttitude - 50) / 50;
}

/**
 * Determine if user is centrist based on stance score
 * @param {number} stanceScore - User's stance (-1 to 1)
 * @param {number} threshold - Distance from 0 to be considered centrist (default 0.2)
 * @returns {boolean} True if centrist
 */
function isCentrist(stanceScore, threshold = 0.2) {
    return Math.abs(stanceScore) < threshold;
}

/**
 * Calculate Overton window based on topic and survey data
 * Currently uses fixed windows per topic
 * Future: can be dynamic based on open-mindedness scores
 * 
 * @param {string} topic - Current topic (abortion, climate, etc)
 * @param {Object} surveyResults - Survey response object
 * @returns {Object} {min: number, max: number}
 */
function calculateOvertonWindow(topic, surveyResults) {
    // Fixed windows per topic
    const topicWindows = {
        'abortion': { min: -0.6, max: 0.6 },
        'climate': { min: -0.5, max: 0.7 },
        'immigration': { min: -0.4, max: 0.6 },
        'default': { min: -0.5, max: 0.5 }
    };
    
    const window = topicWindows[topic] || topicWindows['default'];
    
    // Future enhancement: adjust window based on open-mindedness
    // const avgOpenmindedness = (surveyResults.oneSide_openminded + surveyResults.otherSide_openminded) / 2;
    // const windowMultiplier = avgOpenmindedness / 5; // Scale by openness
    
    return window;
}

/**
 * Calculate perspective score from article stance and strength
 * Used to convert existing article data to perspective scores
 * 
 * @param {string} stance - Article stance: 'pro', 'con', 'neutral'
 * @param {number} strength - Strength value (0-5 scale expected)
 * @returns {number} Perspective score in range [-1, 1]
 */
function calculatePerspectiveScore(stance, strength) {
    if (!stance || strength === undefined || strength === null) {
        return 0; // Default to neutral
    }
    
    // Normalize strength to 0-1 range if needed
    let normalizedStrength = strength;
    if (strength > 1) {
        normalizedStrength = Math.min(strength / 5, 1); // Assume 0-5 scale
    }
    
    // Ensure within bounds
    normalizedStrength = Math.max(0, Math.min(1, normalizedStrength));
    
    if (stance.toLowerCase() === 'pro') {
        return normalizedStrength; // Positive score
    } else if (stance.toLowerCase() === 'con') {
        return -normalizedStrength; // Negative score
    } else {
        return 0; // Neutral
    }
}

module.exports = {
    surveyToStanceScore,
    isCentrist,
    calculateOvertonWindow,
    calculatePerspectiveScore
};
```

---

### 6. Build Recommendation Service

**Directory:** `/server/services/` (CREATE DIRECTORY)

**File:** `/server/services/recommendationService.js` (NEW)

```javascript
const Post = require('../models/Post');
const Article = require('../models/Article');
const User = require('../models/User');
const { isCentrist } = require('../utils/stanceCalculations');
const logger = require('../logs/logger');

/**
 * Recommendation Service for Control Group Experiments
 * Implements three algorithms: control, edge, center
 */
class RecommendationService {
    
    /**
     * Main entry point for getting recommended posts
     * Routes to appropriate algorithm based on user's control group
     */
    async getRecommendedPosts(userId, topic, page = 0, limit = 5) {
        const user = await User.findById(userId);
        
        if (!user) {
            logger.warn('User not found for recommendations', { userId });
            return [];
        }
        
        if (!user.controlGroup || !user.stanceScore === undefined) {
            logger.info('User has no control group or stance, using default recommendations', { userId });
            return this.getDefaultRecommendations(userId, topic, page, limit);
        }
        
        logger.info('Getting recommendations', { 
            userId, 
            controlGroup: user.controlGroup, 
            topic, 
            stanceScore: user.stanceScore,
            overtonWindow: user.overtonWindow
        });
        
        switch(user.controlGroup) {
            case 'control':
                return this.controlGroupRecommendation(user, topic, page, limit);
            case 'edge':
                return this.edgeGroupRecommendation(user, topic, page, limit);
            case 'center':
                return this.centerGroupRecommendation(user, topic, page, limit);
            default:
                return this.getDefaultRecommendations(userId, topic, page, limit);
        }
    }
    
    /**
     * CONTROL GROUP ALGORITHM
     * Filter articles within Overton window
     * Rank by relevance to user's stance (distance)
     */
    async controlGroupRecommendation(user, topic, page, limit) {
        logger.info('Control group recommendation', { userId: user._id, topic });
        
        // Get all posts for topic with articles
        const posts = await this.getPostsWithArticles(topic);
        
        // Filter by Overton window
        const filtered = this.filterByOvertonWindow(posts, user.overtonWindow);
        
        // Sort by closeness to user's stance (most relevant first)
        const ranked = filtered.sort((a, b) => {
            const distanceA = Math.abs(a.article.perspectiveScore - user.stanceScore);
            const distanceB = Math.abs(b.article.perspectiveScore - user.stanceScore);
            return distanceA - distanceB;
        });
        
        // Paginate
        const start = page * limit;
        const paginated = ranked.slice(start, start + limit);
        
        // Log recommendation
        this.logRecommendation(user._id, 'control', topic, paginated);
        
        return this.populateAndFormat(paginated);
    }
    
    /**
     * EDGE GROUP ALGORITHM
     * If centrist: explore from both edges
     * If non-centrist: explore toward opposite stance
     */
    async edgeGroupRecommendation(user, topic, page, limit) {
        logger.info('Edge group recommendation', { userId: user._id, topic, stanceScore: user.stanceScore });
        
        const posts = await this.getPostsWithArticles(topic);
        const filtered = this.filterByOvertonWindow(posts, user.overtonWindow);
        
        const userIsCentrist = isCentrist(user.stanceScore);
        let ranked;
        
        if (userIsCentrist) {
            // Explore from both sides of the spectrum (edges)
            // Sort by distance from center, descending (furthest first = edges)
            const center = (user.overtonWindow.min + user.overtonWindow.max) / 2;
            ranked = filtered.sort((a, b) => {
                const distanceA = Math.abs(a.article.perspectiveScore - center);
                const distanceB = Math.abs(b.article.perspectiveScore - center);
                return distanceB - distanceA; // Descending - edges first
            });
        } else {
            // Non-centrist: move toward opposite stance
            if (user.stanceScore > 0) {
                // Pro-stance user: show con-stance articles (negative scores)
                const oppositeFiltered = filtered.filter(p => 
                    p.article.perspectiveScore <= user.stanceScore
                );
                ranked = oppositeFiltered.sort((a, b) => 
                    a.article.perspectiveScore - b.article.perspectiveScore // Move toward negative
                );
            } else {
                // Con-stance user: show pro-stance articles (positive scores)
                const oppositeFiltered = filtered.filter(p => 
                    p.article.perspectiveScore >= user.stanceScore
                );
                ranked = oppositeFiltered.sort((a, b) => 
                    b.article.perspectiveScore - a.article.perspectiveScore // Move toward positive
                );
            }
        }
        
        const start = page * limit;
        const paginated = ranked.slice(start, start + limit);
        
        this.logRecommendation(user._id, 'edge', topic, paginated);
        
        return this.populateAndFormat(paginated);
    }
    
    /**
     * CENTER GROUP ALGORITHM
     * Start from center of Overton window
     * If centrist: expand to both sides gradually
     * If non-centrist: expand toward opposite stance
     */
    async centerGroupRecommendation(user, topic, page, limit) {
        logger.info('Center group recommendation', { userId: user._id, topic, stanceScore: user.stanceScore });
        
        const posts = await this.getPostsWithArticles(topic);
        const filtered = this.filterByOvertonWindow(posts, user.overtonWindow);
        
        const center = (user.overtonWindow.min + user.overtonWindow.max) / 2;
        const userIsCentrist = isCentrist(user.stanceScore);
        let ranked;
        
        if (userIsCentrist) {
            // Expand from center to both sides gradually
            ranked = filtered.sort((a, b) => {
                const distanceA = Math.abs(a.article.perspectiveScore - center);
                const distanceB = Math.abs(b.article.perspectiveScore - center);
                return distanceA - distanceB; // Ascending - center first
            });
        } else {
            // Non-centrist: gradually expand toward opposite stance from center
            if (user.stanceScore > 0) {
                // Pro-stance user: show articles from center moving toward con
                const oppositeFiltered = filtered.filter(p => 
                    p.article.perspectiveScore <= center
                );
                ranked = oppositeFiltered.sort((a, b) => {
                    const distanceA = Math.abs(a.article.perspectiveScore - center);
                    const distanceB = Math.abs(b.article.perspectiveScore - center);
                    return distanceA - distanceB; // Start from center, move to con
                });
            } else {
                // Con-stance user: show articles from center moving toward pro
                const oppositeFiltered = filtered.filter(p => 
                    p.article.perspectiveScore >= center
                );
                ranked = oppositeFiltered.sort((a, b) => {
                    const distanceA = Math.abs(a.article.perspectiveScore - center);
                    const distanceB = Math.abs(b.article.perspectiveScore - center);
                    return distanceA - distanceB; // Start from center, move to pro
                });
            }
        }
        
        const start = page * limit;
        const paginated = ranked.slice(start, start + limit);
        
        this.logRecommendation(user._id, 'center', topic, paginated);
        
        return this.populateAndFormat(paginated);
    }
    
    /**
     * Default recommendations (no control group assigned)
     * Uses existing time-based chronological sorting
     */
    async getDefaultRecommendations(userId, topic, page, limit) {
        logger.info('Default recommendations', { userId, topic });
        
        const queryFilter = topic ? { content: topic } : {};
        
        return await Post.find(queryFilter)
            .sort({ createdAt: -1 })
            .skip(page * limit)
            .limit(limit)
            .populate('userId', 'username profilePicture')
            .populate({
                path: 'comments',
                model: 'Comment',
                populate: [
                    { path: 'userId', model: 'User' },
                    { path: 'likes', model: 'CommentLike' },
                    { path: 'dislikes', model: 'CommentDislike' }
                ]
            })
            .exec();
    }
    
    /**
     * Helper: Get posts with their associated articles
     */
    async getPostsWithArticles(topic) {
        // Get posts for topic that have articleIds
        const posts = await Post.find({ 
            content: topic,
            articleId: { $exists: true, $ne: null }
        }).exec();
        
        // Get unique article IDs
        const articleIds = [...new Set(posts.map(p => p.articleId))];
        
        // Fetch articles
        const articles = await Article.find({ 
            articleId: { $in: articleIds }
        }).exec();
        
        // Map articles by ID for quick lookup
        const articleMap = {};
        articles.forEach(article => {
            articleMap[article.articleId] = article;
        });
        
        // Combine posts with articles
        const postsWithArticles = posts
            .map(post => ({
                post,
                article: articleMap[post.articleId]
            }))
            .filter(item => item.article && item.article.perspectiveScore !== undefined);
        
        return postsWithArticles;
    }
    
    /**
     * Helper: Filter posts by Overton window
     */
    filterByOvertonWindow(postsWithArticles, overtonWindow) {
        return postsWithArticles.filter(item => 
            item.article.perspectiveScore >= overtonWindow.min && 
            item.article.perspectiveScore <= overtonWindow.max
        );
    }
    
    /**
     * Helper: Populate and format posts for response
     */
    async populateAndFormat(postsWithArticles) {
        const postIds = postsWithArticles.map(item => item.post._id);
        
        return await Post.find({ _id: { $in: postIds } })
            .populate('userId', 'username profilePicture')
            .populate({
                path: 'comments',
                model: 'Comment',
                populate: [
                    { path: 'userId', model: 'User' },
                    { path: 'likes', model: 'CommentLike' },
                    { path: 'dislikes', model: 'CommentDislike' }
                ]
            })
            .exec();
    }
    
    /**
     * Helper: Log recommendation for analytics
     */
    logRecommendation(userId, controlGroup, topic, posts) {
        const postIds = posts.map(item => item.post ? item.post._id : item._id);
        logger.info('Recommendation served', {
            userId,
            controlGroup,
            topic,
            postCount: posts.length,
            postIds
        });
    }
}

module.exports = new RecommendationService();
```

---

### 7. Update Weekly Survey Endpoint

**File:** `/server/routes/users.js` (UPDATE - around line 808)

Replace the existing weekly survey endpoint with this enhanced version:

```javascript
const { surveyToStanceScore, calculateOvertonWindow } = require('../utils/stanceCalculations');
const SurveyResponse = require('../models/SurveyResponse');

// Enhanced weekly survey endpoint with stance calculation and logging
router.post('/:userId/weekly-survey', verifyToken, async (req, res) => {
    logger.info('Weekly survey submitted', { userId: req.params.userId, data: req.body });
    
    try {
        const { surveyData, topic } = req.body;
        const user = await User.findById(req.params.userId);
        
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        
        // Calculate stance score from topicAttitude (0-100 → -1 to 1)
        const stanceScore = surveyToStanceScore(surveyData.topicAttitude);
        
        // Calculate Overton window for this topic
        const overtonWindow = calculateOvertonWindow(topic, surveyData);
        
        // Log survey response for historical analysis
        const surveyResponse = new SurveyResponse({
            userId: user._id,
            uniqueId: user.uniqueId,
            topic: topic,
            weekNumber: surveyData.weekNumber || 1,
            ...surveyData,
            calculatedStanceScore: stanceScore,
            calculatedOvertonWindow: overtonWindow,
            timestamp: new Date()
        });
        await surveyResponse.save();
        
        // Update WeeklyResponse for backward compatibility (existing code)
        await WeeklyResponse.findOneAndUpdate(
            { userId: user._id, topic: topic },
            {
                $set: {
                    ...surveyData,
                    topic: topic,
                    weekNumber: surveyData.weekNumber || 1
                }
            },
            { upsert: true, new: true }
        );
        
        // Update user document with calculated values
        await User.findByIdAndUpdate(
            req.params.userId,
            {
                $set: {
                    latestSurveyResults: surveyData,
                    currentTopic: topic,
                    lastSurveyDate: new Date(),
                    stanceScore: stanceScore,
                    overtonWindow: overtonWindow
                }
            },
            { new: true }
        );
        
        logger.info('Weekly survey processed', { 
            userId: req.params.userId,
            topic,
            stanceScore,
            overtonWindow,
            controlGroup: user.controlGroup
        });
        
        res.status(200).json({ 
            success: true,
            message: 'Survey saved successfully',
            controlGroup: user.controlGroup,
            stanceScore: stanceScore,
            overtonWindow: overtonWindow
        });
        
    } catch (err) {
        logger.error('Error saving weekly survey', { 
            userId: req.params.userId, 
            error: err.message 
        });
        res.status(500).json({ success: false, error: err.message });
    }
});
```

---

### 8. Modify Timeline Endpoint to Use Recommendations

**File:** `/server/routes/posts.js` (UPDATE - the `getLatestFivePosts` function around line 1131)

Replace the `getLatestFivePosts` function with this enhanced version:

```javascript
const recommendationService = require('../services/recommendationService');

// Get posts filtered by topic - now with control group recommendations
const getLatestFivePosts = async (userId, page = 0, topic = null) => {
  const currentUser = await User.findById(userId);
  if (!currentUser) return [];

  // ✅ If user has control group and stance score, use recommendation service
  if (currentUser.controlGroup && currentUser.stanceScore !== undefined && currentUser.stanceScore !== null) {
    logger.info('Using recommendation service', { 
      userId, 
      controlGroup: currentUser.controlGroup, 
      topic 
    });
    
    const limit = page === 0 ? 5 : 30;
    return await recommendationService.getRecommendedPosts(
      userId,
      topic || currentUser.currentTopic,
      page,
      limit
    );
  }

  // ✅ Default behavior for users without control groups (backward compatible)
  let queryFilter = {};
  
  if (topic) {
    queryFilter.content = topic;
  }

  logger.info('Using default time-based recommendations', { userId, topic });

  // For first page only (page = 0), return latest 5 posts
  if (page === 0) {
    return await Post.find(queryFilter)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'username profilePicture')
      .populate({
        path: 'comments',
        model: 'Comment',
        populate: [
          { path: 'userId', model: 'User' },
          { path: 'likes', model: 'CommentLike' },
          { path: 'dislikes', model: 'CommentDislike' }
        ]
      })
      .exec();
  }

  // For other pages
  const resultsPerPage = 30;
  return await Post.find(queryFilter)
    .sort({ createdAt: -1 })
    .skip(page * resultsPerPage)
    .limit(resultsPerPage)
    .populate('userId', 'username profilePicture')
    .populate({
      path: 'comments',
      model: 'Comment',
      populate: [
        { path: 'userId', model: 'User' },
        { path: 'likes', model: 'CommentLike' },
        { path: 'dislikes', model: 'CommentDislike' }
      ]
    })
    .exec();
};
```

---

### 9. Create Migration Script for Existing Data

**File:** `/server/scripts/migrateControlGroups.js` (NEW)

```javascript
const mongoose = require('mongoose');
const User = require('../models/User');
const Article = require('../models/Article');
const WeeklyResponse = require('../models/WeeklyResponse');
const { calculatePerspectiveScore, surveyToStanceScore, calculateOvertonWindow } = require('../utils/stanceCalculations');
const logger = require('../logs/logger');

// Database connection
mongoose.connect('mongodb+srv://abdulsittar72:2106010991As@cluster0.gsnbbwq.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function migrateArticlePerspectiveScores() {
    console.log('\n=== Migrating Article Perspective Scores ===\n');
    
    const articles = await Article.find({});
    console.log(`Found ${articles.length} articles to migrate`);
    
    let updated = 0;
    let errors = 0;
    
    for (const article of articles) {
        try {
            const perspectiveScore = calculatePerspectiveScore(article.stance, article.strength);
            article.perspectiveScore = perspectiveScore;
            await article.save();
            updated++;
            
            if (updated % 50 === 0) {
                console.log(`Progress: ${updated}/${articles.length} articles updated`);
            }
        } catch (err) {
            console.error(`Error updating article ${article.articleId}:`, err.message);
            errors++;
        }
    }
    
    console.log(`\n✅ Article migration complete: ${updated} updated, ${errors} errors\n`);
}

async function assignControlGroupsToUsers() {
    console.log('\n=== Assigning Control Groups to Users ===\n');
    
    // Find users who have completed surveys but don't have control groups
    const usersWithSurveys = await WeeklyResponse.distinct('userId');
    console.log(`Found ${usersWithSurveys.length} users with survey data`);
    
    const users = await User.find({
        _id: { $in: usersWithSurveys },
        controlGroup: null
    });
    
    console.log(`${users.length} users need control group assignment`);
    
    const groups = ['control', 'edge', 'center'];
    let assigned = 0;
    
    for (const user of users) {
        try {
            // Randomly assign
            const controlGroup = groups[Math.floor(Math.random() * groups.length)];
            user.controlGroup = controlGroup;
            user.controlGroupAssignedAt = new Date();
            
            // Get most recent survey to calculate stance
            const latestSurvey = await WeeklyResponse.findOne({ userId: user._id })
                .sort({ createdAt: -1 })
                .exec();
            
            if (latestSurvey) {
                user.stanceScore = surveyToStanceScore(latestSurvey.topicAttitude);
                user.overtonWindow = calculateOvertonWindow(latestSurvey.topic, latestSurvey);
                user.currentTopic = latestSurvey.topic;
                user.latestSurveyResults = {
                    topicAttitude: latestSurvey.topicAttitude,
                    oneSide_openminded: latestSurvey.oneSide_openminded,
                    oneSide_moderate: latestSurvey.oneSide_moderate,
                    oneSide_moral: latestSurvey.oneSide_moral,
                    oneSide_family: latestSurvey.oneSide_family,
                    oneSide_friend: latestSurvey.oneSide_friend,
                    oneSide_coworker: latestSurvey.oneSide_coworker,
                    otherSide_openminded: latestSurvey.otherSide_openminded,
                    otherSide_moderate: latestSurvey.otherSide_moderate,
                    otherSide_moral: latestSurvey.otherSide_moral,
                    otherSide_family: latestSurvey.otherSide_family,
                    otherSide_friend: latestSurvey.otherSide_friend,
                    otherSide_coworker: latestSurvey.otherSide_coworker
                };
            }
            
            await user.save();
            assigned++;
            
            console.log(`User ${user._id}: ${controlGroup} (stance: ${user.stanceScore.toFixed(2)})`);
        } catch (err) {
            console.error(`Error assigning control group to user ${user._id}:`, err.message);
        }
    }
    
    console.log(`\n✅ Control group assignment complete: ${assigned} users assigned\n`);
}

async function main() {
    try {
        console.log('Starting migration...\n');
        
        await migrateArticlePerspectiveScores();
        await assignControlGroupsToUsers();
        
        console.log('✅ Migration complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
}

main();
```

**Run migration:**
```bash
cd /home/matejas/TWON/RecommenderSystems/server
node scripts/migrateControlGroups.js
```

---

### 10. Add Testing UI Elements

**File:** `/client/src/components/feed/Feed.js` (UPDATE)

Add control group display in the component:

```javascript
// Add near the top of the Feed component, after state declarations

// Display user's control group for testing
useEffect(() => {
    if (currentUser && currentUser.controlGroup) {
        console.log('User Control Group:', currentUser.controlGroup);
        console.log('User Stance Score:', currentUser.stanceScore);
        console.log('Overton Window:', currentUser.overtonWindow);
    }
}, [currentUser]);

// Add visual indicator in JSX (somewhere visible, like topbar or sidebar)
{process.env.REACT_APP_DEBUG_MODE === 'true' && currentUser && (
    <div style={{
        position: 'fixed',
        top: 10,
        right: 10,
        padding: '10px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        borderRadius: '5px',
        zIndex: 9999,
        fontSize: '12px'
    }}>
        <div><strong>Control Group:</strong> {currentUser.controlGroup || 'None'}</div>
        <div><strong>Stance:</strong> {currentUser.stanceScore?.toFixed(2) || 'N/A'}</div>
        <div><strong>Window:</strong> [{currentUser.overtonWindow?.min?.toFixed(1)}, {currentUser.overtonWindow?.max?.toFixed(1)}]</div>
    </div>
)}
```

**File:** `/client/src/components/post/Post.js` (UPDATE)

Add post metadata overlay:

```javascript
// Add near the top of Post component
const [showDebug, setShowDebug] = useState(false);

// Add keyboard shortcut to toggle debug mode
useEffect(() => {
    const handleKeyPress = (e) => {
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            setShowDebug(prev => !prev);
        }
    };
    
    if (process.env.REACT_APP_DEBUG_MODE === 'true') {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }
}, []);

// Add debug overlay in JSX (after post content)
{process.env.REACT_APP_DEBUG_MODE === 'true' && showDebug && (
    <div style={{
        padding: '8px',
        backgroundColor: 'rgba(255, 255, 0, 0.2)',
        border: '1px solid #ffcc00',
        borderRadius: '4px',
        fontSize: '11px',
        marginTop: '8px'
    }}>
        <div><strong>Article ID:</strong> {post.articleId}</div>
        <div><strong>Perspective Score:</strong> {post.perspectiveScore?.toFixed(2) || 'N/A'}</div>
        <div><strong>Stance:</strong> {post.stance || 'N/A'}</div>
        <div><strong>Strength:</strong> {post.strength || 'N/A'}</div>
        <div style={{ fontSize: '10px', marginTop: '4px', fontStyle: 'italic' }}>
            Press Ctrl+D to toggle
        </div>
    </div>
)}
```

**Environment Setup:**

Create or update `.env` file in client directory:
```
REACT_APP_DEBUG_MODE=true
```

---

### 11. Update Frontend Weekly Survey Handler

**File:** `/client/src/components/feed/Feed.js` (UPDATE - `handleWeeklySurveySubmit` function)

```javascript
const handleWeeklySurveySubmit = async () => {
    try {
        const response = await fetch(`/api/users/${currentUser._id}/weekly-survey`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('token') // Adjust based on your auth setup
            },
            body: JSON.stringify({
                surveyData: weeklyData,
                topic: currentTopic // Make sure currentTopic is defined
            })
        });

        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Survey submitted successfully');
            console.log('Control Group:', result.controlGroup);
            console.log('Stance Score:', result.stanceScore);
            console.log('Overton Window:', result.overtonWindow);
            
            // Update local user state if needed
            setCurrentUser(prev => ({
                ...prev,
                controlGroup: result.controlGroup,
                stanceScore: result.stanceScore,
                overtonWindow: result.overtonWindow
            }));
            
            // Close survey modal
            setWeeklySurveyOpen(false);
            
            // Refresh feed to get new recommendations
            // Trigger your existing feed refresh logic here
            window.location.reload(); // Simple approach, or use your state management
        } else {
            console.error('Survey submission failed:', result.error);
            alert('Failed to submit survey: ' + result.error);
        }
    } catch (error) {
        console.error('Error submitting survey:', error);
        alert('Error submitting survey. Please try again.');
    }
};
```

---

### 12. Create Analytics & Logging Infrastructure

**File:** `/server/models/RecommendationLog.js` (NEW)

```javascript
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
```

**File:** `/server/routes/analytics.js` (NEW)

```javascript
const router = require('express').Router();
const RecommendationLog = require('../models/RecommendationLog');
const SurveyResponse = require('../models/SurveyResponse');
const verifyToken = require('../middleware/verifyToken');
const logger = require('../logs/logger');

// Get recommendation logs for analysis
router.get('/recommendations', verifyToken, async (req, res) => {
    try {
        const { userId, controlGroup, topic, startDate, endDate, limit = 100 } = req.query;
        
        let query = {};
        
        if (userId) query.userId = userId;
        if (controlGroup) query.controlGroup = controlGroup;
        if (topic) query.topic = topic;
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }
        
        const logs = await RecommendationLog.find(query)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit))
            .populate('userId', 'username')
            .exec();
        
        res.status(200).json({ success: true, count: logs.length, logs });
    } catch (err) {
        logger.error('Error fetching recommendation logs', { error: err.message });
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get survey response history for analysis
router.get('/survey-responses', verifyToken, async (req, res) => {
    try {
        const { userId, topic, startDate, endDate, limit = 100 } = req.query;
        
        let query = {};
        
        if (userId) query.userId = userId;
        if (topic) query.topic = topic;
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }
        
        const responses = await SurveyResponse.find(query)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit))
            .populate('userId', 'username')
            .exec();
        
        res.status(200).json({ success: true, count: responses.length, responses });
    } catch (err) {
        logger.error('Error fetching survey responses', { error: err.message });
        res.status(500).json({ success: false, error: err.message });
    }
});

// Export case study data
router.post('/export-case-study-data', verifyToken, async (req, res) => {
    try {
        const { startDate, endDate, format = 'json' } = req.body;
        
        let dateFilter = {};
        if (startDate || endDate) {
            dateFilter = {};
            if (startDate) dateFilter.$gte = new Date(startDate);
            if (endDate) dateFilter.$lte = new Date(endDate);
        }
        
        // Gather all data
        const surveyResponses = await SurveyResponse.find(
            dateFilter.timestamp ? { timestamp: dateFilter } : {}
        ).populate('userId', 'username controlGroup').exec();
        
        const recommendationLogs = await RecommendationLog.find(
            dateFilter.timestamp ? { timestamp: dateFilter } : {}
        ).populate('userId', 'username controlGroup').exec();
        
        const data = {
            exportDate: new Date().toISOString(),
            dateRange: { startDate, endDate },
            surveyResponses: surveyResponses,
            recommendationLogs: recommendationLogs,
            summary: {
                totalSurveys: surveyResponses.length,
                totalRecommendations: recommendationLogs.length,
                controlGroups: {
                    control: surveyResponses.filter(s => s.userId?.controlGroup === 'control').length,
                    edge: surveyResponses.filter(s => s.userId?.controlGroup === 'edge').length,
                    center: surveyResponses.filter(s => s.userId?.controlGroup === 'center').length
                }
            }
        };
        
        if (format === 'csv') {
            // Convert to CSV format (simplified)
            const csv = convertToCSV(data);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=case-study-data.csv');
            res.status(200).send(csv);
        } else {
            res.status(200).json({ success: true, data });
        }
        
    } catch (err) {
        logger.error('Error exporting case study data', { error: err.message });
        res.status(500).json({ success: false, error: err.message });
    }
});

function convertToCSV(data) {
    // Simplified CSV conversion - implement full conversion as needed
    const headers = 'userId,controlGroup,topic,timestamp,topicAttitude,stanceScore\n';
    const rows = data.surveyResponses.map(r => 
        `${r.userId?._id},${r.userId?.controlGroup},${r.topic},${r.timestamp},${r.topicAttitude},${r.calculatedStanceScore}`
    ).join('\n');
    return headers + rows;
}

module.exports = router;
```

**Register analytics routes in main server file (`server/index.js`):**
```javascript
const analyticsRoutes = require('./routes/analytics');
app.use('/api/analytics', analyticsRoutes);
```

---

## Testing Checklist

After implementation, test these scenarios:

- [ ] New user registration assigns random control group
- [ ] Weekly survey submission calculates and saves stance score
- [ ] Survey data is logged to SurveyResponse collection
- [ ] Timeline endpoint returns different posts for different control groups
- [ ] Control group badge is visible in UI when DEBUG_MODE=true
- [ ] Post metadata overlay shows perspective score (Ctrl+D)
- [ ] Migration script successfully updates articles and users
- [ ] Users in "control" group see posts ranked by relevance to their stance
- [ ] Users in "edge" group see posts at window boundaries
- [ ] Users in "center" group see posts starting from center
- [ ] Analytics endpoints return recommendation logs
- [ ] Case study data export works

---

## Production Deployment Notes

Before deploying to production:

1. **Set `REACT_APP_DEBUG_MODE=false`** in client environment
2. **Remove or disable testing UI elements** (control group badges, post metadata)
3. **Add authentication** to analytics endpoints (admin only)
4. **Set up monitoring** for recommendation service performance
5. **Create database backups** before running migration
6. **Test thoroughly** with multiple control groups
7. **Document control group assignment** for participants
8. **Set up automated data exports** for case study analysis

---

## Key Configuration Files

- **Overton Windows:** Fixed in `stanceCalculations.js` (lines 48-56)
- **Control Groups:** Assigned in `auth.js` login endpoint
- **Centrist Threshold:** Set to 0.2 in `stanceCalculations.js` (line 26)
- **Perspective Score Normalization:** 0-5 scale in `stanceCalculations.js` (line 80)
- **Debug Mode:** `REACT_APP_DEBUG_MODE` environment variable

---

## Data Schema Summary

### User Fields (Added)
- `controlGroup`: String ('control'/'edge'/'center')
- `stanceScore`: Number (-1 to 1)
- `overtonWindow`: {min: Number, max: Number}
- `latestSurveyResults`: Object (13 fields)
- `controlGroupAssignedAt`: Date

### Article Fields (Added)
- `perspectiveScore`: Number (-1 to 1)

### New Collections
- `SurveyResponse`: Logs every survey submission
- `RecommendationLog`: Logs every recommendation served

---

## Algorithm Pseudocode Reference

### Control Group
```
1. Filter articles within overtonWindow
2. Sort by abs(article.perspectiveScore - user.stanceScore) ascending
3. Return top N posts
```

### Edge Group
```
If user is centrist:
    1. Filter articles within overtonWindow
    2. Sort by distance from window center descending (furthest = edges)
    3. Return top N posts
Else:
    1. Filter articles on opposite side of user's stance
    2. Sort moving toward opposite stance
    3. Return top N posts
```

### Center Group
```
If user is centrist:
    1. Filter articles within overtonWindow
    2. Sort by distance from window center ascending (closest = center)
    3. Return top N posts
Else:
    1. Filter articles from center toward opposite stance
    2. Sort by distance from center ascending
    3. Return top N posts
```

---

## Support & Contact

For questions during implementation:
- Review this document thoroughly first
- Check existing code structure in files mentioned
- Test incrementally (one step at a time)
- Use console logs and debug mode extensively
- Verify database updates after migration

---

**End of Implementation Plan**
