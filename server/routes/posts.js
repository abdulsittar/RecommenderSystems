{
    const router = require('express').Router();
    const Post = require('../models/Post');
    const Article = require('../models/Article');
    const User = require('../models/User');
    const SpecialPost = require('../models/specialpost');
    const PostDislike = require('../models/PostDislike');
    const PostLike = require('../models/PostLike');
    const path = require('path');
    const fs = require('fs');
    const PostSurvey = require('../models/PostSurvey');
    const Repost = require('../models/Repost');
    const Viewpost = require('../models/Viewpost');
    const IDStorage = require('../models/IDStorage');
    const { getInitialPostsByTopic, getPostsByTopicAndPage, getWebLinksByTopic } = require('../utils/posts');
    const { sampleArticles } = require('../utils/sampleArticles');
    //var ObjectId = require('mongodb').ObjectID;

    const Comment = require('../models/Comment');
    const Subscription = require('../models/Subscription');
    const webPush = require('web-push');
    const mongoose = require('mongoose');
    const { ObjectId } = require('mongoose').Types;
    const conn = mongoose.createConnection('mongodb+srv://abdulsittar72:2106010991As@cluster0.gsnbbwq.mongodb.net/test?retryWrites=true&w=majority');
    const verifyToken = require('../middleware/verifyToken');
    const axios = require('axios');
    const cheerio = require('cheerio');
    const sanitizeHtml = require('sanitize-html');
    const DOMPurify = require('dompurify');
    const logger = require('../logs/logger');

    const { JSDOM } = require('jsdom');
    const window = new JSDOM('').window;
    const DOMPurifyInstance = DOMPurify(window);
    /**
     * @swagger
     * components:
     *   schemas:
     *     Post:
     *       type: object
     *       required:
     *         - userId
     *         - desc
     *       properties:
     *         id:
     *           type: string
     *           description: The auto-generated id of the post
     *         userId:
     *           type: string
     *           description: The userid of user who is creating the post 
     *         desc:
     *           type: string
     *           description: The text of the post
     *         likes:
     *           type: array
     *           description: an array of post-likes'
     *         dislikes:
     *           type: array
     *           description: an array of post-dislikes'
     *         reposts:
     *           type: array
     *           description: an array of reposts-users'
     *         comments:
     *           type: string
     *           format: email
     *           description: The comments of the user
     *         password:
     *           type: string
     *           description: The password of the user
     *       example:
     *         email: XYZ@gmail.com
     *         password: 123456
     */

    /**
      * @swagger
      * components:
      *   schemas:
      *     Postlike:
      *       type: object
      *       required:
      *         - userId
      *         - postId
      *       properties:
      *         id:
      *           type: string
      *           description: The auto-generated id of the post
      *         userId:
      *           type: string
      *           description: The id of a user who is liking the post.
      *         postId:
      *           type: string
      *           description: The id of a post which is being liked.
      */

    /**
    * @swagger
    * components:
    *   schemas:
    *     Postdislike:
    *       type: object
    *       required:
    *         - userId
    *         - postId
    *       properties:
    *         id:
    *           type: string
    *           description: The auto-generated id of the post
    *         userId:
    *           type: string
    *           description: The id of a user who is disliking the post.
    *         postId:
    *           type: string
    *           description: The id of a post which is being disliked.
    */


    /**
    * @swagger
    * components:
    *   schemas:
    *     Repost:
    *       type: object
    *       required:
    *         - userId
    *         - postId
    *       properties:
    *         id:
    *           type: string
    *           description: The auto-generated id of the reposted object
    *         userId:
    *           type: string
    *           description: The id of a user who is reposting the post.
    *         postId:
    *           type: string
    *           description: The id of a post which is being reposted.
    */

    /**
    * @swagger
    * components:
    *   schemas:
    *     Readpost:
    *       type: object
    *       required:
    *         - userId
    *         - postId
    *       properties:
    *         id:
    *           type: string
    *           description: The auto-generated id of the post which is being read
    *         userId:
    *           type: string
    *           description: The id of the user who is reading it.
    *         postId:
    *           type: string
    *           description: The id of the post which is being read
    */

    /**
     * 
     /**
     * @swagger
     * components:
     *   schemas:
     *     Viewpost:
     *       type: object
     *       required:
     *         - userId
     *         - postId
     *       properties:
     *         id:
     *           type: string
     *           description: The auto-generated id of the post which is being viewed
     *         userId:
     *           type: string
     *           description: The id of the user who is viewing it.
     *         postId:
     *           type: string
     *           description: The id of the post which is being viewed
     */

    /**
    /**
     * @swagger
     * tags:
     *   name: Posts
     *   description: The posts managing APIs
     * /:
     *   post:
     *     summary: Create a new post
     *     tags: [Posts]
     *     parameters:
     *       - in: path
     *         name: userId
     *         schema:
     *           type: string
     *         required: true
     *         description: user id
     *       - in: path
     *         name: desc
     *         schema:
     *           type: string
     *         required: true
     *         description: text of the post
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Post'
     *     responses:
     *       200:
     *         description: The post is created!
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       500:
     *         description: Some server error!
     */

    const extractImageFromUrl = async (url) => {
        try {
            // Make an HTTP GET request to the URL
            const response = await axios.get(url);

            // Load HTML response into cheerio
            const $ = cheerio.load(response.data);

            // Look for the first <img> tag and get its 'src' attribute
            const firstImageUrl = $('img').first().attr('src');

            // Check if an image URL was found and if it's a full URL
            if (firstImageUrl) {
                // If the image URL is relative, resolve it against the original URL
                const imageUrl = new URL(firstImageUrl, url).href;
                return imageUrl;
            }

            // No image found on the page
            return null;
        } catch (error) {

            console.error(`Error fetching or parsing URL (${url}):`, error.message);
            return null;
        }
    };


    const extractUrls = (text) => {
        const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/g;
        const urls = text.match(urlRegex) || [];
        // Filter URLs for common image extensions
        return urls.filter((url) => /\.(jpeg|jpg|gif|png|webp)$/.test(url.toLowerCase()));
        // Iterate over each URL and find an image link if it exists
        //for (const url of urls) {
        //   const imageUrl = await extractImageFromUrl(url);
        //  if (imageUrl) {
        //     return imageUrl;  // Return the first image URL found
        //}
    }

    // Return null if no images were found on any URL
    //return null;
    //};

    function sanitizeInput(input) {

        return DOMPurifyInstance.sanitize(input, { ALLOWED_TAGS: [] });


        var val = sanitizeHtml(input, {
            allowedTags: [], // No HTML allowed
            allowedAttributes: {} // No attributes allowed
        });
        return val.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // create a post
    router.post('/:id/create', verifyToken, async (req, res) => { //verifyToken, 
        //console.log(req.params);
        //console.log(req.body);
        logger.info('Data received', { data: req.body });
        var linktoAdd = ""
        var urls = extractUrls(req.body.desc);

        if (urls.length > 0) {
            linktoAdd = urls[0]

        }

        console.log(linktoAdd);
        const newPost = new Post({ userId: mongoose.Types.ObjectId(req.body.userId), treatment: "", content: "", pool: req.body.pool, desc: sanitizeInput(req.body.desc), thumb: linktoAdd });
        //console.log(newPost);

        try {
            const savedPost = await newPost.save();
            res.status(200).json(savedPost);

        } catch (err) {
            logger.error('Error saving data 23', { error: err.message });
            res.status(500).json(err);
        }
    })

    const createAndSavePost = async (data) => {
        try {
            //console.log(data);
            const newPost = new Post(data);
            const savedPost = await newPost.save();
            console.log("Post saved successfully:", savedPost);
            return savedPost;
        } catch (error) {
            logger.error('Error saving data 10', { error: error.message });
            console.error("Error creating or saving post:", error);
            throw error;
        }
    };


    const createAndSaveComment = async (data) => {
        try {
            const newPost = new Comment(data);
            const savedPost = await newPost.save();
            console.log("Comment saved successfully:", savedPost);
            return savedPost;
        } catch (error) {
            console.error("Error creating or saving comment:", error);
            throw error;
        }
    };

    const shuffleArray = async (array) => {
        const shuffled = [...array]; // clone the array to avoid mutating the original
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // swap
        }
        return shuffled;
    };

    const getUserRecommendation = async (userId, postId) => {
        try {
            // Step 1: Get Total Likes Given by the User
            const totalLikes = await PostLike.countDocuments({ userId, postId });
            // Step 2: Get Total Dislikes Given by the User
            const totalDislikes = await PostDislike.countDocuments({ userId, postId });
            // Step 3: Get Total Views by the User
            const totalViews = await Viewpost.countDocuments({ userId, postId });
            // Step 4: Get Total Comments by the User
            const totalComments = await Comment.countDocuments({ userId, postId });
            // Step 5: Calculate User Interaction Score
            const interactionScore = (totalViews * 1) + (totalLikes * 1) + (totalDislikes * -1) + (totalComments * 0.5);

            console.log("totalLikes:", totalLikes);
            console.log("totalDislikes:", totalDislikes);
            console.log("totalViews:", totalViews);
            console.log("totalComments:", totalComments);

            console.log("interactionScore:", interactionScore);

            return interactionScore

            let userType = "control";
            if (interactionScore > 5) userType = "reinforcing";
            else if (interactionScore < 0) userType = "opposing";
            console.log("userType:", userType);


        } catch (error) {
            console.error("Error creating or saving comment:", error);
            throw error;
        }
    };

    const getUserABScores = async (userId) => {
        let totalDisInforScore = 0;
        let totalUkraineScore = 0;
        console.log("getUserABScores:", userId);

        const posts = await Post.find({ "reactorUser": userId })
            .populate([
                { path: "likes", model: "PostLike", match: { "userId": userId } },
                { path: "dislikes", model: "PostDislike", match: { "userId": userId } }
            ])
            .sort({ createdAt: 'descending' })
            .exec();

        for (const post of posts) {
            const engagementScore = await getUserRecommendation(userId, post.id);

            totalDisInforScore += engagementScore * post.disinfo;
            totalUkraineScore += engagementScore * post.ukraine;


        }
        console.log("totalDisInforScore:", totalDisInforScore);
        console.log("totalUkraineScore:", totalUkraineScore);
        return {
            scoreA: totalDisInforScore,
            scoreB: totalUkraineScore
        };
    };



        // Reusable helper: create initial training posts for a given user and topic
        async function createInitialDataForUser({ targetUserId, pool, topic = 'abortion', reactorUserId = null }) {
                // Gather seed posts and optional web links
                
                let trainPosts = (typeof getInitialPostsByTopic === 'function') ? getInitialPostsByTopic(topic) : [];
                // Ensure we only use 5 training posts
                if (Array.isArray(trainPosts) && trainPosts.length > 5) {
                    trainPosts = trainPosts.slice(0, 5);
                }
                const webLinksPosts = (typeof getWebLinksByTopic === 'function') ? getWebLinksByTopic(topic) : [];

                if (!Array.isArray(trainPosts) || trainPosts.length === 0) {
                        throw new Error(`No training posts found for topic "${topic}"`);
                }

                // Helper function to extract first sentence from article body
                const getFirstSentence = (htmlBody) => {
                    if (!htmlBody) return '';
                    // Remove HTML tags
                    const textOnly = htmlBody.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                    // Get first sentence (split by period, exclamation, or question mark)
                    const sentences = textOnly.split(/[.!?]+/);
                    return sentences[0] ? sentences[0].trim() + '.' : '';
                };

                // Fetch article details for each post to get the first sentence
                const { getArticleById } = require('../utils/articlesData');

                // Default scoring arrays - will be trimmed/padded to match trainPosts length
                const defaultUkraine = [-1, -1, 1, 1, -1];
                const defaultDisinfo = [-0.1, -0.1, 0.5, -0.1, 1];
                const defaultRanks = Array.from({ length: trainPosts.length }, (_, i) => i + 1);
                const userGroup = 'pro-choice';
                const treatmentValue = 0;

                const combined = trainPosts.map((post, index) => {
                    const articleId = post.articleId || post.id;
                    const article = getArticleById(articleId);
                    const firstSentence = article ? getFirstSentence(article.body) : '';
                    const title = post.title || post.text || post;
                    
                    return {
                        title: title,
                        firstSentence: firstSentence,
                        articleId: articleId,
                        rank: defaultRanks[index] || (index + 1),
                        ukraine: defaultUkraine[index] !== undefined ? defaultUkraine[index] : 0,
                        disinfo: defaultDisinfo[index] !== undefined ? defaultDisinfo[index] : 0,
                        webLinks: webLinksPosts[index] || null,
                        userGroup
                    };
                });

                // Persist posts (only the training posts)
                const created = [];
                for (const item of combined) {
                        const newPost = {
                                userId: new mongoose.Types.ObjectId(targetUserId),
                                reactorUser: reactorUserId && mongoose.Types.ObjectId.isValid(reactorUserId) ? new mongoose.Types.ObjectId(reactorUserId) : null,
                                pool: pool,
                                desc: item.firstSentence, // Store first sentence in desc
                                title: item.title, // Store title separately
                                articleId: item.articleId, // link to full article content
                                rank: item.rank,
                                ukraine: item.ukraine,
                                disinfo: item.disinfo,
                                treatment: treatmentValue,
                                content: topic,
                                userGroup: item.userGroup,
                                webLinks: item.webLinks
                        };
                        const saved = await createAndSavePost(newPost);
                        created.push(saved);
                }

                return created;
        }

        // Attach helper to router so other modules can call it programmatically
        router.createInitialData = createInitialDataForUser;

        // Route: create initial data (keeps previous behavior but delegates to helper)
        router.post('/:id/createInitialData', verifyToken, async (req, res) => {
                logger.info('Data received', { data: req.body });
                try {
                        // Validate that :id is a valid MongoDB ObjectId
                        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                                return res.status(400).json({ success: false, error: 'Invalid user ID format' });
                        }
                        
                        const topic = req.body.topic || 'abortion';
                        const pool = req.body.pool || req.body.version || 1; // fallback to version or 1
                        const created = await createInitialDataForUser({ 
                                targetUserId: req.params.id, 
                                pool: pool, 
                                topic, 
                                reactorUserId: req.body.userId 
                        });
                        res.status(200).json({ success: true, message: `Posts for topic "${topic}" created successfully!`, created });
                } catch (error) {
                        logger.error('Error saving data', { error: error.message });
                        res.status(500).json({ success: false, error: error.message });
                }
        });

        // Route: create refresh data for returning users (new session with incremented treatment)
        router.post('/:id/createRefreshData', verifyToken, async (req, res) => {
                logger.info('Data received', { data: req.body });
                try {
                        // Validate that :id is a valid MongoDB ObjectId
                        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                                return res.status(400).json({ success: false, error: 'Invalid user ID format' });
                        }

                        const userId = req.params.id;
                        console.log('='.repeat(60));
                        console.log('CREATE REFRESH DATA - New Session');
                        console.log('='.repeat(60));
                        console.log(`User ID: ${userId}`);
                        
                        // Find the maximum treatment value for this user
                        const maxTreatmentPost = await Post
                                .findOne({ "reactorUser": userId })
                                .sort({ treatment: -1 })
                                .exec();
                        
                        let newTreatment = 0;
                        if (maxTreatmentPost) {
                                newTreatment = maxTreatmentPost.treatment + 1;
                                console.log(`Max existing treatment: ${maxTreatmentPost.treatment}`);
                        } else {
                                console.log('No existing posts found, starting with treatment 0');
                        }
                        console.log(`New treatment value: ${newTreatment}`);
                        
                        // Get user's current topic
                        const user = await User.findById(userId);
                        if (!user) {
                                return res.status(404).json({ success: false, error: 'User not found' });
                        }
                        
                        const topic = user.currentTopic || req.body.topic || 'abortion';
                        const pool = req.body.pool || req.body.version || user.pool || 1;
                        
                        console.log(`Topic: ${topic}`);
                        console.log(`Pool: ${pool}`);
                        
                        // Create initial data with incremented treatment
                        const created = await createInitialDataForUser({ 
                                targetUserId: userId, 
                                pool: pool, 
                                topic, 
                                reactorUserId: req.body.userId || userId
                        });
                        
                        // Update the treatment value for all newly created posts
                        const postIds = created.map(p => p._id);
                        await Post.updateMany(
                                { _id: { $in: postIds } },
                                { $set: { treatment: newTreatment } }
                        );
                        
                        console.log(`Created ${created.length} posts with treatment ${newTreatment}`);
                        console.log('='.repeat(60));
                        
                        res.status(200).json({ 
                                success: true, 
                                message: `Posts for session ${newTreatment + 1} created successfully!`, 
                                treatment: newTreatment,
                                created 
                        });
                } catch (error) {
                        logger.error('Error creating refresh data', { error: error.message });
                        console.error('CREATE REFRESH DATA ERROR:', error);
                        res.status(500).json({ success: false, error: error.message });
                }
        });

    //repost a post
    router.post('/:id/repost', verifyToken, async (req, res) => {
        logger.info('Data received', { data: req.body });
        try {

            const postRepost = new Repost({ userId: req.body.userId, postId: req.params.id });
            await postRepost.save();
            //console.log(postRepost);
            console.log("postRepost is added");
            //const post = await Post.findById(req.params.id);
            await Post.findOneAndUpdate({ "_id": req.params.id }, { $push: { reposts: req.body.userId } });
            res.status(200).json('The post has been reposted!');

        } catch (err) {
            logger.error('Error saving data 24', { error: err.message });
            res.status(500).json(err);
            console.log(err)
        }
    })


    //update a post
    router.put('/:id', verifyToken, async (req, res) => {
        logger.info('Data received', { data: req.body });
        try {
            const post = await Post.findById(req.params.id);
            if (post.userId === req.body.userId) {
                await post.updateOne({ $set: req.body });
                res.status(200).json('The post has been updated');
            } else {
                res.status(403).json('You can only update your post!');
            }
        } catch (err) {
            logger.error('Error saving data 25', { error: err.message });
            res.status(500).json(err);
        }
    })

    // notification
    router.post('/subscribe', verifyToken, async (req, res) => {
        logger.info('Data received', { data: req.body });
        //console.log(req);
        const newSubscription = await Subscription.create({ ...req.body });
        const options = {
            vapidDetails: {
                subject: 'mailto:myemail@example.com',
                publicKey: process.env.PUBLIC_KEY,
                privateKey: process.env.PRIVATE_KEY,
            },
        };
        //console.log(req.body)
        console.log(options)
        console.log(newSubscription.endpoint)
        try {
            const res2 = await webPush.sendNotification(
                newSubscription,
                JSON.stringify({
                    title: 'Hello from server',
                    description: 'this message is coming from the server',
                    image: 'https://cdn2.vectorstock.com/i/thumb-large/94/66/emoji-smile-icon-symbol-smiley-face-vector-26119466.jpg',
                }),
                options
            );
            console.log(res2);
            res.sendStatus(200);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    });

    router.post('/fetch-thumbnail', verifyToken, async (req, res) => {
        //const { url } = req.body;
        try {
            //console.log(req.body.urls);

            // First, check if the local file exists
            const localImagePath = path.join(process.cwd(), 'public', 'images', req.body.urls); // Assuming the filename is provided in req.body.urls
            //const localThumbnailUrl = `${req.protocol}://${req.get('host')}/images/${req.body.urls}`;
            //console.log("here");
            //console.log(localImagePath);
            //console.log(localThumbnailUrl);

            if (fs.existsSync(localImagePath)) {
                // If the file exists locally, return the local URL

                const imageBuffer = fs.readFileSync(localImagePath);
                const base64Image = imageBuffer.toString('base64');

                // Send the base64 string as the thumbnail in the response
                return res.json({
                    thumbnail: `data:image/png;base64,${base64Image}` // Assuming it's a PNG, adjust accordingly
                });
            } else {

                // If the file doesn't exist locally, proceed with scraping using Cheerio
                const { data } = await axios.get(req.body.urls);  // Scraping the URL
                const $ = cheerio.load(data);

                // Extract Open Graph image
                const thumbnail = $('meta[property="og:image"]').attr('content');

                if (thumbnail) {
                    // If a thumbnail is found, return the online URL
                    return res.json({ thumbnail });
                } else {
                    // If no thumbnail is found, return an error
                    return res.status(404).json({ error: 'Thumbnail not found online or locally' });
                }
            }

        } catch (error) {
            //console.error(error);
            res.status(500).json({ error: 'Error fetching thumbnail' });
        }
    });

    router.post("/:id/track-view", verifyToken, async (req, res) => {
        console.log("track-view");

        try {
            const { userId, postId } = req.body; // Get user and post IDs from request
            console.log(userId);
            console.log(postId);
            if (!userId || !postId) {
                return res.status(400).json({ message: "User ID and Post ID are required" });
            }

            // Check if the user has already viewed this post
            let existingView = await Viewpost.findOne({ userId, postId });

            if (existingView) {
                // Update the timestamp of the existing entry
                existingView.updatedAt = new Date();
                await existingView.save();
            } else {
                // Create a new view entry if not already exists
                const newView = new Viewpost({ userId, postId });
                await newView.save();
            }

            // Update user's readPosts array (only if not already there)
            const user = await User.findById(userId);
            if (user) {
                // Add to lifetime readPosts if not already there
                if (!user.readPosts.includes(postId)) {
                    await user.updateOne({ $push: { readPosts: postId } });
                    console.log("Added post to user's readPosts array:", postId);
                }
                
                // Add to sessionReadPosts if not already there (for current session tracking)
                if (!user.sessionReadPosts.includes(postId)) {
                    await user.updateOne({ $push: { sessionReadPosts: postId } });
                    console.log("Added post to user's sessionReadPosts array:", postId);
                }
            }

            res.status(200).json({ message: "Viewpost updated successfully." });

        } catch (error) {
            console.error("Error updating view post:", error);
            res.status(500).json({ error: "Internal Server Error", details: error.message });
        }
    });

    // delete a post
    router.delete('/:id', verifyToken, async (req, res) => {
        logger.info('Data received', { data: req.body });
        try {
            const post = await Post.findById(req.params.id);
            if (post.userId === req.body.userId) {
                await post.deleteOne();
                res.status(200).json('The post has been deleted');
            } else {
                res.status(403).json('You can only delete your post!');
            }
        } catch (err) {
            res.status(500).json(err);
        }
    })


    /**
     * @swagger
     * tags:
     *   name: Posts
     *   description: The posts managing APIs
     * /:id/like:
     *   put:
     *     summary: Like or dislike a post
     *     tags: [Posts]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: post id
     *       - in: path
     *         name: userId
     *         schema:
     *           type: string
     *         required: true
     *         description: user id
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Post'
     *     responses:
     *       200:
     *         description: The post is liked or disliked by you!
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Post'
     *       500:
     *         description: Some server error!
     */

    function waitForOneSecond() {
        setTimeout(() => {
            // Code to execute after 1 second
            console.log('One second has passed!');
        }, 1000); // 1000 milliseconds = 1 second
    }


    // like a post
    router.put('/:id/like', verifyToken, async (req, res) => {
        logger.info('Data received', { data: req.body });

        //const post = await Post.find({"_id":req.params.id,"PostLike.userId": ObjectId(req.body.userId), "PostDislike.userId": ObjectId(req.body.userId)}, {"PostLike.$": 1,"PostDislike.$": 1 }).populate([{path : "likes", model: "PostLike"}, {path : "dislikes", model: "PostDislike"}]).sort({ createdAt: 'descending' }).exec();
        const post = await Post.findById(req.params.id).populate([{ path: "likes", model: "PostLike", match: { "userId": req.body.userId } }, { path: "dislikes", model: "PostDislike", match: { "userId": req.body.userId } }]).sort({ createdAt: 'descending' }).exec();
        //const posttoReturn = await Post.findById(req.params.id).populate([{path : "likes", model: "PostLike"}, {path : "dislikes", model: "PostDislike"}]).sort({ createdAt: 'descending' }).exec();

        console.log("Disliked objects");
        console.log(post.dislikes.length);

        //const likedObj = await PostLike.find({"postId": req.params.id, "userId" : req.body.userId})
        console.log("Liked objects");
        console.log(post.likes.length);

        var isAlreadyLiked = false;
        var isAlreadyDisliked = false;

        if (post.likes.length > 0) {
            isAlreadyLiked = true
            try {
                console.log("LIKE - 1");
                const idl = new ObjectId(post.likes[0]._id)
                await Post.findOneAndUpdate({ _id: req.params.id }, { $pull: { 'likes': { $in: [idl] } } });
                const dltobj = await PostLike.findByIdAndDelete({ _id: idl });
                const post2 = await Post.findById(req.params.id).populate([{ path: "likes", model: "PostLike" }, { path: "dislikes", model: "PostDislike" }]).sort({ createdAt: 'descending' }).exec();
                //console.log(post2);
                var diction = { "likes": -1, "dislikes": parseInt(0) }
                res.status(200).json(diction);
            } catch (err) {
                logger.error('Error saving data 26', { error: err.message });
                console.log(err);
                res.status(500).json(err);
            }
        }

        else if (post.dislikes.length > 0) {
            isAlreadyDisliked = true
            try {
                console.log("LIKE - 2");
                const idl = new ObjectId(post.dislikes[0]._id)
                await Post.findOneAndUpdate({ _id: req.params.id }, { $pull: { 'dislikes': { $in: [idl] } } });
                const dltobj = await PostLike.findByIdAndDelete(idl);
                const post2 = await Post.findById(req.params.id).populate([{ path: "likes", model: "PostLike" }, { path: "dislikes", model: "PostDislike" }]).sort({ createdAt: 'descending' }).exec();
                //console.log(post2);
                var diction = { "likes": parseInt(0), "dislikes": -1 }
                res.status(200).json(diction);
            } catch (err) {
                logger.error('Error saving data 27', { error: err.message });
                res.status(500).json(err);

            }
        }

        if (!isAlreadyLiked) {
            if (!isAlreadyDisliked) {
                try {
                    console.log("LIKE - 3");
                    const postLike = new PostLike({ userId: req.body.userId, postId: req.params.id });
                    await postLike.save();
                    console.log(postLike);
                    console.log("postLike is added");
                    //const post = await Post.findById(req.params.id);
                    await Post.findOneAndUpdate({ "_id": req.params.id }, { $push: { likes: postLike } });
                    const post2 = await Post.findById(req.params.id, { upsert: true, new: true }).populate([{ path: "likes", model: "PostLike" }, { path: "dislikes", model: "PostDislike" }]).sort({ createdAt: 'descending' }).exec();
                    //console.log(post2);
                    var diction = { "likes": 1, "dislikes": parseInt(0) }
                    res.status(200).json(diction);

                } catch (err) {
                    logger.error('Error saving data 28', { error: err.message });
                    console.log(err);
                    res.status(500).json(err);

                }
            } else {
                console.log("Both are not false");
                console.log(isAlreadyLiked);
                console.log(isAlreadyDisliked);
            }
        } else {
            console.log(isAlreadyLiked);
        }
    });

    // dislike a post
    router.put('/:id/dislike', verifyToken, async (req, res) => {
        logger.info('Data received', { data: req.body });

        const post = await Post.findById(req.params.id).populate([{ path: "likes", model: "PostLike", match: { "userId": req.body.userId } }, { path: "dislikes", model: "PostDislike", match: { "userId": req.body.userId } }]).sort({ createdAt: 'descending' }).exec();
        console.log("Disliked objects");
        console.log(post.dislikes.length);

        //const likedObj = await PostLike.find({"postId": req.params.id, "userId" : req.body.userId})
        console.log("Liked objects");
        console.log(post.likes.length);

        var isAlreadyLiked = false;
        var isAlreadyDisliked = false;

        if (post.likes.length > 0) {
            const idd = post.likes[0]._id
            isAlreadyLiked = true
            try {

                console.log("DISLIKE - 1");
                const idl = new ObjectId(idd);
                await Post.findOneAndUpdate({ _id: req.params.id }, { $pull: { 'likes': { $in: [idl] } } });
                const dltobj = await PostLike.findByIdAndDelete({ _id: idl });

                const post = await Post.findById(req.params.id).populate([{ path: "likes", model: "PostLike" }, { path: "dislikes", model: "PostDislike" }]).sort({ createdAt: 'descending' }).exec();
                console.log(post);
                var diction = { "likes": -1, "dislikes": parseInt(0) }
                res.status(200).json(diction);


            } catch (err) {
                logger.error('Error saving data 29', { error: err.message });
                console.log(err);
                res.status(500).json(err);
            }
        } else if (post.dislikes.length > 0) {
            isAlreadyDisliked = true
            try {
                console.log("DISLIKE - 2");
                const idl = new ObjectId(post.dislikes[0]._id)
                await Post.findOneAndUpdate({ _id: req.params.id }, { $pull: { 'dislikes': { $in: [idl] } } });
                const dltobj = await PostLike.findByIdAndDelete(idl);
                const post2 = await Post.findById(req.params.id).populate([{ path: "likes", model: "PostLike" }, { path: "dislikes", model: "PostDislike" }]).sort({ createdAt: 'descending' }).exec();
                console.log(post2);
                var diction = { "likes": parseInt(0), "dislikes": -1 }
                res.status(200).json(diction);

            } catch (err) {
                logger.error('Error saving data 30', { error: err.message });
                res.status(500).json(err);

            }
        }

        if (!isAlreadyLiked) {
            if (!isAlreadyDisliked) {
                try {
                    console.log("DISLIKE - 3");
                    const postDislike = new PostDislike({ userId: req.body.userId, postId: req.params.id });
                    await postDislike.save();
                    console.log(postDislike);
                    console.log("postDislike is added");

                    const post = await Post.findById(req.params.id);
                    await post.updateOne({ $push: { dislikes: postDislike } });
                    const post2 = await Post.findById(req.params.id).populate([{ path: "likes", model: "PostLike" }, { path: "dislikes", model: "PostDislike" }]).sort({ createdAt: 'descending' }).exec();
                    console.log(post2);
                    var diction = { "likes": parseInt(0), "dislikes": 1 }
                    res.status(200).json(diction);
                } catch (err) {
                    logger.error('Error saving data 31', { error: err.message });
                    console.log(err);
                    res.status(500).json(err);
                }
            } else {

                console.log("Both are not false");
                console.log(isAlreadyLiked);
                console.log(isAlreadyDisliked);
            }
        } else {
            console.log(isAlreadyLiked);
        }
    });

    // like a post
    router.put('/:id/like2', verifyToken, async (req, res) => {
        try {
            // Like a post
            const post = await Post.findById(req.params.id);
            if (!post.likes.includes(req.body.userId)) {
                await post.updateOne({ $push: { likes: req.body.userId } });
                res.status(200).json('The post has been liked!');
            } else {
                // Dislike a post
                await post.updateOne({ $pull: { likes: req.body.userId } });
                res.status(403).json('The post has been disliked!');
            }
        } catch (err) {
            logger.error('Error saving data 32', { error: err.message });
            res.status(500).json(err);
        }
    })

    // like a post
    router.put('/:id/dislike2', verifyToken, async (req, res) => {
        try {
            // Dislike a post
            const post = await Post.findById(req.params.id);
            if (!post.dislikes.includes(req.body.userId)) {
                await post.updateOne({ $push: { dislikes: req.body.userId } });
                res.status(200).json('The post has been disliked!');
            } else {
                // Dislike a post
                await post.updateOne({ $pull: { dislikes: req.body.userId } });
                res.status(403).json('The post has been disliked!');
            }
        } catch (err) {
            logger.error('Error saving data 33', { error: err.message });
            res.status(500).json(err);
        }
    })


    /**
     * @swagger
     * tags:
     *   name: Posts
     *   description: The posts managing APIs
     * /:id:
     *   get:
     *     summary: Fetch a post
     *     tags: [Posts]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: post id
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Post'
     *     responses:
     *       200:
     *         description: Here is the post
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Post'
     *       500:
     *         description: Some server error!
     */


    // readSpecialPost a post
    router.post('/UserReadSpecialPost', verifyToken, async (req, res) => {
        logger.info('Data received', { data: req.body });
        try {
            await User.findOneAndUpdate({ "_id": req.body.userId }, { $push: { readSpecialPosts: req.body.postId } });
            res.status(200).json('The post has been added to special reading!');
        } catch (err) {
            logger.error('Error saving data 34', { error: err.message });
            res.status(500).json(err);
        }

    });


    // get a post
    router.get('/:id', verifyToken, async (req, res) => { //verifyToken, 
        logger.info('Data received', { data: req.body });
        //console.log(req.params.id)
        try {
            const post = await Post.findById(req.params.id).populate({ path: 'comments', model: 'Comment', populate: [{ path: "userId", model: "User" }, { path: "likes", model: "CommentLike" }, { path: "dislikes", model: "CommentDislike" }, { path: 'reposts', model: 'Repost', populate: { path: 'userId', model: 'User' } }] }).exec();
            console.log("post")
            console.log(post)
            res.status(200).json(post);

        } catch (err) {
            logger.error('Error saving data 35', { error: err.message });
            res.status(500).json(err);
        }
    })

    /**
     * @swagger
     * tags:
     *   name: Posts
     *   description: The posts managing APIs
     * /timeline2/:userId:
     *   get:
     *     summary: Fetch posts of a user and his/her followings
     *     tags: [Posts]
     *     parameters:
     *       - in: path
     *         name: userId
     *         schema:
     *           type: string
     *         required: true
     *         description: user id
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Post'
     *     responses:
     *       200:
     *         description: The post is created!
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       500:
     *         description: Some server error!
     */


    // get all posts
    router.get('/timeline2/:userId', verifyToken, async (req, res) => {
        try {
            const currentUser = await User.findById(req.params.userId).populate('Comment').exec();
            const userPosts = await Post.find({ userId: currentUser._id });

            const friendPosts = await Promise.all(
                currentUser.followings.map((friendId) => {
                    return Post.find({ userId: friendId }).populate('Comment').exec();
                })
            );

            res.status(200).json(userPosts.concat(...friendPosts));
        } catch (err) {
            logger.error('Error saving data 45', { error: err.message });
            res.status(500).json(err);
        }
    })

    // get pagination posts
    router.get('/timelinePag/:userId', verifyToken, async (req, res) => {
        logger.info('Data received', { data: req.body, query: req.query });
        //console.log(req.query.page);
        //console.log(req.headers['userid']);
       try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 0;
    const topic = req.query.topic; // Get topic from query parameters
    const exclude = req.query.exclude; // Get exclude parameter (comma-separated post IDs)
    const excludeArticles = req.query.excludeArticles; // Get exclude articles parameter
    
    // Parse exclude IDs
    const excludeIds = exclude ? exclude.split(',').filter(id => id.trim()) : [];
    const excludeArticleIds = excludeArticles ? excludeArticles.split(',').filter(id => id.trim()) : [];

    console.log('Timeline endpoint - userId:', userId, 'page:', page, 'topic:', topic, 'excludeIds:', excludeIds.length, 'excludeArticleIds:', excludeArticleIds.length);

    // ✅ first page should show the latest batch, filtered by topic if provided
    const posts = await getLatestFivePosts(userId, page, topic, excludeIds, excludeArticleIds);

    res.status(200).json(posts);
  } catch (error) {
    logger.error('Error fetching latest posts', { error: error.message });
    res.status(500).json({ success: false, error: error.message });
  }
    }
    )

    //service
    const getPostsPaginated = async (page, userId) => {
        const currentUser = await User.findById(userId)
        const maxRoundResult = await Post
            .find({ $or: [{ reactorUser: userId }, { userId: currentUser.id }] })
            .sort({ treatment: -1 })
            .limit(1)
            .select('treatment')
            .exec();

        const maxRound = maxRoundResult.length > 0 ? maxRoundResult[0].treatment : null;

        if (maxRound === null) {
            return []; // No posts found
        }
        console.log("maxRound")
        console.log(maxRound)
        let resultsPerPage = 30


        console.log(currentUser)
        console.log(currentUser.id)
        const txt = Post.find({ "userId": currentUser.id })
        console.log("txt[0]")
        console.log(txt[0])

        const posts = await Post.find({ $or: [{ "reactorUser": userId }, { "userId": currentUser.id }], treatment: maxRound })
            .populate({ path: 'comments', model: 'Comment', populate: [{ path: "userId", model: "User" }, { path: "likes", model: "CommentLike" }, { path: "dislikes", model: "CommentDislike" }] })
            .sort({ rank: 1 })
            //.lean()
            .skip(page * resultsPerPage)
            .limit(resultsPerPage)
            .exec()
        console.log(posts.length);
        return posts;
    }

    // all users
    router.get('/timeline/:userId', verifyToken, async (req, res) => {
        logger.info('Data received', { data: req.body, query: req.query });
        try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 0;
    const topic = req.query.topic; // Get topic from query parameters
    const exclude = req.query.exclude; // Get exclude parameter (comma-separated post IDs)
    
    // Parse exclude IDs
    const excludeIds = exclude ? exclude.split(',').filter(id => id.trim()) : [];

    // ✅ first page should show the latest batch, filtered by topic if provided
    const posts = await getLatestFivePosts(userId, page, topic, excludeIds);

    res.status(200).json(posts);
  } catch (error) {
    logger.error('Error fetching latest posts', { error: error.message });
    res.status(500).json({ success: false, error: error.message });
  }
    });

const recommendationService = require('../services/recommendationService');

// Get posts filtered by topic - Updated to use recommendation service
const getLatestFivePosts = async (userId, page = 0, topic = null, excludeIds = [], excludeArticleIds = []) => {
  const currentUser = await User.findById(userId);
  if (!currentUser) return [];
    const limit = 8;

  // ✅ If user has control group and stance score, use recommendation service
  if (currentUser.controlGroup && currentUser.stanceScore !== undefined && currentUser.stanceScore !== null) {
    logger.info('Using recommendation service', { 
      userId, 
      controlGroup: currentUser.controlGroup, 
      topic,
      excludeCount: excludeIds.length,
      excludeArticleCount: excludeArticleIds.length
    });
    
    return await recommendationService.getRecommendedPosts(
      userId,
      topic || currentUser.currentTopic,
      page,
      limit,
      excludeIds,
      excludeArticleIds  // Pass article IDs to exclude
    );
  }

  // ✅ Default behavior for users without control groups (backward compatible)
  // Build query filter - show all posts, not just user's posts
  let queryFilter = {};
  
  // If topic is provided, filter by content field (which stores the topic)
  if (topic) {
    queryFilter.content = topic;
  }
  
  // Add exclusion filter if excludeIds are provided
  // Convert string IDs to ObjectIds for proper MongoDB matching
  if (excludeIds && excludeIds.length > 0) {
    const mongoose = require('mongoose');
    const objectIds = excludeIds
      .filter(id => mongoose.Types.ObjectId.isValid(id))
      .map(id => new mongoose.Types.ObjectId(id));
    if (objectIds.length > 0) {
      queryFilter._id = { $nin: objectIds };
    }
  }
  
  // Add article exclusion filter if excludeArticleIds are provided
  // This prevents showing different posts with the same article
  if (excludeArticleIds && excludeArticleIds.length > 0) {
    queryFilter.articleId = { $nin: excludeArticleIds };
  }

  console.log('Using default time-based recommendations', { userId, topic, excludeCount: excludeIds.length, excludeArticleCount: excludeArticleIds.length });
  console.log('getLatestFivePosts - Topic filter:', topic, 'Query filter:', queryFilter);

  // Debug: Check what posts exist in database
  const allPosts = await Post.find({}).select('content userId title desc createdAt').sort({ createdAt: -1 }).limit(10);
  console.log('Database posts (latest 10):');
  allPosts.forEach((post, i) => {
    console.log(`  ${i+1}. Content: "${post.content}" | UserId: ${post.userId} | Title: "${post.title?.substring(0, 50)}..." | Desc: "${post.desc?.substring(0, 50)}..." | Created: ${post.createdAt}`);
  });

  console.log('Searching for posts with filter:', queryFilter);

    // ✅ Fetch more posts than needed to account for potential duplicates
  const posts = await Post.find(queryFilter)
    .sort({ createdAt: -1 })
        .limit(limit * 3)
    .populate('userId', 'username profilePicture') // populate user info for display
    .populate({
      path: 'comments',
      model: 'Comment',
      populate: [
        { path: 'userId', model: 'User' },
        { path: 'likes', model: 'CommentLike' },
        { path: 'dislikes', model: 'CommentDislike' }
      ]
    })
    .exec();

  // Deduplicate by articleId (keep first occurrence, which is newest due to sort)
  const seenArticleIds = new Set();
    const latestPosts = posts.filter(post => {
    const articleIdStr = post.articleId?.toString();
    if (!articleIdStr) return true; // Keep posts without articles
    if (seenArticleIds.has(articleIdStr)) {
      console.log(`  Filtering duplicate article: ${articleIdStr} (post ID: ${post._id})`);
      return false;
    }
    seenArticleIds.add(articleIdStr);
    return true;
    }).slice(0, limit); // Return only requested unique articles

    console.log('getLatestFivePosts - Found posts:', latestPosts.length);
    latestPosts.forEach((post, i) => {
    console.log(`  Found ${i+1}. Content: "${post.content}" | ArticleId: "${post.articleId}" | Title: "${post.title?.substring(0, 50)}..." | Desc: "${post.desc?.substring(0, 50)}..."`);
  });
    return latestPosts;
};


    /**
     * @swagger
     * tags:
     *   name: Posts
     *   description: The posts managing APIs
     * /onlyFollowers/:userId:
     *   get:
     *     summary: Fetch posts of only followers!
     *     tags: [Posts]
     *     parameters:
     *       - in: path
     *         name: userId
     *         schema:
     *           type: string
     *         required: true
     *         description: user id
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Post'
     *     responses:
     *       200:
     *         description: Here are the posts by your followers!
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       500:
     *         description: Some server error!
     */

    // post of only follower
    router.get('/onlyFollowers/:userId', verifyToken, async (req, res) => {
        logger.info('Data received', { data: req.body });
        try {
            const currentUser = await User.findById(req.params.userId);
            const userPosts = await Post.find({ userId: currentUser._id }).populate('Comment').exec();

            const friendPosts = await Promise.all(
                currentUser.followers.map((friendId) => {
                    return Post.find({ userId: friendId });
                })
            );
            //console.log(friendPosts.length)

            res.status(200).json(userPosts.concat(...friendPosts));
        } catch (err) {
            logger.error('Error saving data 14', { error: err.message });
            res.status(500).json(err);
        }
    });

    //service
    const getPostsPaginatedFollowers = async (page, req) => {
        let resultsPerPage = 20
        const currentUser = await User.findById(req.params.userId);
        //const userPosts = await Post.find({ userId: currentUser._id }).populate('Comment').exec();
        let userPosts = []
        const friendPosts = await Promise.all(
            currentUser.followers.map((friendId) => {
                return Post.find({ userId: friendId })
                    .populate({ path: 'comments', populate: { path: "userId", model: "User" } })
                    .sort({ createdAt: 'descending' })
                    //.lean()
                    .skip(page * resultsPerPage)
                    .limit(resultsPerPage)
                    .exec()
            }))

        //console.log([].concat(...friendPosts))
        //const filtPost =  follPosts.sort({ createdAt: 'descending' }).lean().limit(resultsPerPage).skip(page * resultsPerPage)
        return [].concat(...friendPosts)
    }

    // post of only follower
    router.get('/onlyFollowersPag/:userId', verifyToken, async (req, res) => {
        logger.info('Data received', { data: req.body });
        console.log("hereherehereh");
        //console.log(req.query.page);

        try {
            let page = req.query.page //starts from 0
            let posts = await getPostsPaginatedFollowers(page, req)

            if (posts && posts.length > 0) {
                res.status(200).json(posts)
            } else {
                res.status(200).json(posts);
                //console.log(res);
            }

        } catch (err) {
            logger.error('Error saving data 15', { error: err.message });
            //console.log(err);
            res.status(500).json(err);
        }
    });



    router.post('/random_id', async (req, res) => {
        try {

            // Get a random document's 'yourID' from the collection
            const randomDoc = await IDStorage.aggregate([
                { $match: { available: true } }, // Only include documents with available: true
                { $sample: { size: 1 } } // Get a random document
            ]);

            logger.info("randomDoc");
            logger.info(randomDoc);

            if (randomDoc.length > 0) {
                const yourID = randomDoc[0].yourID;
                const defaultPassword = yourID.substring(0, 10);
                
                // Update the document with default password if not already set
                await IDStorage.updateOne(
                    { _id: randomDoc[0]._id },
                    { $set: { defaultPassword: defaultPassword } }
                );
                
                res.status(200).json({ yourID: yourID });
            } else {
                res.status(404).json({ message: "No data found" });
            }

        } catch (err) {
            console.log("Error details:", err.message); // Log just the error message
            logger.error("Stack trace:", err.stack); // Log the stack trace explicitly
            res.status(500).json({ error: "Failed to fetch data" });
        }
    });

    // posts of only followings
    router.get('/:id/getUserPost/', verifyToken, async (req, res) => {
        logger.info('Data received', { data: req.body });
        try {

            console.log("getUserPost");
            //console.log(req.params.id);
            const currentUser = await User.findById(req.params.id);
            console.log(currentUser);

            const existingSurvey = await PostSurvey.findOne({ userId: currentUser.id });
            if (existingSurvey) {
                return res.status(200).json({ message: existingSurvey.prolific_code, message2: "User has already submitted a post-survey." });
            }

            const userPosts = await Post.find({ reactorUser: currentUser._id, thumb: { $regex: /post/i } }).populate('comments').exec();
            console.log(userPosts);
            res.status(200).json(userPosts);

        } catch (err) {
            logger.error('Error saving data 16', { error: err.message });
            console.log(err);
            res.status(500).json(err);
        }
    });




    /**
     * @swagger
     * tags:
     *   name: Posts
     *   description: The posts managing APIs
     * /onlyFollowings/:userId:
     *   get:
     *     summary: Fetch posts of only followings!
     *     tags: [Posts]
     *     parameters:
     *       - in: path
     *         name: userId
     *         schema:
     *           type: string
     *         required: true
     *         description: user id
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Post'
     *     responses:
     *       200:
     *         description: Here are the posts by your followings!
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       500:
     *         description: Some server error!
     */

    //service
    const getPostsPaginatedFollowings = async (page, req) => {
        let resultsPerPage = 20
        const currentUser = await User.findById(req.params.userId);
        //const userPosts = await Post.find({ userId: currentUser._id }).populate('Comment').exec();

        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId })
                    .populate({ path: 'comments', populate: { path: "userId", model: "User" } })
                    .sort({ createdAt: 'descending' })
                    //.lean()
                    .skip(page * resultsPerPage)
                    .limit(resultsPerPage)
                    .exec()
            }))

        let userPosts = []
        userPosts.concat(...friendPosts)
        //console.log([].concat(...friendPosts));
        //const filtPost =  follPosts.sort({ createdAt: 'descending' }).lean().limit(resultsPerPage).skip(page * resultsPerPage)
        return [].concat(...friendPosts)
    }

    // posts of only followings
    router.get('/onlyFollowingsPag/:userId', verifyToken, async (req, res) => {
        logger.info('Data received', { data: req.body });
        try {
            let page = req.query.page
            const currentUser = await User.findById(req.params.userId);
            let posts = await getPostsPaginatedFollowings(page, req)
            if (posts && posts.length > 0) {
                res.status(200).json(posts)
            } else {
                res.status(200).json(posts);
                //console.log(res);
            }

        } catch (err) {
            logger.error('Error saving data 17', { error: err.message });
            //console.log(err);
            res.status(500).json(err);
        }
    });

    // posts of only followings
    router.get('/onlyFollowings/:userId', verifyToken, async (req, res) => {
        logger.info('Data received', { data: req.body });

        try {
            let page = req.query.page //starts from 0
            let posts = await getPostsPaginatedFollowings(page)
            if (posts && posts.length > 0) {
                res.status(200).json(posts)
            } else {
                //res.status(200).json("error");
                console.log(res);
            }

        } catch (err) {
            logger.error('Error saving data 18', { error: err.message });
            res.status(500).json(err);
        }


        try {
            const currentUser = await User.findById(req.params.userId);
            const userPosts = await Post.find({ userId: currentUser._id }).populate('Comment').exec();

            const friendPosts = await Promise.all(
                currentUser.followings.map((friendId) => {
                    return Post.find({ userId: friendId }).populate('Comment').exec();
                })
            );
            //console.log(friendPosts.length)      
            res.status(200).json(userPosts.concat(...friendPosts));
        } catch (err) {
            logger.error('Error saving data 19', { error: err.message });
            res.status(500).json(err);
        }
    });

    /**
     * @swagger
     * tags:
     *   name: Posts
     *   description: The posts managing APIs
     * /onlyFollowings/:userId:
     *   get:
     *     summary: Fetch all of your posts!
     *     tags: [Posts]
     *     parameters:
     *       - in: path
     *         name: username
     *         schema:
     *           type: string
     *         required: true
     *         description: username
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Post'
     *     responses:
     *       200:
     *         description: Here is the list of your posts!
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       500:
     *         description: Some server error!
     */

    // get all posts of a user
    router.get('/profile/:username', verifyToken, async (req, res) => {
        logger.info('Data received', { data: req.body });
        try {
            let resultsPerPage = 20
            const user = await User.findOne({ username: req.params.username });
            const posts = await Post.find({ userId: user._id })
                .populate({ path: 'comments', populate: { path: "userId", model: "User" } })
                .sort({ createdAt: 'descending' })
                //.lean()
                .skip(req.query.page * resultsPerPage)
                .limit(resultsPerPage)
                .exec()
            res.status(200).json(posts);
        } catch (err) {
            logger.error('Error saving data 20', { error: err.message });
            res.status(500).json(err);
            console.log(err);
        }
    });

    // get all comments

    // add a comment
    router.post('/:id/comment', verifyToken, async (req, res) => {
        logger.info('Data received', { data: req.body });
        //console.log(req.body.userId)
        const user = await User.findOne({ _id: req.body.userId });
        console.log(user)
        const comment = new Comment({ body: sanitizeInput(req.body.txt), userId: user._id, postId: req.body.postId, username: req.body.username });
        try {
            await comment.save();
            const post = await Post.findById(req.body.postId);
            await post.updateOne({ $push: { comments: comment } });
            const comm = await Comment.findOne({ postId: req.body.postId }).sort({ createdAt: 'descending' })
            //post.comments.findOne(sort=[('$natural', DESCENDING)]);
            //await post.comments.push(comment);

            //await post.save(function(err) {
            //    if(err) {
            //        console.log(err)
            //    }
            //    });
            //await post.updateOne({_id:req.body.postId}, {$push: {comments:comment}});
            res.status(200).json(comm);

        } catch (err) {
            logger.error('Error saving data 21', { error: err.message });
            console.log(res.status(500).json(err));
        }
        // create a comment
        /* console.log(req.body.postId)
        console.log(req.body.txt)
        console.log(req.body.userId)
        //const post = await Post.findById(req.params.id);
        try{
        let result = await Post.findOneAndUpdate({_id:req.body.postId}, {Comment: {body: req.body.txt, userId:req.body.userId, postId:req.body.postId}},
                function(err,post){
                    if (err || !post) {
                        console.log(res.json({ error: err }));
                    }
                }
            )
        } catch(err) {
        console.log(err)
        console.log(res.status(500).json(err));
        }*/
    });

    router.get('/:userId/getSpecialPosts', verifyToken, async (req, res) => {
        logger.info('Data received', { data: req.body });
        try {
            // Step 1: Find the current user and check their pool
            const currentUser = await User.findById(req.params.userId).populate('readSpecialPosts', '_id pool');
            console.log("getSpecialPosts");

            let specialPostsInPool;
            specialPostsInPool = await SpecialPost.find({ version: currentUser.pool });
            console.log("specialPostsInPool");
            console.log(specialPostsInPool);

            const specialPostIdsInPool = specialPostsInPool.map(post => post._id.toString());
            console.log(specialPostIdsInPool);
            const readPostIds = currentUser.readSpecialPosts.map(post => post._id.toString());
            console.log(readPostIds);

            const unreadPostId = specialPostIdsInPool.find(postId => !readPostIds.includes(postId));
            console.log(unreadPostId);

            let unreadPost;
            if (unreadPostId) {
                // Fetch details of the next unread post in the same pool
                unreadPost = await SpecialPost.findById(unreadPostId);
            }

            // Step 4: Return the unread post or first post as fallback
            if (unreadPost) {
                return res.status(200).json(unreadPost);
            } else {
                return res.status(200).json([]);
            }
        } catch (err) {
            logger.error('Error saving data 22', { error: err.message });
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
        }
    });

    // Get posts for a given topic and page (page starts at 0). Returns 5 posts per page.
    router.get('/topic/:topic/posts', verifyToken, async (req, res) => {
        logger.info('Topic page request', { topic: req.params.topic, page: req.query.page });
        try {
            const page = req.query.page || 0;
            const topic = req.params.topic;
            const posts = getPostsByTopicAndPage(topic, page, 5);
            return res.status(200).json(posts);
        } catch (err) {
            logger.error('Error fetching topic posts', { error: err.message });
            return res.status(500).json({ error: err.message });
        }
    });


    // Get article content by articleId
    router.get('/article/:articleId', verifyToken, async (req, res) => {
        logger.info('Article request', { articleId: req.params.articleId });
        try {
            const articleId = parseInt(req.params.articleId);
            
            // First try to find article in database
            let article = await Article.findOne({ articleId: articleId });
            
            // If not found in database, check sample articles
            if (!article) {
                const sampleArticle = sampleArticles.find(a => a.articleId === articleId);
                if (sampleArticle) {
                    // Optionally save to database for future use
                    article = new Article(sampleArticle);
                    await article.save();
                    logger.info('Saved sample article to database', { articleId });
                } else {
                    return res.status(404).json({ error: 'Article not found' });
                }
            }
            
            return res.status(200).json(article);
        } catch (err) {
            logger.error('Error fetching article', { error: err.message });
            return res.status(500).json({ error: err.message });
        }
    });

    // Get post with article content
    router.get('/:postId/with-article', verifyToken, async (req, res) => {
        logger.info('Post with article request', { postId: req.params.postId });
        try {
            const post = await Post.findById(req.params.postId);
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }
            
            let article = null;
            if (post.articleId) {
                // Try to find article in database first
                article = await Article.findOne({ articleId: post.articleId });
                
                // If not found, check sample articles
                if (!article) {
                    const sampleArticle = sampleArticles.find(a => a.articleId === post.articleId);
                    if (sampleArticle) {
                        article = new Article(sampleArticle);
                        await article.save();
                        logger.info('Saved sample article to database', { articleId: post.articleId });
                    }
                }
            }
            
            return res.status(200).json({
                post: post,
                article: article
            });
        } catch (err) {
            logger.error('Error fetching post with article', { error: err.message });
            return res.status(500).json({ error: err.message });
        }
    });

    // delete a comment
    // delete a post

    // Get article content by articleId - Updated to use CSV data
    router.get('/article/:articleId', verifyToken, async (req, res) => {
        logger.info('Article requested', { articleId: req.params.articleId });
        try {
            const articleId = parseInt(req.params.articleId);
            
            // First try to find in database
            let article = await Article.findOne({ articleId: articleId });
            
            // If not found in database, check CSV data
            if (!article) {
                const { getArticleById } = require('../utils/articlesData');
                const csvArticle = getArticleById(articleId);
                if (csvArticle) {
                    // Convert CSV article to database format and optionally save
                    article = {
                        articleId: csvArticle.id,
                        title: csvArticle.title,
                        body: csvArticle.body,
                        topic: csvArticle.topic,
                        strength: csvArticle.strength,
                        stance: csvArticle.stance
                    };
                    
                    // Save to database for future use
                    try {
                        const newArticle = new Article(article);
                        await newArticle.save();
                        logger.info('Saved CSV article to database', { articleId });
                    } catch (saveErr) {
                        logger.warn('Could not save article to database', { articleId, error: saveErr.message });
                    }
                }
            }
            
            // Fallback to sample articles (for testing)
            if (!article) {
                const sampleArticle = sampleArticles.find(a => a.articleId === articleId);
                if (sampleArticle) {
                    article = sampleArticle;
                }
            }
            
            if (article) {
                return res.status(200).json(article);
            } else {
                res.status(404).json({ error: "Article not found" });
            }
            
        } catch (err) {
            logger.error('Error fetching article', { error: err.message });
            res.status(500).json({ error: "Failed to fetch article" });
        }
    });

    // Initialize articles from CSV into database (development helper)
    router.post('/init-csv-articles', async (req, res) => {
        try {
            const { articlesData } = require('../utils/articlesData');
            
            // Check if articles already exist
            const existingCount = await Article.countDocuments();
            if (existingCount > 50) { // Allow some existing articles but not too many
                return res.status(200).json({ message: "Articles already initialized", count: existingCount });
            }
            
            // Clear existing articles first
            await Article.deleteMany({});
            
            // Convert CSV articles to database format
            const articlesToInsert = articlesData.map(article => ({
                articleId: article.id,
                title: article.title,
                body: article.body,
                topic: article.topic,
                strength: article.strength,
                stance: article.stance
            }));
            
            // Insert articles in batches to avoid memory issues
            const batchSize = 50;
            let insertedCount = 0;
            
            for (let i = 0; i < articlesToInsert.length; i += batchSize) {
                const batch = articlesToInsert.slice(i, i + batchSize);
                const inserted = await Article.insertMany(batch);
                insertedCount += inserted.length;
            }
            
            res.status(200).json({ 
                message: "CSV articles initialized successfully", 
                count: insertedCount,
                topics: [...new Set(articlesToInsert.map(a => a.topic))]
            });
            
        } catch (err) {
            logger.error('Error initializing CSV articles', { error: err.message });
            res.status(500).json({ error: "Failed to initialize CSV articles", details: err.message });
        }
    });
    
    // Initialize sample articles in database (development helper - legacy)
    router.post('/init-sample-articles', async (req, res) => {
        try {
            // Check if articles already exist
            const existingCount = await Article.countDocuments();
            if (existingCount > 0) {
                return res.status(200).json({ message: "Articles already initialized", count: existingCount });
            }
            
            // Insert sample articles
            const inserted = await Article.insertMany(sampleArticles);
            res.status(200).json({ message: "Sample articles initialized", count: inserted.length });
            
        } catch (err) {
            logger.error('Error initializing articles', { error: err.message });
            res.status(500).json({ error: "Failed to initialize articles" });
        }
    });

    // Migrate existing posts to populate title and desc fields from articles
    // Note: This is an admin endpoint and doesn't require authentication
    router.post('/migrate-post-titles', async (req, res) => {
        try {
            const { getArticleById } = require('../utils/articlesData');
            
            // Helper function to extract first sentence from article body
            const getFirstSentence = (htmlBody) => {
                if (!htmlBody) return '';
                // Remove HTML tags
                const textOnly = htmlBody.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                // Get first sentence (split by period, exclamation, or question mark)
                const sentences = textOnly.split(/[.!?]+/);
                return sentences[0] ? sentences[0].trim() + '.' : '';
            };

            // Find all posts that have articleId but no title
            const postsToUpdate = await Post.find({ 
                articleId: { $exists: true, $ne: null },
                $or: [
                    { title: { $exists: false } },
                    { title: "" }
                ]
            });

            console.log(`Found ${postsToUpdate.length} posts to migrate`);
            
            let updatedCount = 0;
            let errorCount = 0;

            for (const post of postsToUpdate) {
                try {
                    const article = getArticleById(post.articleId);
                    
                    if (article) {
                        const firstSentence = getFirstSentence(article.body);
                        
                        // Update the post with title and first sentence
                        await Post.updateOne(
                            { _id: post._id },
                            { 
                                $set: {
                                    title: article.title,
                                    desc: firstSentence || post.desc // Keep old desc if we can't extract first sentence
                                }
                            }
                        );
                        updatedCount++;
                        
                        if (updatedCount % 10 === 0) {
                            console.log(`Migrated ${updatedCount} posts...`);
                        }
                    } else {
                        console.log(`Article not found for post ${post._id}, articleId: ${post.articleId}`);
                        errorCount++;
                    }
                } catch (err) {
                    console.error(`Error migrating post ${post._id}:`, err.message);
                    errorCount++;
                }
            }

            res.status(200).json({ 
                message: "Post migration completed",
                totalFound: postsToUpdate.length,
                updated: updatedCount,
                errors: errorCount
            });
            
        } catch (err) {
            logger.error('Error migrating posts', { error: err.message });
            res.status(500).json({ error: "Failed to migrate posts", details: err.message });
        }
    });

    module.exports = router;
}