const SelectedUsers = require('../models/SelectedUser');
const PreSurvey = require('../models/PreSurvey');
const User = require('../models/User');
const IDStorage = require('../models/IDStorage');
const ConsentResponse = require('../models/ConsentResponse');
const DemographicsData = require('../models/DemographicsData');
const WeeklyResponse = require('../models/WeeklyResponse');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const PostSurvey = require('../models/PostSurvey');
var ObjectId = require('mongodb').ObjectID;
const sanitizeHtml = require('sanitize-html');
const logger = require('../logs/logger');

const verifyToken = require('../middleware/verifyToken');

function sanitizeInput(input) {
    return sanitizeHtml(input, {
        allowedTags: [], // No HTML allowed
        allowedAttributes: {} // No attributes allowed
    });
}

// NEW THREE-STAGE SURVEY ROUTES
// ===============================

// Submit consent form
router.post('/consent/:uniqId', async (req, res) => {
    logger.info('Consent data received', { data: req.body });
    try {
        console.log("Processing consent submission for:", req.params.uniqId);
        const idstor = await IDStorage.find({"yourID": req.params.uniqId});
        
        if (!idstor || idstor.length === 0) {
            return res.status(404).json({ error: "Invalid registration ID" });
        }
        
        const fid = idstor[0];
        
        const newConsentResponse = new ConsentResponse({
            "uniqueId": fid["_id"],
            "consentAnswers": req.body.consentAnswers || [],
            "agreedToParticipate": req.body.agreedToParticipate || false
        });
        
        const consentResponse = await newConsentResponse.save();
        res.status(200).json({ success: true, consentId: consentResponse._id });
        
    } catch (err) {
        logger.error('Error saving consent data', { error: err.message });
        console.log(err);
        res.status(500).json(err);
    }
});

// Submit demographics data
router.post('/demographics/:uniqId', async (req, res) => {
    logger.info('Demographics data received', { data: req.body });
    try {
        console.log("Processing demographics submission for:", req.params.uniqId);
        const idstor = await IDStorage.find({"yourID": req.params.uniqId});
        
        if (!idstor || idstor.length === 0) {
            return res.status(404).json({ error: "Invalid registration ID" });
        }
        
        const fid = idstor[0];
        
        const newDemographicsData = new DemographicsData({
            "uniqueId": fid["_id"],
            "age": req.body.age || "",
            "gender": req.body.gender || "",
            "education": req.body.education || "",
            "employment": req.body.employment || "",
            "hasVoted": req.body.hasVoted || "",
            "politicalActivities": req.body.politicalActivities || "",
            "politicalMember": req.body.politicalMember || "",
            "newsFrequency": req.body.newsFrequency || "",
            "newsSource": req.body.newsSource || "",
            "newsTime": req.body.newsTime || ""
        });
        
        const demographicsData = await newDemographicsData.save();
        res.status(200).json({ success: true, demographicsId: demographicsData._id });
        
    } catch (err) {
        logger.error('Error saving demographics data', { error: err.message });
        console.log(err);
        res.status(500).json(err);
    }
});

// Submit weekly questions
router.post('/weekly/:uniqId', async (req, res) => {
    logger.info('Weekly data received', { data: req.body });
    try {
        console.log("Processing weekly submission for:", req.params.uniqId);
        const idstor = await IDStorage.find({"yourID": req.params.uniqId});
        
        if (!idstor || idstor.length === 0) {
            return res.status(404).json({ error: "Invalid registration ID" });
        }
        
        const fid = idstor[0];
        
        const newWeeklyResponse = new WeeklyResponse({
            "uniqueId": fid["_id"],
            "weekNumber": req.body.weekNumber || 1,
            "politicalIssueRating": req.body.politicalIssueRating || 50,
            "openmindedRating": req.body.openmindedRating || 5,
            "extremistRating": req.body.extremistRating || 5,
            "moralRating": req.body.moralRating || 5,
            "familyHappiness": req.body.familyHappiness || 5,
            "friendHappiness": req.body.friendHappiness || 5,
            "coworkerHappiness": req.body.coworkerHappiness || 5
        });
        
        const weeklyResponse = await newWeeklyResponse.save();
        res.status(200).json({ success: true, weeklyId: weeklyResponse._id });
        
    } catch (err) {
        logger.error('Error saving weekly data', { error: err.message });
        console.log(err);
        res.status(500).json(err);
    }
});

// LEGACY ROUTES (keeping for backward compatibility)
// =================================================

// Submit pre survey
router.post('/psurvey/:uniqId',  async (req, res) => {
    logger.info('Data received', { data: req.body });
    try{
        console.log("herelkjkl");
        console.log(req.params.uniqId);
        const idstor = await IDStorage.find({"yourID": req.params.uniqId});
        
        const fid = idstor[0]
        //console.log(fid)
        if(fid._id){
        
        const newSurvey = new PreSurvey({
            "uniqueId": fid["_id"],
            "q1": req.body.q1,
            "q2": req.body.q2,
            "q3": req.body.q3,
            "q4": req.body.q4,
            "q5": req.body.q5,
            "q6": req.body.q6,
            "q7": req.body.q7,
            "q8": req.body.q8,
            "q9": req.body.q9,
            "q10": req.body.q10,
            "prolific_Code": "123",
            "feedback": sanitizeInput(req.body.feedback)
        });
        
        console.log("newSurvey")
        //console.log(newSurvey)
        // save user and send response
        const survey = await newSurvey.save();
        await IDStorage.updateOne(
            { _id: fid._id },
            { $set: { available: false } }
        );
        
        //console.log(survey)
        res.status(200).json(survey);

    }else{
        res.status(400).json("Failed");

    }
    
    } catch (err) {
        logger.error('Error saving data', { error: err.message });
        console.log(err)
        res.status(500).json(err);
    }
    });
    
// Submit pre survey
router.post('/postsurvey/:uniqId',verifyToken,  async (req, res) => {
    logger.info('Data received', { data: req.body });
    try{
        console.log("herelkjkl");
        //console.log(req.params.uniqId);
        const idstor = await IDStorage.find({"yourID": req.params.uniqId});
        
        const fid = idstor[0]
        //console.log(fid)
        if(fid._id){
        const newSurvey = new PostSurvey({
            "uniqueId": fid["_id"],
            "q1": req.body.q1,
            "q2": req.body.q2,
            "q3": req.body.q3,
            "q4": req.body.q4,
            "q5": req.body.q5,
            "q6": req.body.q6,
            "q7": req.body.q7,
            "q8": req.body.q8,
            "q9": req.body.q9,
            "q10": req.body.q10,
            "q11": req.body.q11,
            "q12": req.body.q12,
            "q13": req.body.q13,
            "q14": req.body.q14,
            "q15": req.body.q15,
            "q16": req.body.q16,
            "q17": req.body.q17
        });
        console.log("newSurvey")
        //console.log(newSurvey)
        // save user and send response
        const survey = await newSurvey.save();
        //console.log(survey)
        res.status(200).json(survey);

    }else{
        res.status(400).json("Failed");

    }
    
    } catch (err) {
        logger.error('Error saving data', { error: err.message });
        console.log(err)
        res.status(500).json(err);
    }
    });

// Check survey completion status (updated for three-stage survey)
router.post('/isSubmitted/:val', async (req, res) => {
    logger.info('Data received', { data: req.body });
    try {
        console.log("Checking survey status for:", req.params.val);

        // Find the ID in IDStorage
        const idstor = await IDStorage.find({ "yourID": req.params.val });
        if (!idstor || idstor.length === 0) {
            console.log("ID not found in IDStorage");
            res.status(404).json({ error: "ID not found" });
            return;
        }

        const fid = idstor[0];
        console.log("FID object:", fid);

        // Check for new three-stage survey completion
        const consentResponse = await ConsentResponse.findOne({ "uniqueId": fid["_id"] });
        const demographicsData = await DemographicsData.findOne({ "uniqueId": fid["_id"] });
        const weeklyResponse = await WeeklyResponse.findOne({ "uniqueId": fid["_id"] });

        // If all three stages are complete
        if (consentResponse && demographicsData && weeklyResponse) {
            console.log("Three-stage survey completed");

            // Check if a User exists with the same ID
            const userExist = await User.find({ "uniqueId": fid["_id"] });
            console.log("User result:", userExist);

            if (userExist && userExist.length > 0) {
                console.log("User found");
                var usr = {};
                const existingSurvey = await PostSurvey.findOne({ userId: req.params.userId });
                console.log(existingSurvey);
                
                if (existingSurvey && existingSurvey.prolific_code) {
                    usr = { "data": true, "login": true, "user": userExist[0], "code": existingSurvey.prolific_code};
                } else {
                    usr = { "data": true, "login": true, "user": userExist[0] };
                }
                res.status(200).json(usr);
            } else {
                // Survey complete but no user account - show user selection
                console.log("Survey complete, showing user selection");
                console.log("IDStorage document:", fid);
                console.log("Version from IDStorage:", fid.version, "Type:", typeof fid.version);
                
                // Try different ways to access the version field
                const versionValue = fid.version || fid.get('version') || fid['version'];
                console.log("Version value extracted:", versionValue, "Type:", typeof versionValue);
                
                const versionString = String(versionValue);
                console.log("Version as string:", versionString);
                
                // First, let's try a simple query to make sure users exist
                const simpleCount = await SelectedUsers.countDocuments({
                    available: true,
                    version: versionString
                });
                console.log("Simple count query result:", simpleCount);
                
                if (simpleCount === 0) {
                    console.log("No users found with simple query - trying fallback");
                    // If no users found, try a fallback to any available users
                    const fallbackUsers = await SelectedUsers.find({ available: true }).limit(6);
                    const users2 = fallbackUsers.slice(0, 4);
                    const usr = {
                        "data": true,
                        "users": users2,
                        "surveyComplete": true
                    };
                    res.status(200).json(usr);
                    return;
                }
                
                // CORRECTED aggregation: Sample first, then group by username for diversity
                const users = await SelectedUsers.aggregate([
                    {                                             
                        $match: {
                            available: true,           
                            version: versionString 
                        }
                    },
                    {
                        $sample: { size: 50 }  // Sample 50 random users first
                    },
                    {
                        $group: {
                            _id: "$username",  // Group by username to get unique usernames
                            user: { $first: "$$ROOT" }  // Take first user for each username
                        }
                    },
                    {
                        $limit: 6  // Limit to 6 different usernames
                    }
                ]);
                
                console.log("Aggregation result count:", users.length);
                console.log("Aggregation result:", users);
                
                // Extract the actual user data from the aggregation result
                const users2 = users.map(item => item.user).slice(0, 4);
                console.log("Processed users2 count:", users2.length);
                console.log("Processed users2:", users2);
                
                const usr = {
                    "data": true,
                    "users": users2.length > 0 ? users2 : [],
                    "surveyComplete": true
                };
                res.status(200).json(usr);
            }
        } else {
            // Check legacy PreSurvey format for backward compatibility
            const legacyPreSurvey = await PreSurvey.findOne({ "uniqueId": fid["_id"] });
            
            if (legacyPreSurvey) {
                // Handle legacy survey logic (existing code)
                const userExist = await User.find({ "uniqueId": fid["_id"] });
                
                if (userExist && userExist.length > 0) {
                    const usr = { "data": true, "login": true, "user": userExist[0] };
                    res.status(200).json(usr);
                } else {
                    // Legacy survey complete but no user account
                    console.log("Legacy survey complete, showing user selection");
                    console.log("IDStorage document:", fid);
                    
                    const users = await SelectedUsers.aggregate([
                        {                                             
                            $match: {
                                available: true,           
                                version: String(fid.version) 
                            }
                        },
                        {
                            $group: {
                                _id: {username_second: "$username_second", username: "$username"},     
                                user: { $first: "$$ROOT" } 
                            }
                        },
                        {
                            $sample: { size: 20 } 
                        },
                        {
                            $group: {
                                _id: "$user.username", 
                                user: { $first: "$user" } 
                            }
                        },
                        {
                            $limit: 6 
                        }
                    ]);
                    
                    console.log("Legacy aggregation result count:", users.length);
                    
                    // Extract the actual user data from the aggregation result
                    const users2 = users.map(item => item.user).slice(0, 4);
                    const usr = {
                        "data": true,
                        "users": users2.length > 0 ? users2 : []
                    };
                    res.status(200).json(usr);
                }
            } else {
                // No survey data found - fresh start
                console.log("No survey data found");
                res.status(200).json({ 
                    "data": false, 
                    "surveyStage": "consent",
                    "message": "Please complete the consent form to begin"
                });
            }
        }
    } catch (err) {
        logger.error('Error checking survey status', { error: err.message });
        console.log("Error:", err);
        res.status(500).json({ error: "Internal server error", details: err });
    }
});

    module.exports = router;