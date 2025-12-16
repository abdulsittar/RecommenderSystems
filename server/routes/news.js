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
const { getArticlesByTopic, getArticleById } = require('../utils/articlesData');

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





// New dynamic routes for serving article content
router.get('/article/:articleId', async (req, res) => {
    logger.info('Dynamic article request', { articleId: req.params.articleId });
    try {
        const articleId = parseInt(req.params.articleId);
        const article = getArticleById(articleId);
        
        if (!article) {
            return res.status(404).send('<h1>Article Not Found</h1><p>The requested article could not be found.</p>');
        }
        
        // Generate HTML for the article
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            background-color: #f5f5f5;
        }
        .article-container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .article-header {
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .article-title {
            color: #333;
            margin: 0 0 15px 0;
            font-size: 2em;
            line-height: 1.2;
        }
        .article-meta {
            color: #666;
            font-size: 0.9em;
            display: flex;
            gap: 20px;
        }
        .meta-item {
            background: #f0f0f0;
            padding: 5px 10px;
            border-radius: 15px;
        }
        .article-content {
            color: #444;
        }
        .article-content h2 {
            color: #2c3e50;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        .article-content h3 {
            color: #34495e;
            margin-top: 25px;
            margin-bottom: 12px;
        }
        .article-content p {
            margin-bottom: 15px;
        }
        .back-button {
            position: fixed;
            top: 20px;
            left: 20px;
            background: #3498db;
            color: white;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 14px;
        }
        .back-button:hover {
            background: #2980b9;
        }
        .agreement-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border: 1px solid #e0e0e0;
        }
        .agreement-question {
            font-size: 1.1em;
            font-weight: 500;
            color: #333;
            margin-bottom: 15px;
        }
        .slider-container {
            margin: 20px 0;
        }
        .slider {
            width: 100%;
            height: 8px;
            border-radius: 4px;
            background: linear-gradient(to right, #e74c3c 0%, #f39c12 50%, #27ae60 100%);
            outline: none;
            -webkit-appearance: none;
        }
        .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #3498db;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        .slider::-moz-range-thumb {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #3498db;
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        .slider-labels {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            font-size: 0.85em;
            color: #666;
        }
        .slider-value {
            text-align: center;
            font-size: 1.2em;
            font-weight: bold;
            color: #3498db;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <a href="javascript:history.back()" class="back-button">← Back</a>
    
    <div class="article-container">
        <div class="article-header">
            <h1 class="article-title">${article.title}</h1>
            <div class="article-meta">
                <span class="meta-item">Topic: ${article.topic}</span>
            </div>
        </div>
        
        <div class="article-content">
            ${article.body}
        </div>
        
        <div class="agreement-section">
            <div class="agreement-question">
                To what extent do you agree with the perspective presented in this article?
            </div>
            <div class="slider-container">
                <input type="range" min="0" max="10" value="5" class="slider" id="agreementSlider">
                <div class="slider-labels">
                    <span>0 - Strongly Disagree</span>
                    <span>5 - Neutral</span>
                    <span>10 - Strongly Agree</span>
                </div>
                <div class="slider-value">
                    Current Rating: <span id="sliderValue">5</span>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // Track time spent on article
        let articleOpenTime = Date.now();
        
        const slider = document.getElementById('agreementSlider');
        const sliderValue = document.getElementById('sliderValue');
        
        slider.addEventListener('input', function() {
            sliderValue.textContent = this.value;
        });
        
        // Store the agreement value for later retrieval by parent frame
        slider.addEventListener('change', function() {
            const agreementValue = this.value;
            // This can be accessed by the parent iframe through postMessage
            if (window.parent) {
                window.parent.postMessage({
                    type: 'articleAgreement',
                    value: agreementValue,
                    articleId: ${article.id}
                }, '*');
            }
        });
        
        // Handle back button clicks - communicate with parent frame
        const backButton = document.querySelector('.back-button');
        if (backButton && !backButton.dataset.listenerAttached) {
            backButton.dataset.listenerAttached = 'true';
            backButton.addEventListener('click', function handleBackClick(e) {
                e.preventDefault();
                e.stopImmediatePropagation(); // Prevent other handlers
                const timeSpent = Date.now() - articleOpenTime;
                // Notify parent frame about back button click and time spent
                if (window.parent) {
                    window.parent.postMessage({
                        type: 'articleBackButtonClicked',
                        articleId: ${article.id},
                        timeSpent: timeSpent
                    }, '*');
                }
            }, { once: false }); // Keep listener active for multiple clicks
        }
    </script>
</body>
</html>`;
        
        res.send(html);
        
    } catch (err) {
        logger.error('Error serving dynamic article', { error: err.message });
        res.status(500).send('<h1>Server Error</h1><p>Unable to load the article.</p>');
    }
});

// Route for serving articles by topic (for the old pattern URLs)
router.get('/abortion_:number', async (req, res) => {
    logger.info('Topic-based article request', { topic: 'abortion', number: req.params.number });
    try {
        const articles = getArticlesByTopic('abortion');
        const articleIndex = parseInt(req.params.number) - 1;
        
        if (articleIndex < 0 || articleIndex >= articles.length) {
            return res.status(404).send('<h1>Article Not Found</h1><p>The requested article could not be found.</p>');
        }
        
        const article = articles[articleIndex];
        
        // Redirect to the article by ID for consistency
        res.redirect(`/news/article/${article.id}`);
        
    } catch (err) {
        logger.error('Error serving topic-based article', { error: err.message });
        res.status(500).send('<h1>Server Error</h1><p>Unable to load the article.</p>');
    }
});

// Similar routes for other topics
router.get('/gun-control_:number', async (req, res) => {
    logger.info('Topic-based article request', { topic: 'gun control', number: req.params.number });
    try {
        const articles = getArticlesByTopic('gun control');
        const articleIndex = parseInt(req.params.number) - 1;
        
        if (articleIndex < 0 || articleIndex >= articles.length) {
            return res.status(404).send('<h1>Article Not Found</h1><p>The requested article could not be found.</p>');
        }
        
        const article = articles[articleIndex];
        res.redirect(`/news/article/${article.id}`);
        
    } catch (err) {
        logger.error('Error serving topic-based article', { error: err.message });
        res.status(500).send('<h1>Server Error</h1><p>Unable to load the article.</p>');
    }
});

router.get('/assisted-death_:number', async (req, res) => {
    logger.info('Topic-based article request', { topic: 'assisted death', number: req.params.number });
    try {
        const articles = getArticlesByTopic('assisted death');
        const articleIndex = parseInt(req.params.number) - 1;
        
        if (articleIndex < 0 || articleIndex >= articles.length) {
            return res.status(404).send('<h1>Article Not Found</h1><p>The requested article could not be found.</p>');
        }
        
        const article = articles[articleIndex];
        res.redirect(`/news/article/${article.id}`);
        
    } catch (err) {
        logger.error('Error serving topic-based article', { error: err.message });
        res.status(500).send('<h1>Server Error</h1><p>Unable to load the article.</p>');
    }
});

    module.exports = router;