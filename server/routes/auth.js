const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();
const IDStorage = require('../models/IDStorage');
const SelectedUser = require('../models/SelectedUser');
const WeeklyResponse = require('../models/WeeklyResponse'); // Import WeeklyResponse model
var mongoose  = require('mongoose');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');
require("dotenv").config();
const timeout = require('connect-timeout');
const logger = require('../logs/logger');

const { ObjectId } = require('mongodb');
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         profilePicture:
 *           type: string
 *           description: Currently, empty string
 *         coverPicture:
 *           type: string
 *           description: Currently, empty string
 *         followers:
 *           type: array
 *           description: The followers of the user
 *         followings:
 *           type: array
 *           description: The followings of the user
 *         viewedPosts:
 *           type: array
 *           description: The posts viewed by this user
 *         readPosts:
 *           type: array
 *           description: The posts read by this user
 *         username:
 *           type: string
 *           description: The username of the user
 *         pool:
 *           type: string
 *           description: Pool A or B
 *         description:
 *           type: string
 *           description: Biography of the user
 *         city:
 *           type: string
 *           description: City of the user
 *         from:
 *           type: string
 *           description: Country of the user
 *         relationship:
 *           type: string
 *           description: Marrital status of the user
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *       example:
 *         username: XYZ
 *         email: XYZ@gmail.com
 *         password: 123456
 */



/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The user managing APIs
 * /register:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: username
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: email
 *       - in: path
 *         name: password
 *         schema:
 *           type: string
 *         required: true
 *         description: password (minimum 6 alpha-numerics)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */

// REGISTER USER
router.post('/register/:uniqId',  async (req, res) => {
//try{
    console.log("here");
    logger.info('Data received', { data: req.body });
    // encrypt password
    const salt = await bcrypt.genSalt(10);
    //console.log(req.body.password)
    //console.log(salt)
    console.log(req.query.userId);
    
    // Use first 10 characters of uniqueId as default password if no password provided
    const defaultPassword = req.params.uniqId.substring(0, 10);
    const inputPassword = req.body.password ? req.body.password.trim() : defaultPassword;
    const hashedPassword = await bcrypt.hash(inputPassword, salt);
    
    const idstor = await IDStorage.find({"yourID": req.params.uniqId});
        
    const fid = idstor[0]
    console.log(fid)
    console.log("here is value")
    console.log(req.body);
    
    // create new user
    const newUser = new User({
        username: req.body.username,
        profilePicture: req.body.profilePicture,
        "username_second":req.body.username_second,
        password: hashedPassword,
        pool: req.body.pool,
        uniqueId: fid["_id"]
    });

    // save user and send response

    const user = await newUser.save();
    console.log(`${process.env.JWT_SECRET}`)

    const token = jwt.sign({ _id: user._id }, `${process.env.JWT_SECRET}`);
    const usr = {"user": user, "token": token}

    let diction = {}
    diction["available"] = false    
    const updatedData = { $set: diction}

    //try {
        // Find the user by username
        const selectedUser = await SelectedUser.findOne({ "username_second": req.body.username_second });
        console.log(updatedData);
        console.log(selectedUser);
    
        if (selectedUser) {
            // Update the document directly on the model with a filter
            await SelectedUser.updateOne(
                { "username_second": req.body.username },  // Filter
                updatedData                          // Update operation
            );
            console.log("Successfully updated the available field.");
        } else {
            console.log("User not found.");
        }
    //} catch (error) {
    //    console.error("Error updating object field:", error);
    //}
    console.log(usr)
    res.status(200).json(usr);


//} catch (err) {
//    console.log(err)
//    res.status(500).json(err);
//}
});

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The user managing APIs
 * /login:
 *   post:
 *     summary: Login
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: email
 *       - in: path
 *         name: password
 *         schema:
 *           type: string
 *         required: true
 *         description: password (minimum 6 alpha-numerics)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: You are logged-In.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */

// LOGIN
router.post('/login/:uniqId?', async (req, res) => {
try {
    logger.info('Data received', { data: req.body });
    
    // Get unique ID from URL parameter or request body
    const uniqueId = req.params.uniqId || req.body.uniqueId;
    const inputUsername = req.body.username;
    
    console.log(`Login attempt for uniqueId: ${uniqueId}, username: ${inputUsername}`);
    
    let user;
    
    // If we have a unique ID from URL, find user by that ID
    if (uniqueId) {
        console.log(`Looking up user by unique ID: ${uniqueId}`);
        const idStorage = await IDStorage.findOne({yourID: uniqueId});
        if (idStorage) {
            user = await User.findOne({uniqueId: idStorage._id}).populate('uniqueId');
            console.log(`Found user by unique ID: ${user ? user.username : 'none'}`);
        }
    }
    
    // If not found by unique ID and we have a username, try username
    if (!user && inputUsername) {
        console.log(`Looking up user by username: ${inputUsername}`);
        user = await User.findOne({username: inputUsername}).populate('uniqueId');
        
        // If not found by username, try to find by unique ID using username field
        if (!user) {
            console.log(`User not found by username, trying unique ID: ${inputUsername}`);
            const idStorage = await IDStorage.findOne({yourID: inputUsername});
            if (idStorage) {
                user = await User.findOne({uniqueId: idStorage._id}).populate('uniqueId');
                console.log(`Found user by unique ID: ${user ? user.username : 'none'}`);
            }
        }
    }
    
    if (!user) {
        console.log(`User not found by any method. uniqueId: ${uniqueId}, username: ${inputUsername}`);
        res.status(404).json("user not found");
        return
    }

    console.log(`User found: ${user.username}`);
    console.log(`Input password: ${req.body.password}`);
    console.log(`Stored password hash: ${user.password}`);
    const inputPassword = req.body.password.trim();
    
    // Get the complete unique ID from the populated field
    let completeUniqueId;
    if (user.uniqueId && user.uniqueId.yourID) {
        completeUniqueId = user.uniqueId.yourID;
    } else {
        // Fallback to the ObjectId string if yourID field doesn't exist
        completeUniqueId = user.uniqueId._id.toString();
    }
    
    console.log(`Complete Unique ID: ${completeUniqueId}`);
    console.log(`First 10 characters: ${completeUniqueId.substring(0, 10)}`);
    
    // Check if password matches first 10 characters of unique ID
    const expectedPassword = completeUniqueId.substring(0, 10);
    
    // First check if the input password matches the first 10 characters of unique ID
    if (inputPassword === expectedPassword) {
        console.log("Password matches first 10 characters of unique ID - Login successful");
    } else {
        // Fallback to bcrypt comparison for existing hashed passwords
        const validPassword = await bcrypt.compare(inputPassword, user.password);
        if (!validPassword){
            console.log("Password doesn't match unique ID first 10 chars or hashed password");
            res.status(404).json("wrong password");
            return
        }
        console.log("Password matches hashed password - Login successful");
    }

    const token = jwt.sign({ _id: user._id }, `${process.env.JWT_SECRET}`);

    // Assign control group on first login if not already assigned
    if (!user.controlGroup) {
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

    // Check if user needs to complete weekly survey
    let needsWeeklySurvey = false;
    
    // Only check for survey participants (those who completed presurvey)
    if (user.uniqueId) {
        const now = new Date();
        
        // Get user's last login timestamp (use createdAt if never logged in before)
        const lastLogin = user.lastLoginDate || user.createdAt;
        
        // Calculate days since last login
        const daysSinceLastLogin = Math.floor((now - new Date(lastLogin)) / (1000 * 60 * 60 * 24));
        
        console.log('='.repeat(60));
        console.log('WEEKLY SURVEY CHECK - User Login');
        console.log('='.repeat(60));
        console.log(`User: ${user.username}`);
        console.log(`User ID: ${user._id}`);
        console.log(`Current Time: ${now.toISOString()}`);
        console.log(`Last Login: ${lastLogin ? new Date(lastLogin).toISOString() : 'Never (using createdAt)'}`);
        console.log(`Days Since Last Login: ${daysSinceLastLogin} days`);
        console.log(`Current Topic: ${user.currentTopic || 'Not set'}`);
        console.log(`Threshold: 7 days`);
        console.log(`Has Been 7+ Days: ${daysSinceLastLogin >= 7 ? 'YES ✓' : 'NO ✗'}`);
        
        // Check if it's been 7+ days since last login
        if (daysSinceLastLogin >= 7) {
            console.log('\n>>> 7+ days detected - Checking weekly survey status for current topic...');
            
            // Check if user has submitted weekly survey for their CURRENT topic
            // (regardless of when - topic-specific check)
            const topicWeeklyResponse = await WeeklyResponse.findOne({
                userId: user._id,
                topic: user.currentTopic
            }).sort({ createdAt: -1 }); // Get the most recent one for this topic
            
            if (topicWeeklyResponse) {
                // Check if it's been 7+ days since last survey for this topic
                const daysSinceLastSurvey = Math.floor((now - new Date(topicWeeklyResponse.createdAt)) / (1000 * 60 * 60 * 24));
                console.log(`Last survey for topic "${user.currentTopic}": ${topicWeeklyResponse.createdAt.toISOString()}`);
                console.log(`Days since last survey for this topic: ${daysSinceLastSurvey} days`);
                
                needsWeeklySurvey = daysSinceLastSurvey >= 7;
            } else {
                // No survey for this topic yet
                console.log(`No weekly survey found for topic: ${user.currentTopic}`);
                needsWeeklySurvey = true;
            }
            
            console.log(`Will Show Weekly Survey: ${needsWeeklySurvey ? 'YES ✓' : 'NO ✗'}`);
        } else {
            console.log(`\n>>> Less than 7 days since last login - No weekly survey needed`);
            console.log(`User needs to wait ${7 - daysSinceLastLogin} more day(s)`);
        }
        
        console.log('\nFinal Decision: needsWeeklySurvey =', needsWeeklySurvey);
        console.log('='.repeat(60));
        
        // Update last login timestamp
        await User.findByIdAndUpdate(user._id, { lastLoginDate: now });
        console.log(`Updated lastLoginDate to: ${now.toISOString()}`);
    }

    const usr = {
        "user": user, 
        "token": token,
        "needsWeeklySurvey": needsWeeklySurvey
    };

    console.log(usr)
    res.status(200).json(usr);

} catch(err) {
//console.log(err)
logger.error('Error saving data', { error: err.message });
    res.status(500).json(err);
}
})

function requireUserId(req, res, next) { 
    console.log(req.params.userId);
    console.log(req.body);
    const userId = req.params.userId;

    if (!userId) {
        console.log("id not found");
        // If userId parameter is missing, respond with an error or redirect
        return res.status(400).json({ error: 'User ID is required' });
    }
    if(process.env.USER_IDS.indexOf(userId) > -1){
        console.log("id found");
        next();

    }else{
        console.log("id not found");
        // If userId parameter is missing, respond with an error or redirect
        return res.status(400).json({ error: 'User ID is required' });
    }
    }

// Debug route to list all users (remove in production)
router.get('/debug/users', async (req, res) => {
    try {
        const users = await User.find({}).populate('uniqueId').select('username username_second uniqueId createdAt');
        res.status(200).json({
            count: users.length,
            users: users.map(user => ({
                username: user.username,
                username_second: user.username_second,
                uniqueId: user.uniqueId ? user.uniqueId.yourID : null,
                created: user.createdAt
            }))
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;module.exports = router;