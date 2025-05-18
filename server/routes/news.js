const SelectedUsers = require('../models/SelectedUser');
const PreSurvey = require('../models/PreSurvey');
const User = require('../models/User');
const IDStorage = require('../models/IDStorage');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const PostSurvey = require('../models/PostSurvey'); 
var ObjectId = require('mongodb').ObjectID;
const sanitizeHtml = require('sanitize-html');
const logger = require('../logs/logger');
const path = require('path');

const verifyToken = require('../middleware/verifyToken');

function sanitizeInput(input) {
    return sanitizeHtml(input, {
        allowedTags: [], // No HTML allowed
        allowedAttributes: {} // No attributes allowed
    });
}

// Submit pre survey
router.get('/news_1',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html/news_1.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});
router.get('/news_2',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html/news_2.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});

router.get('/news_3',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html/news_3.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});

router.get('/news_4',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html/news_4.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});

router.get('/news_5',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html/news_5.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});

router.get('/news_6',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html/news_6.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});

router.get('/news_7',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html/news_7.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});

router.get('/news_8',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html/news_8.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});

router.get('/news_9',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html/news_9.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});

router.get('/news_10',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html/news_10.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});





// Submit pre survey
router.get('/breaking_1',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html2/breaking_1.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});
router.get('/breaking_2',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html2/breaking_2.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});

router.get('/breaking_3',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html2/breaking_3.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});

router.get('/breaking_4',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html2/breaking_4.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});

router.get('/breaking_5',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html2/breaking_5.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});

router.get('/breaking_6',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html2/breaking_6.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});

router.get('/breaking_7',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html2/breaking_7.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});

router.get('/breaking_8',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html2/breaking_8.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});

router.get('/breaking_9',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html2/breaking_9.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});








// Submit pre survey
router.get('/uncensoredtruth_1',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html2/uncensoredtruth_1.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});

router.get('/uncensoredtruth_2',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html2/uncensoredtruth_2.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});

router.get('/uncensoredtruth_3',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html2/uncensoredtruth_3.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});

router.get('/uncensoredtruth_4',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html2/uncensoredtruth_4.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});

router.get('/uncensoredtruth_5',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html2/uncensoredtruth_5.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});













// Submit pre survey
router.get('/not_relevant_1',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html/not_relevant_1.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});
router.get('/not_relevant_2',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html2/not_relevant_2.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});

router.get('/not_relevant_3',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html/not_relevant_3.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});

router.get('/not_relevant_4',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html2/not_relevant_4.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});

router.get('/not_relevant_5',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html/not_relevant_5.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});

router.get('/not_relevant_6',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html2/not_relevant_6.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});

router.get('/not_relevant_7',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html/not_relevant_7.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});

router.get('/not_relevant_8',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html2/not_relevant_8.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});

router.get('/not_relevant_9',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html/not_relevant_9.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});





    module.exports = router;