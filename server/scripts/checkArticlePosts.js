/**
 * Check if all articles from CSV have corresponding posts in the database
 * This helps identify if missing posts are causing recommendation issues
 */

const mongoose = require('mongoose');
const Post = require('../models/Post');
const { loadArticlesFromCSV } = require('../utils/csvParser');
require('dotenv').config();

// Database connection
const dbUrl = process.env.MONGO_URI;

if (!dbUrl) {
    console.error('Error: MONGO_URI environment variable is not set.');
    process.exit(1);
}

async function main() {
    try {
        // Load articles directly from CSV
        console.log('Loading articles from CSV...\n');
        const articlesData = await loadArticlesFromCSV();
        console.log(`✅ Loaded ${articlesData.length} articles from CSV\n`);
        
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('✅ Connected to database successfully\n');
        await checkArticleCoverage(articlesData);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

main();

async function checkArticleCoverage(articlesData) {
    console.log('='  .repeat(80));
    console.log('CHECKING ARTICLE COVERAGE IN POSTS');
    console.log('='.repeat(80));
    console.log();
    
    console.log(`📊 Total articles loaded from CSV: ${articlesData.length}\n`);
    
    try {
        // Get all posts with articleIds
        const posts = await Post.find({ 
            articleId: { $exists: true, $ne: null } 
        }).exec();
        
        console.log(`📊 Total posts with articleIds: ${posts.length}\n`);
        
        // Get unique article IDs from posts
        const articleIdsInPosts = new Set(posts.map(p => p.articleId));
        console.log(`📊 Unique articles in posts: ${articleIdsInPosts.size}\n`);
        
        // Group articles by topic
        const articlesByTopic = {};
        const articlesInPostsByTopic = {};
        
        articlesData.forEach(article => {
            if (!articlesByTopic[article.topic]) {
                articlesByTopic[article.topic] = [];
                articlesInPostsByTopic[article.topic] = [];
            }
            articlesByTopic[article.topic].push(article);
            
            if (articleIdsInPosts.has(article.id)) {
                articlesInPostsByTopic[article.topic].push(article);
            }
        });
        
        // Check coverage for each topic
        console.log('='.repeat(80));
        console.log('COVERAGE BY TOPIC');
        console.log('='.repeat(80));
        console.log();
        
        const topics = Object.keys(articlesByTopic).sort();
        let totalMissing = 0;
        
        for (const topic of topics) {
            const totalArticles = articlesByTopic[topic].length;
            const articlesWithPosts = articlesInPostsByTopic[topic].length;
            const missing = totalArticles - articlesWithPosts;
            totalMissing += missing;
            
            const status = missing === 0 ? '✅' : '⚠️ ';
            const percentage = ((articlesWithPosts / totalArticles) * 100).toFixed(1);
            
            console.log(`${status} ${topic.padEnd(30)} ${articlesWithPosts}/${totalArticles} (${percentage}%) posts`);
            
            if (missing > 0) {
                console.log(`   Missing ${missing} posts for articles:`);
                
                const missingArticles = articlesByTopic[topic]
                    .filter(a => !articleIdsInPosts.has(a.id));
                
                // Show first 5 missing article IDs
                const showCount = Math.min(5, missingArticles.length);
                for (let i = 0; i < showCount; i++) {
                    const article = missingArticles[i];
                    console.log(`     - Article ID ${article.id}: ${article.title.substring(0, 60)}...`);
                }
                if (missingArticles.length > 5) {
                    console.log(`     ... and ${missingArticles.length - 5} more`);
                }
                console.log();
            }
        }
        
        console.log('='.repeat(80));
        console.log('SUMMARY');
        console.log('='.repeat(80));
        console.log(`Total articles in CSV: ${articlesData.length}`);
        console.log(`Total articles with posts: ${articleIdsInPosts.size}`);
        console.log(`Total articles missing posts: ${totalMissing}`);
        console.log();
        
        if (totalMissing > 0) {
            console.log('⚠️  WARNING: Some articles do not have posts!');
            console.log('   These articles will NOT appear in recommendations.');
            console.log('   You need to create posts for these articles.');
            console.log();
        } else {
            console.log('✅ All articles have corresponding posts!');
            console.log();
        }
        
        // Check for posts by topic
        console.log('='.repeat(80));
        console.log('POSTS BY TOPIC (in database)');
        console.log('='.repeat(80));
        console.log();
        
        for (const topic of topics) {
            const topicPosts = await Post.find({ 
                content: topic,
                articleId: { $exists: true, $ne: null }
            }).exec();
            
            console.log(`${topic.padEnd(30)} ${topicPosts.length} posts`);
        }
        console.log();
        
    } catch (error) {
        console.error('Error checking article coverage:', error);
    } finally {
        mongoose.connection.close();
        console.log('Database connection closed.');
    }
}
