/**
 * Script to check likes/dislikes status in the database
 * - Shows posts with existing likes/dislikes
 * - Shows if new posts are initialized with empty arrays
 */

const mongoose = require('mongoose');
require('dotenv').config();
const Post = require('../models/Post');
const PostLike = require('../models/PostLike');
const PostDislike = require('../models/PostDislike');
const User = require('../models/User');

async function checkLikesDislikesStatus() {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('Error: MONGO_URI environment variable is not set.');
            process.exit(1);
        }
        
        await mongoose.connect(mongoUri, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        });
        
        console.log('\n=== Checking Likes/Dislikes Status ===\n');
        
        // 1. Check total counts
        const totalPosts = await Post.countDocuments();
        const totalLikes = await PostLike.countDocuments();
        const totalDislikes = await PostDislike.countDocuments();
        
        console.log('Total Posts:', totalPosts);
        console.log('Total PostLikes:', totalLikes);
        console.log('Total PostDislikes:', totalDislikes);
        console.log('');
        
        // 2. Check posts with likes/dislikes arrays populated
        const postsWithLikes = await Post.find({ likes: { $exists: true, $ne: [] } }).limit(10);
        console.log(`Posts with likes array populated: ${postsWithLikes.length}`);
        postsWithLikes.forEach((post, i) => {
            console.log(`  ${i+1}. Post ID: ${post._id}, Likes count: ${post.likes.length}, Title: ${post.title?.substring(0, 50) || 'No title'}`);
        });
        console.log('');
        
        const postsWithDislikes = await Post.find({ dislikes: { $exists: true, $ne: [] } }).limit(10);
        console.log(`Posts with dislikes array populated: ${postsWithDislikes.length}`);
        postsWithDislikes.forEach((post, i) => {
            console.log(`  ${i+1}. Post ID: ${post._id}, Dislikes count: ${post.dislikes.length}, Title: ${post.title?.substring(0, 50) || 'No title'}`);
        });
        console.log('');
        
        // 3. Sample a few posts and show their likes/dislikes
        const samplePosts = await Post.find().limit(5);
        console.log('Sample posts (first 5):');
        for (let i = 0; i < samplePosts.length; i++) {
            const post = samplePosts[i];
            console.log(`\n  ${i+1}. Post ID: ${post._id}`);
            console.log(`     Title: ${post.title?.substring(0, 50) || 'No title'}`);
            console.log(`     Likes array: ${post.likes ? Array.isArray(post.likes) ? `Array[${post.likes.length}]` : 'Not an array' : 'undefined'}`);
            console.log(`     Dislikes array: ${post.dislikes ? Array.isArray(post.dislikes) ? `Array[${post.dislikes.length}]` : 'Not an array' : 'undefined'}`);
            
            if (post.likes && post.likes.length > 0) {
                console.log(`     Likes (first 3):`, post.likes.slice(0, 3));
            }
            if (post.dislikes && post.dislikes.length > 0) {
                console.log(`     Dislikes (first 3):`, post.dislikes.slice(0, 3));
            }
        }
        
        // 4. Check if any users have no likes/dislikes (newly registered)
        const users = await User.find().limit(5);
        console.log('\n\nSample users (first 5):');
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const userLikes = await PostLike.countDocuments({ userId: user._id });
            const userDislikes = await PostDislike.countDocuments({ userId: user._id });
            console.log(`  ${i+1}. User: ${user.username}, Likes given: ${userLikes}, Dislikes given: ${userDislikes}`);
        }
        
        console.log('\n=== Check Complete ===\n');
        
    } catch (error) {
        console.error('Error checking likes/dislikes:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

// Run the check
checkLikesDislikesStatus();
