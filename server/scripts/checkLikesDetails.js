/**
 * Script to check detailed likes/dislikes with user information
 */

const mongoose = require('mongoose');
require('dotenv').config();
const Post = require('../models/Post');
const PostLike = require('../models/PostLike');
const PostDislike = require('../models/PostDislike');
const User = require('../models/User');

async function checkLikesDetails() {
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
        
        console.log('\n=== Detailed Likes/Dislikes Check ===\n');
        
        // Get all PostLikes with populated user and post info
        const likes = await PostLike.find()
            .populate('userId', 'username username_second')
            .populate('postId', 'title articleId')
            .limit(20)
            .exec();
        
        console.log(`Total PostLikes found: ${likes.length}`);
        console.log('\nPostLike Documents (showing user and post):');
        likes.forEach((like, i) => {
            console.log(`  ${i+1}. Like ID: ${like._id}`);
            console.log(`     User: ${like.userId?.username || 'Unknown'} (ID: ${like.userId?._id || 'N/A'})`);
            console.log(`     Post: ${like.postId?.title?.substring(0, 50) || 'Unknown'}... (ID: ${like.postId?._id || 'N/A'})`);
            console.log(`     Article ID: ${like.postId?.articleId || 'N/A'}`);
            console.log(`     Created: ${like.createdAt}`);
            console.log('');
        });
        
        // Get all PostDislikes with populated user and post info
        const dislikes = await PostDislike.find()
            .populate('userId', 'username username_second')
            .populate('postId', 'title articleId')
            .limit(20)
            .exec();
        
        console.log(`\nTotal PostDislikes found: ${dislikes.length}`);
        console.log('\nPostDislike Documents (showing user and post):');
        dislikes.forEach((dislike, i) => {
            console.log(`  ${i+1}. Dislike ID: ${dislike._id}`);
            console.log(`     User: ${dislike.userId?.username || 'Unknown'} (ID: ${dislike.userId?._id || 'N/A'})`);
            console.log(`     Post: ${dislike.postId?.title?.substring(0, 50) || 'Unknown'}... (ID: ${dislike.postId?._id || 'N/A'})`);
            console.log(`     Article ID: ${dislike.postId?.articleId || 'N/A'}`);
            console.log(`     Created: ${dislike.createdAt}`);
            console.log('');
        });
        
        // Check users who have given likes/dislikes
        const usersWithLikes = await PostLike.distinct('userId');
        const usersWithDislikes = await PostDislike.distinct('userId');
        
        console.log(`\nUsers who have given likes: ${usersWithLikes.length}`);
        console.log(`Users who have given dislikes: ${usersWithDislikes.length}`);
        
        // Get details for users with activity
        if (usersWithLikes.length > 0) {
            console.log('\nUsers with likes:');
            for (let i = 0; i < Math.min(10, usersWithLikes.length); i++) {
                const user = await User.findById(usersWithLikes[i]);
                const likeCount = await PostLike.countDocuments({ userId: usersWithLikes[i] });
                if (user) {
                    console.log(`  - ${user.username} (${user.username_second}): ${likeCount} likes`);
                }
            }
        }
        
        if (usersWithDislikes.length > 0) {
            console.log('\nUsers with dislikes:');
            for (let i = 0; i < Math.min(10, usersWithDislikes.length); i++) {
                const user = await User.findById(usersWithDislikes[i]);
                const dislikeCount = await PostDislike.countDocuments({ userId: usersWithDislikes[i] });
                if (user) {
                    console.log(`  - ${user.username} (${user.username_second}): ${dislikeCount} dislikes`);
                }
            }
        }
        
        // Check if any new users (registered recently) have 0 likes/dislikes
        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .exec();
        
        console.log('\n\nMost Recent Users (last 10):');
        for (let i = 0; i < recentUsers.length; i++) {
            const user = recentUsers[i];
            const likeCount = await PostLike.countDocuments({ userId: user._id });
            const dislikeCount = await PostDislike.countDocuments({ userId: user._id });
            console.log(`  ${i+1}. ${user.username} (registered: ${user.createdAt?.toISOString().split('T')[0] || 'Unknown'})`);
            console.log(`     Likes: ${likeCount}, Dislikes: ${dislikeCount}`);
        }
        
        console.log('\n=== Check Complete ===\n');
        
    } catch (error) {
        console.error('Error checking likes/dislikes details:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

// Run the check
checkLikesDetails();
