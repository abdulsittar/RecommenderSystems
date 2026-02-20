const PostSurvey = require('../models/PostSurvey');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const conn = mongoose.createConnection('mongodb+srv://abdulsittar72:2106010991As@cluster0.gsnbbwq.mongodb.net/test?retryWrites=true&w=majority');
const { ObjectId } = require('mongodb');
const IDStorage = require('../models/IDStorage');
const PreSurvey = require('../models/PreSurvey');
const verifyToken = require('../middleware/verifyToken');
const sanitizeHtml = require('sanitize-html');
const logger = require('../logs/logger');

function sanitizeInput(input) {
    return sanitizeHtml(input, {
        allowedTags: [], // No HTML allowed
        allowedAttributes: {} // No attributes allowed
    });
}


function generateSevenDigitRandomNumber() {
    return Math.floor(1000000 + Math.random() * 9000000);
}

// Submit pre survey
router.post('/pstsurvey/:userId', verifyToken, async (req, res) => {
    logger.info('Data received', { data: req.body });
    try{
        console.log("herelkjkl");
        console.log(req.params);
        
        const existingSurvey = await PostSurvey.findOne({ userId: req.params.userId });
        if (existingSurvey) {
            return res.status(400).json({ code: existingSurvey.prolific_code, message: "User has already submitted a post-survey." });
        }
        
        //var gen_code = generateSevenDigitRandomNumber()
        
        const preSurvey = await PreSurvey.findOne({ uniqueId: req.body.uniqueId });

        /*if (!preSurvey) {
            return res.status(404).json({ message: "PreSurvey not found for the given userId." });
        }*/

        // Use prolific_Code from PreSurvey
        const gen_code = preSurvey.prolific_Code;
        
        
        const newSurvey = new PostSurvey({
            userId: req.params.userId,

  q1: req.body.survey.q1,
  q2: req.body.survey.q2,
  q3: req.body.survey.q3,
  q4: req.body.survey.q4,
  q5: req.body.survey.q5,

  q6: req.body.survey.q6,
  q6_1: req.body.survey.q6_1,
  q6_2: req.body.survey.q6_2,

  q7_1: req.body.survey.q7_1,
  q7_2: req.body.survey.q7_2,
  q7_3: req.body.survey.q7_3,
  q7_4: req.body.survey.q7_4,
  q7_5: req.body.survey.q7_5,
  q7_6: req.body.survey.q7_6,
  q7_7: req.body.survey.q7_7,

  q8_1: req.body.survey.q8_1,
  q8_2: req.body.survey.q8_2,
  q8_3: req.body.survey.q8_3,
  q8_4: req.body.survey.q8_4,
  q8_5: req.body.survey.q8_5,
  q8_6: req.body.survey.q8_6,
  q8_7: req.body.survey.q8_7,
  q8_8: req.body.survey.q8_8,
  q8_9: req.body.survey.q8_9,
  q8_10: req.body.survey.q8_10,

  q9: req.body.survey.q9,
  q10: req.body.survey.q10,
  q11: req.body.survey.q11,
  q12: req.body.survey.q12,
  q13: req.body.survey.q13,
  q14: req.body.survey.q14,
  q15: req.body.survey.q15,
  q16: sanitizeInput(req.body.survey.q16),
  q17: req.body.survey.q17,
  q18: req.body.survey.q18,
  q19: req.body.survey.q19,
  q20: req.body.survey.q20,

  q21: req.body.survey.q21, // feedback2
  feedback: sanitizeInput(req.body.survey.feedback), // feedback3

  prolific_code: gen_code
        });
        console.log("newSurvey");
        console.log(newSurvey)
        // save user and send response
        const survey = await newSurvey.save();
        //console.log(survey)
        res.status(200).json({ message: gen_code });
        return
    
    } catch (err) {
        logger.error('Error saving data', { error: err.message });
        console.log(err)
        res.status(500).json(err);
    }
    });
    
    module.exports = router;

// PILOT STUDY: Simplified post-survey route (13 weekly survey questions + feedback)
router.post('/simplified/:userId', verifyToken, async (req, res) => {
    logger.info('Simplified post-survey data received', { data: req.body });
    try {
        console.log("Processing simplified post-survey for user:", req.params.userId);
        
        // Check if user already submitted
        const existingSurvey = await PostSurvey.findOne({ userId: req.params.userId });
        if (existingSurvey) {
            return res.status(400).json({ 
                message: "User has already submitted a post-survey.",
                prolificCode: existingSurvey.prolific_code
            });
        }
        
        // Get prolific code from PreSurvey
        const user = await require('../models/User').findById(req.params.userId);
        const idstor = await IDStorage.findOne({ _id: user.uniqueId });
        let prolificCode = 'PILOT_TEST_CODE'; // Default code for pilot
        
        if (idstor && idstor.yourID) {
            const preSurvey = await PreSurvey.findOne({ uniqueId: idstor._id });
            if (preSurvey && preSurvey.prolific_Code) {
                prolificCode = preSurvey.prolific_Code;
            }
        }
        
        // Store simplified post-survey data
        // Using existing PostSurvey model but only filling relevant fields
        const newSurvey = new PostSurvey({
            userId: req.params.userId,
            
            // Store the 13 topic survey responses in q1-q13
            q1: String(req.body.topicAttitude || 50),           // Overall attitude (0-100)
            q2: String(req.body.oneSide_openminded || 5),       // One side: open-minded (0-10)
            q3: String(req.body.oneSide_moderate || 5),         // One side: moderate (0-10)
            q4: String(req.body.oneSide_moral || 5),            // One side: moral (0-10)
            q5: String(req.body.oneSide_family || 5),           // One side: family (0-10)
            q6: String(req.body.oneSide_friend || 5),           // One side: friend (0-10)
            q7_1: String(req.body.oneSide_coworker || 5),       // One side: coworker (0-10)
            
            q8_1: String(req.body.otherSide_openminded || 5),   // Other side: open-minded (0-10)
            q8_2: String(req.body.otherSide_moderate || 5),     // Other side: moderate (0-10)
            q8_3: String(req.body.otherSide_moral || 5),        // Other side: moral (0-10)
            q8_4: String(req.body.otherSide_family || 5),       // Other side: family (0-10)
            q8_5: String(req.body.otherSide_friend || 5),       // Other side: friend (0-10)
            q8_6: String(req.body.otherSide_coworker || 5),     // Other side: coworker (0-10)
            
            // Store optional feedback
            feedback: sanitizeInput(req.body.feedback || ''),
            
            // Store prolific code
            prolific_code: prolificCode,
            
            // Store topic for reference
            q21: req.body.topic || 'unknown'
        });
        
        await newSurvey.save();
        console.log("Simplified post-survey saved successfully");
        
        res.status(200).json({ 
            success: true,
            message: 'Post-survey submitted successfully',
            prolificCode: prolificCode
        });
        
    } catch (err) {
        logger.error('Error saving simplified post-survey', { error: err.message });
        console.error(err);
        res.status(500).json({ error: 'Failed to save post-survey', details: err.message });
    }
});

module.exports = router;