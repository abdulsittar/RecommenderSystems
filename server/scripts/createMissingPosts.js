const mongoose = require('mongoose');
require('dotenv').config();
const Post = require('../models/Post');
const User = require('../models/User');
const { loadArticlesFromCSV } = require('../utils/csvParser');

// Use the global MongoDB connection
const MONGO_URI = process.env.MONGO_URI;

async function createMissingPosts() {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        });
        console.log('✓ Connected to MongoDB');
        
        // Load all articles from CSV
        console.log('\nLoading articles from CSV...');
        const articles = await loadArticlesFromCSV();
        console.log(`✓ Loaded ${articles.length} articles from CSV`);
        
        // Get existing posts with articleIds
        console.log('\nChecking existing posts...');
        const existingPosts = await Post.find({ 
            articleId: { $exists: true, $ne: null } 
        }).select('articleId');
        
        const existingArticleIds = new Set(
            existingPosts.map(post => post.articleId)
        );
        console.log(`✓ Found ${existingArticleIds.size} existing posts with articles`);
        
        // Find articles that don't have posts yet
        const missingArticles = articles.filter(article => 
            !existingArticleIds.has(article.id)
        );
        
        console.log(`\n📊 Articles without posts: ${missingArticles.length}`);
        
        if (missingArticles.length === 0) {
            console.log('✓ All articles already have posts!');
            await mongoose.connection.close();
            return;
        }
        
        // Get or create a system user for these posts
        console.log('\nFinding system user...');
        let systemUser = await User.findOne({ username: 'system' });
        
        if (!systemUser) {
            console.log('System user not found, using first user in database...');
            systemUser = await User.findOne({});
            if (!systemUser) {
                console.error('❌ No users found in database. Please create at least one user first.');
                await mongoose.connection.close();
                return;
            }
        }
        
        console.log(`✓ Using user: ${systemUser.username} (${systemUser._id})`);
        
        // Create posts in batches
        console.log(`\nCreating ${missingArticles.length} posts...`);
        const batchSize = 100;
        let created = 0;
        let errors = 0;
        
        for (let i = 0; i < missingArticles.length; i += batchSize) {
            const batch = missingArticles.slice(i, i + batchSize);
            
            const postsToCreate = batch.map(article => ({
                userId: systemUser._id.toString(),
                content: article.topic,
                articleId: article.id,
                title: article.title,
                desc: article.body.replace(/<[^>]*>/g, '').substring(0, 500), // Strip HTML and limit to 500 chars
                treatment: '',
                pool: '',
                userGroup: '',
                thumb: '',
                img: '',
                webLinks: '',
                rank: 1000.0,
                weight: 0.0,
                ukraine: 0.0,
                disinfo: 0.0,
                postedBy: systemUser._id
            }));
            
            try {
                await Post.insertMany(postsToCreate, { ordered: false });
                created += postsToCreate.length;
                console.log(`  ✓ Batch ${Math.floor(i / batchSize) + 1}: Created ${postsToCreate.length} posts (${created}/${missingArticles.length})`);
            } catch (error) {
                // insertMany with ordered: false will continue on errors
                // Count how many were successful
                if (error.writeErrors) {
                    const successCount = postsToCreate.length - error.writeErrors.length;
                    created += successCount;
                    errors += error.writeErrors.length;
                    console.log(`  ⚠ Batch ${Math.floor(i / batchSize) + 1}: Created ${successCount} posts, ${error.writeErrors.length} errors`);
                } else {
                    errors += postsToCreate.length;
                    console.error(`  ❌ Batch ${Math.floor(i / batchSize) + 1}: Failed -`, error.message);
                }
            }
        }
        
        // Verify results
        console.log('\n📊 Summary:');
        console.log(`  ✓ Successfully created: ${created} posts`);
        if (errors > 0) {
            console.log(`  ⚠ Errors: ${errors}`);
        }
        
        // Final count
        const totalPostsWithArticles = await Post.countDocuments({ 
            articleId: { $exists: true, $ne: null } 
        });
        console.log(`  📊 Total posts with articles now: ${totalPostsWithArticles}`);
        
        // Count by topic
        console.log('\n📊 Posts by topic:');
        const topics = [...new Set(articles.map(a => a.topic))];
        for (const topic of topics.sort()) {
            const count = await Post.countDocuments({ content: topic, articleId: { $exists: true } });
            const totalArticles = articles.filter(a => a.topic === topic).length;
            console.log(`  ${topic}: ${count}/${totalArticles} (${((count/totalArticles)*100).toFixed(1)}%)`);
        }
        
        console.log('\n✓ Done!');
        
    } catch (error) {
        console.error('\n❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed.');
    }
}

// Run the script
createMissingPosts();
