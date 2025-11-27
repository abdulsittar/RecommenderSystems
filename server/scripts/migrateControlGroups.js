const mongoose = require('mongoose');
const User = require('../models/User');
const Article = require('../models/Article');
const WeeklyResponse = require('../models/WeeklyResponse');
const { calculatePerspectiveScore, surveyToStanceScore, calculateOvertonWindow } = require('../utils/stanceCalculations');
const logger = require('../logs/logger');
require('dotenv').config();

// Database connection
const dbUrl = process.env.MONGO_URI;

if (!dbUrl) {
    console.error('Error: MONGO_URI environment variable is not set.');
    process.exit(1);
}

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ Connected to database successfully');
}).catch(err => {
    console.error('❌ Database connection error:', err.message);
    process.exit(1);
});

async function migrateArticlePerspectiveScores() {
    console.log('\n' + '='.repeat(60));
    console.log('MIGRATING ARTICLE PERSPECTIVE SCORES');
    console.log('='.repeat(60) + '\n');
    
    const articles = await Article.find({});
    console.log(`📊 Found ${articles.length} articles to migrate\n`);
    
    let updated = 0;
    let errors = 0;
    let skipped = 0;
    
    for (const article of articles) {
        try {
            // Always calculate and update perspectiveScore
            const perspectiveScore = calculatePerspectiveScore(article.stance, article.strength);
            
            // Only skip if the score hasn't changed
            if (article.perspectiveScore === perspectiveScore) {
                skipped++;
                continue;
            }
            
            article.perspectiveScore = perspectiveScore;
            await article.save();
            updated++;
            
            if (updated % 50 === 0) {
                console.log(`   Progress: ${updated}/${articles.length - skipped} articles updated`);
            }
        } catch (err) {
            console.error(`   ❌ Error updating article ${article.articleId}:`, err.message);
            errors++;
        }
    }
    
    console.log(`\n✅ Article migration complete:`);
    console.log(`   - Updated: ${updated}`);
    console.log(`   - Skipped: ${skipped}`);
    console.log(`   - Errors: ${errors}\n`);
}

async function assignControlGroupsToUsers() {
    console.log('='.repeat(60));
    console.log('ASSIGNING CONTROL GROUPS TO USERS');
    console.log('='.repeat(60) + '\n');
    
    // Find users who have completed surveys but don't have control groups
    const usersWithSurveys = await WeeklyResponse.distinct('userId');
    console.log(`📊 Found ${usersWithSurveys.length} users with survey data\n`);
    
    const users = await User.find({
        _id: { $in: usersWithSurveys },
        controlGroup: null
    });
    
    console.log(`🎯 ${users.length} users need control group assignment\n`);
    
    const groups = ['control', 'edge', 'center'];
    let assigned = 0;
    let errors = 0;
    
    const groupCounts = { control: 0, edge: 0, center: 0 };
    
    for (const user of users) {
        try {
            // Randomly assign
            const controlGroup = groups[Math.floor(Math.random() * groups.length)];
            user.controlGroup = controlGroup;
            user.controlGroupAssignedAt = new Date();
            groupCounts[controlGroup]++;
            
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
            
            console.log(`   ✓ User ${user._id}: ${controlGroup} (stance: ${user.stanceScore ? user.stanceScore.toFixed(2) : 'N/A'})`);
        } catch (err) {
            console.error(`   ❌ Error assigning control group to user ${user._id}:`, err.message);
            errors++;
        }
    }
    
    console.log(`\n✅ Control group assignment complete:`);
    console.log(`   - Total assigned: ${assigned}`);
    console.log(`   - Control group: ${groupCounts.control}`);
    console.log(`   - Edge group: ${groupCounts.edge}`);
    console.log(`   - Center group: ${groupCounts.center}`);
    console.log(`   - Errors: ${errors}\n`);
}

async function displaySummary() {
    console.log('='.repeat(60));
    console.log('MIGRATION SUMMARY');
    console.log('='.repeat(60) + '\n');
    
    const totalArticles = await Article.countDocuments({});
    const articlesWithPerspective = await Article.countDocuments({ 
        perspectiveScore: { $exists: true, $ne: 0 } 
    });
    
    const totalUsers = await User.countDocuments({});
    const usersWithControlGroup = await User.countDocuments({ 
        controlGroup: { $ne: null } 
    });
    
    const controlCount = await User.countDocuments({ controlGroup: 'control' });
    const edgeCount = await User.countDocuments({ controlGroup: 'edge' });
    const centerCount = await User.countDocuments({ controlGroup: 'center' });
    
    console.log('📊 Articles:');
    console.log(`   - Total: ${totalArticles}`);
    console.log(`   - With perspective score: ${articlesWithPerspective} (${((articlesWithPerspective/totalArticles)*100).toFixed(1)}%)`);
    
    console.log('\n👥 Users:');
    console.log(`   - Total: ${totalUsers}`);
    console.log(`   - With control group: ${usersWithControlGroup} (${((usersWithControlGroup/totalUsers)*100).toFixed(1)}%)`);
    console.log(`   - Control group: ${controlCount}`);
    console.log(`   - Edge group: ${edgeCount}`);
    console.log(`   - Center group: ${centerCount}`);
    
    console.log('\n' + '='.repeat(60));
}

async function main() {
    try {
        console.log('\n🚀 Starting migration...\n');
        
        await migrateArticlePerspectiveScores();
        await assignControlGroupsToUsers();
        await displaySummary();
        
        console.log('✅ Migration complete!\n');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
}

main();
