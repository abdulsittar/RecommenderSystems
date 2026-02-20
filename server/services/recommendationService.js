const mongoose = require('mongoose');
const Post = require('../models/Post');
const Article = require('../models/Article');
const User = require('../models/User');
const { isCentrist } = require('../utils/stanceCalculations');
const { calculatePerspectiveScore } = require('../utils/stanceCalculations');
const { articlesData, getArticleById } = require('../utils/articlesData');
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
    async getRecommendedPosts(userId, topic, page = 0, limit = 5, excludeIds = [], excludeArticleIds = []) {
        const user = await User.findById(userId);
        
        if (!user) {
            logger.warn('User not found for recommendations', { userId });
            return [];
        }
        
        if (!user.controlGroup || user.stanceScore === undefined) {
            logger.info('User has no control group or stance, using default recommendations', { userId });
            return this.getDefaultRecommendations(userId, topic, page, limit, excludeIds, excludeArticleIds);
        }
        
        logger.info('Getting recommendations', { 
            userId, 
            controlGroup: user.controlGroup, 
            topic, 
            stanceScore: user.stanceScore,
            overtonWindow: user.overtonWindow,
            excludeCount: excludeIds.length,
            excludeArticleCount: excludeArticleIds.length
        });
        
        switch(user.controlGroup) {
            case 'control':
                return this.controlGroupRecommendation(user, topic, page, limit, excludeIds, excludeArticleIds);
            case 'edge':
                return this.edgeGroupRecommendation(user, topic, page, limit, excludeIds, excludeArticleIds);
            case 'center':
                return this.centerGroupRecommendation(user, topic, page, limit, excludeIds, excludeArticleIds);
            default:
                return this.getDefaultRecommendations(userId, topic, page, limit, excludeIds, excludeArticleIds);
        }
    }
    
    /**
     * CONTROL GROUP ALGORITHM
     * Filter articles within Overton window
     * Rank by relevance to user's stance (distance)
     */
    async controlGroupRecommendation(user, topic, page, limit, excludeIds = [], excludeArticleIds = []) {
        logger.info('Control group recommendation', { userId: user._id, topic, excludeCount: excludeIds.length, excludeArticleCount: excludeArticleIds.length });
        
        // Get all posts for topic with articles
        const posts = await this.getPostsWithArticles(topic, excludeIds, excludeArticleIds);
        
        // Filter by Overton window
        const filtered = this.filterByOvertonWindow(posts, user.overtonWindow);
        
        // Sort by closeness to user's stance (most relevant first)
        const ranked = filtered.sort((a, b) => {
            const distanceA = Math.abs(a.article.perspectiveScore - user.stanceScore);
            const distanceB = Math.abs(b.article.perspectiveScore - user.stanceScore);
            return distanceA - distanceB;
        });
        
        // Deduplicate by articleId (keep first/best occurrence)
        const deduplicated = this.deduplicateByArticleId(ranked);
        
        // Get only the first `limit` posts (no pagination offset needed since we exclude already shown)
        const paginated = deduplicated.slice(0, limit);
        
        // Log recommendation
        this.logRecommendation(user._id, 'control', topic, paginated);
        
        return this.populateAndFormat(paginated);
    }
    
    /**
     * EDGE GROUP ALGORITHM
     * Start from edges of Overton window, then move beyond
     * - Centrists: Get articles from both edges of window, then towards extremes (±1.0)
     * - Extremists: Get articles from opposite edge of window, moving away from user
     */
    async edgeGroupRecommendation(user, topic, page, limit, excludeIds = [], excludeArticleIds = []) {
        logger.info('Edge group recommendation', { userId: user._id, topic, stanceScore: user.stanceScore, excludeCount: excludeIds.length, excludeArticleCount: excludeArticleIds.length });
        
        const posts = await this.getPostsWithArticles(topic, excludeIds, excludeArticleIds);
        
        const userIsCentrist = isCentrist(user.stanceScore);
        const windowCenter = (user.overtonWindow.min + user.overtonWindow.max) / 2;
        let ranked;
        
        if (userIsCentrist) {
            // Centrists: Start from OUTSIDE the window edges, move towards extremes
            // Show articles closest to edges (just outside), then progressively more extreme
            ranked = posts.sort((a, b) => {
                // Convert perspective scores from [-1, 1] to [0, 100] for comparison with window
                const scoreA = (a.article.perspectiveScore + 1) * 50;
                const scoreB = (b.article.perspectiveScore + 1) * 50;
                
                const isAInWindow = scoreA >= user.overtonWindow.min && scoreA <= user.overtonWindow.max;
                const isBInWindow = scoreB >= user.overtonWindow.min && scoreB <= user.overtonWindow.max;
                
                // Distance to nearest edge (for articles outside window)
                const distToEdgeA = Math.min(
                    Math.abs(scoreA - user.overtonWindow.min),
                    Math.abs(scoreA - user.overtonWindow.max)
                );
                const distToEdgeB = Math.min(
                    Math.abs(scoreB - user.overtonWindow.min),
                    Math.abs(scoreB - user.overtonWindow.max)
                );
                
                // If both outside window: prefer closest to edges first
                if (!isAInWindow && !isBInWindow) {
                    return distToEdgeA - distToEdgeB; // Closest to edges first
                }
                
                // If both inside window: deprioritize (show after outside articles)
                if (isAInWindow && isBInWindow) {
                    return 1; // Both equally low priority
                }
                
                // One inside, one outside: prefer outside first
                return isAInWindow ? 1 : -1;
            });
        } else {
            // Extremists: Start from opposite edge of window, move away from user towards opposite extreme
            // Determine which edge is the "opposite" edge
            const oppositeEdge = user.stanceScore > 0 
                ? user.overtonWindow.min  // Pro-stance user: start from min (con side)
                : user.overtonWindow.max; // Con-stance user: start from max (pro side)
            
            // Sort by distance from opposite edge (closest to opposite edge first, then further)
            ranked = posts.sort((a, b) => {
                // Convert perspective scores from [-1, 1] to [0, 100] for comparison
                const scoreA = (a.article.perspectiveScore + 1) * 50;
                const scoreB = (b.article.perspectiveScore + 1) * 50;
                
                const distA = Math.abs(scoreA - oppositeEdge);
                const distB = Math.abs(scoreB - oppositeEdge);
                return distA - distB; // Closest to opposite edge first
            });
        }
        
        // Deduplicate by articleId (keep first/best occurrence)
        const deduplicated = this.deduplicateByArticleId(ranked);
        
        // Get only the first `limit` posts (no pagination offset needed since we exclude already shown)
        const paginated = deduplicated.slice(0, limit);
        
        this.logRecommendation(user._id, 'edge', topic, paginated);
        
        return this.populateAndFormat(paginated);
    }
    
    /**
     * CENTER GROUP ALGORITHM
     * Start from center of Overton window, expand outward in all directions
     * Shows everything: first articles within window (from center out), then beyond window
     * Same behavior for centrists and extremists
     */
    async centerGroupRecommendation(user, topic, page, limit, excludeIds = [], excludeArticleIds = []) {
        logger.info('Center group recommendation', { userId: user._id, topic, stanceScore: user.stanceScore, excludeCount: excludeIds.length, excludeArticleCount: excludeArticleIds.length });
        
        const posts = await this.getPostsWithArticles(topic, excludeIds, excludeArticleIds);
        
        const windowCenter = (user.overtonWindow.min + user.overtonWindow.max) / 2;
        
        // Sort all articles by distance from center of window (closest first)
        // This naturally shows within-window articles first, then expands beyond
        const ranked = posts.sort((a, b) => {
            // Convert perspective scores from [-1, 1] to [0, 100] for comparison with window
            const scoreA = (a.article.perspectiveScore + 1) * 50;
            const scoreB = (b.article.perspectiveScore + 1) * 50;
            
            const distanceA = Math.abs(scoreA - windowCenter);
            const distanceB = Math.abs(scoreB - windowCenter);
            return distanceA - distanceB; // Ascending - center first, expanding outward
        });
        
        // Deduplicate by articleId (keep first/best occurrence)
        const deduplicated = this.deduplicateByArticleId(ranked);
        
        // Get only the first `limit` posts (no pagination offset needed since we exclude already shown)
        const paginated = deduplicated.slice(0, limit);
        
        this.logRecommendation(user._id, 'center', topic, paginated);
        
        return this.populateAndFormat(paginated);
    }
    
    /**
     * Default recommendations (no control group assigned)
     * Uses existing time-based chronological sorting
     */
    async getDefaultRecommendations(userId, topic, page, limit, excludeIds = [], excludeArticleIds = []) {
        logger.info('Default recommendations', { userId, topic, excludeCount: excludeIds.length, excludeArticleCount: excludeArticleIds.length });
        
        const queryFilter = topic ? { content: topic } : {};
        
        // Add exclusion filter if excludeIds are provided
        // Convert string IDs to ObjectIds for proper MongoDB matching
        if (excludeIds && excludeIds.length > 0) {
            const objectIds = excludeIds
                .filter(id => mongoose.Types.ObjectId.isValid(id))
                .map(id => new mongoose.Types.ObjectId(id));
            if (objectIds.length > 0) {
                queryFilter._id = { $nin: objectIds };
            }
        }
                // Add article exclusion filter if excludeArticleIds are provided
        if (excludeArticleIds && excludeArticleIds.length > 0) {
            queryFilter.articleId = { $nin: excludeArticleIds };
        }
        
        // Fetch more posts than needed to account for potential duplicates
        // We'll deduplicate and then slice to the limit
        const posts = await Post.find(queryFilter)
            .sort({ createdAt: -1 })
            .limit(limit * 3) // Fetch 3x to ensure we have enough after deduplication
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
        
        // Deduplicate by articleId (keep first occurrence, which is newest due to sort)
        const seenArticleIds = new Set();
        const deduplicated = posts.filter(post => {
            const articleIdStr = post.articleId?.toString();
            if (!articleIdStr) return true; // Keep posts without articles
            if (seenArticleIds.has(articleIdStr)) {
                logger.debug('Filtering duplicate article from default recommendations', { articleId: articleIdStr, postId: post._id });
                return false;
            }
            seenArticleIds.add(articleIdStr);
            return true;
        });
        
        // Return only the requested limit
        return deduplicated.slice(0, limit);
    }
    
    /**
     * Helper: Get posts with their associated articles
     */
    async getPostsWithArticles(topic, excludeIds = [], excludeArticleIds = []) {
        // Build query filter
        const queryFilter = {
            content: topic,
            articleId: { $exists: true, $ne: null }
        };
        
        // Add exclusion filter if excludeIds are provided
        // Convert string IDs to ObjectIds for proper MongoDB matching
        if (excludeIds && excludeIds.length > 0) {
            const objectIds = excludeIds
                .filter(id => mongoose.Types.ObjectId.isValid(id))
                .map(id => new mongoose.Types.ObjectId(id));
            if (objectIds.length > 0) {
                queryFilter._id = { $nin: objectIds };
            }
        }
        
        // Add article exclusion filter to prevent duplicate articles
        if (excludeArticleIds && excludeArticleIds.length > 0) {
            queryFilter.articleId = { $nin: excludeArticleIds };
        }
        
        // Get posts for topic that have articleIds (excluding already shown)
        const posts = await Post.find(queryFilter).exec();
        
        logger.info('Posts found for topic', { topic, postCount: posts.length, excludedPostCount: excludeIds.length, excludedArticleCount: excludeArticleIds.length });
        
        // Get unique article IDs
        const articleIds = [...new Set(posts.map(p => p.articleId))];
        logger.info('Unique article IDs', { articleIds, count: articleIds.length });
        
        // Check if articles data is loaded
        logger.info('Articles data loaded?', { count: articlesData.length });
        
        // Use in-memory articles from CSV data instead of MongoDB
        // Map articles by ID for quick lookup and calculate perspective scores on the fly
        const articleMap = {};
        
        // Build article map for all needed articles
        articleIds.forEach(articleId => {
            const article = getArticleById(articleId);
            if (article) {
                // Calculate perspectiveScore on the fly from stance and strength
                const perspectiveScore = calculatePerspectiveScore(article.stance, article.strength);
                articleMap[articleId] = {
                    articleId: article.id,
                    title: article.title,
                    body: article.body,
                    topic: article.topic,
                    stance: article.stance,
                    strength: article.strength,
                    perspectiveScore: perspectiveScore
                };
            } else {
                logger.warn('Article not found in articlesData', { articleId });
            }
        });
        
        logger.info('Articles loaded from memory', { articleCount: Object.keys(articleMap).length });
        
        // Log first matching article to see perspectiveScore
        if (articleIds.length > 0 && articleMap[articleIds[0]]) {
            const sampleArticle = articleMap[articleIds[0]];
            logger.info('Sample article', { 
                articleId: sampleArticle.articleId,
                stance: sampleArticle.stance,
                strength: sampleArticle.strength,
                perspectiveScore: sampleArticle.perspectiveScore
            });
        }
        
        // Combine posts with articles
        const postsWithArticles = posts
            .map(post => ({
                post,
                article: articleMap[post.articleId]
            }))
            .filter(item => {
                const hasArticle = item.article !== undefined;
                // Allow perspectiveScore of 0 (neutral) - only filter out undefined/null
                const hasPerspective = item.article && (item.article.perspectiveScore !== undefined && item.article.perspectiveScore !== null);
                if (!hasArticle) {
                    logger.warn('Post has no matching article', { postId: item.post._id, articleId: item.post.articleId });
                }
                if (hasArticle && !hasPerspective) {
                    logger.warn('Article has no perspectiveScore', { 
                        articleId: item.article.articleId,
                        perspectiveScore: item.article.perspectiveScore
                    });
                }
                return hasArticle && hasPerspective;
            });
        
        logger.info('Posts with valid articles and perspective scores', { count: postsWithArticles.length });
        
        return postsWithArticles;
    }
    
    /**
     * Helper: Filter posts by Overton window
     * Note: perspectiveScore is in [-1, 1] scale, overtonWindow is in [0, 100] scale
     * We need to convert perspectiveScore to [0, 100] for comparison
     */
    filterByOvertonWindow(postsWithArticles, overtonWindow) {
        return postsWithArticles.filter(item => {
            // Convert perspective score from [-1, 1] to [0, 100] scale
            // -1 → 0, 0 → 50, +1 → 100
            const perspectiveScore_0_100 = (item.article.perspectiveScore + 1) * 50;
            
            const inWindow = perspectiveScore_0_100 >= overtonWindow.min && 
                            perspectiveScore_0_100 <= overtonWindow.max;
            
            if (!inWindow) {
                logger.debug('Article filtered out by Overton window', {
                    articleId: item.article.articleId,
                    perspectiveScore: item.article.perspectiveScore,
                    perspectiveScore_0_100,
                    window: overtonWindow
                });
            }
            
            return inWindow;
        });
    }
    
    /**
     * Helper: Deduplicate posts by articleId (keep first occurrence)
     * This ensures we don't return multiple posts with the same article
     */
    deduplicateByArticleId(postsWithArticles) {
        const seenArticleIds = new Set();
        return postsWithArticles.filter(item => {
            const articleId = item.post.articleId?.toString();
            if (!articleId) return true; // Keep posts without articles
            if (seenArticleIds.has(articleId)) {
                logger.debug('Filtering duplicate article from results', { articleId, postId: item.post._id });
                return false;
            }
            seenArticleIds.add(articleId);
            return true;
        });
    }
    
    /**
     * Helper: Populate and format posts for response
     */
    async populateAndFormat(postsWithArticles) {
        const postIds = postsWithArticles.map(item => item.post._id);
        
        // Create a map of article data by post ID for quick lookup
        const articleDataMap = {};
        postsWithArticles.forEach(item => {
            articleDataMap[item.post._id.toString()] = item.article;
        });
        
        const populatedPosts = await Post.find({ _id: { $in: postIds } })
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
        
        // Merge article metadata into posts
        return populatedPosts.map(post => {
            const articleData = articleDataMap[post._id.toString()];
            if (articleData) {
                // Add article metadata to the post object (without modifying the mongoose document)
                return {
                    ...post.toObject(),
                    perspectiveScore: articleData.perspectiveScore,
                    stance: articleData.stance,
                    strength: articleData.strength
                };
            }
            return post;
        });
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
