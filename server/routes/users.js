const User = require('../models/User');
const PostLike = require('../models/PostLike');
const PostDislike = require('../models/PostDislike');
//const Readpost = require('../models/Readpost');

const Post = require('../models/Post');
const CommentLike = require('../models/CommentLike');
const Comment = require('../models/Comment');
const router = require('express').Router();
const mongoose = require('mongoose');
const IDStorage = require('../models/IDStorage');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require("fs");
const Viewpost = require('../models/Viewpost');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
var uniqueId = uuidv4();
const { Readable } = require('stream');
const TimeMe = require('../models/TimeMe');
const logger = require('../logs/logger');

const verifyToken = require('../middleware/verifyToken');

const uuid = require('uuid');
const userIdentifiers = uuid.v4();

const conn = mongoose.createConnection('mongodb+srv://abdulsittar72:2106010991As@cluster0.gsnbbwq.mongodb.net/test?retryWrites=true&w=majority');
const { ObjectId } = require('mongoose').Types;

let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});


// update user
router.put("/:id", verifyToken, async (req, res) => {
    logger.info('Data received', { data: req.body });
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                logger.error('Error saving data', { error: err.message });
                return res.status(500).json(err);
            }
        }

        try {
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
            res.status(200).json('Account has been updated')
        } catch (err) {
            logger.error('Error saving data', { error: err.message });
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json('You can update only your account!')
    }
})

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Remove the user APIs
 * /:id:
 *   delete:
 *     summary: Remove the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user was deleted
 *       404:
 *         description: The user was not found
 */

// delete user
router.delete("/:id", verifyToken, async (req, res) => {
    logger.info('Data received', { data: req.body });
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json('Account has been deleted successfully')
        } catch (err) {
            logger.error('Error saving data', { error: err.message });
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json('You can delete only your account!')
    }
})

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Fetch a user APIs
 * /:
 *   get:
 *     summary: Fetch a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: The username
 *     responses:
 *       200:
 *         description: Here is the user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
// get a user
router.get('/', verifyToken, async (req, res) => {
    logger.info('Data received', { data: req.body });
    const userId = req.query.userId;
    const username = req.query.username;

    try {
        const user = userId
            ? await User.findById(userId)
            : await User.findOne({ username: username });
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    } catch (err) {
        logger.error('Error saving data', { error: err.message });
        res.status(500).json(err);
    }
})

// get a user
router.post('/getUser/:uniqId', verifyToken, async (req, res) => {
    logger.info('Data received', { data: req.body });
    try {
        const idstor = await IDStorage.find({ "yourID": req.params.uniqId });
        const fid = idstor[0]
        const userExist = await User.find({ "uniqueId": fid["_id"] });

        if (userExist.length > 0) {
            const usr = { "data": true, "login": true, "user": userExist[0] }
            res.status(200).json(usr);
        } else {
            res.status(500).json(err);
        }
        return

    } catch (err) {
        logger.error('Error saving data', { error: err.message });
        console.log(err)
        res.status(500).json(err);
    }
})

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Follow a user APIs
 * /:id/follow:
 *   put:
 *     summary: Follow a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The current user id!
 *       - in: path
 *         name: id2
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the user who is going to be followed!
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Here is the user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */

// follow a user
router.put('/:id/follow', verifyToken, async (req, res) => {
    logger.info('Data received', { data: req.body });
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).json('user has been followed');
            } else {
                res.status(403).json('You already follow this user');
            }
        } catch (err) {
            logger.error('Error saving data', { error: err.message });
            res.status(500).json(err)
        }
    } else {
        res.status(403).json('You can\'t follow yourself');
    }
})

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Unfollow a user API
 * /:id/unfollow:
 *   put:
 *     summary: Unfollow a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The current user id!
 *       - in: path
 *         name: id2
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the user who is going to be unfollowed!
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Here is the user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */

// unfollow a user
router.put('/:id/unfollow', verifyToken, async (req, res) => {
    logger.info('Data received', { data: req.body });
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                res.status(200).json('user has been unfollowed');
            } else {
                res.status(403).json('You dont follow this user');
            }
        } catch (err) {
            logger.error('Error saving data', { error: err.message });
            res.status(500).json(err)
        }
    } else {
        res.status(403).json('You can\'t unfollow yourself');
    }
})

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Get all users API
 * /usersList2:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */

// all users
router.get('/usersList2', verifyToken, function (req, res) {
    logger.info('Data received', { data: req.body });
    User.find({}, function (err, users) {
        var userMap = {};

        users.forEach(function (user) {
            userMap[user._id] = user;
        });

        res.send(userMap);
    });
});

// all users
router.get('/usersList/:userId', verifyToken, async (req, res) => {
    logger.info('Data received', { data: req.body });
    try {
        let friendList = [];
        User.find({}, function (err, users) {
            //console.log(users.length)
            users.map((friend) => {
                const { _id, username, profilePicture } = friend;
                friendList.push({ _id, username, profilePicture });
            });
            //res.send(userMap);
            res.status(200).json(friendList)
        });
    }
    catch (err) {
        logger.error('Error saving data', { error: err.message });
        //console.log(err)
        res.status(500).json(err);
    }
});

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Get all the followings API
 * /followings/:userId:
 *   get:
 *     summary: Get all the followings
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */

//get friends
router.get("/followings/:userId", verifyToken, async (req, res) => {
    logger.info('Data received', { data: req.body });
    try {
        const user = await User.findById(req.params.userId).populate({ path: "followings", model: "User" }).exec();
        //const friends = await Promise.all(
        //user.followings.map((friendId) => {
        // return User.findById(friendId);
        //})
        //);
        // friendList = [];
        //friends.map((friend) => {
        // const { _id, username, profilePicture } = friend;
        //friendList.push({ _id, username, profilePicture });
        //});
        res.status(200).json(user.followings)
    } catch (err) {
        logger.error('Error saving data', { error: err.message });
        res.status(500).json(err);
    }
});

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Get all the followers API
 * /followers/:userId:
 *   get:
 *     summary: Get all the followers
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */

//get friends
router.get("/followers/:userId", verifyToken, async (req, res) => {
    logger.info('Data received', { data: req.body });
    try {
        const user = await User.findById(req.params.userId).populate({ path: "followers", model: "User" }).exec();
        res.status(200).json(user.followers)
    } catch (err) {
        logger.error('Error saving data', { error: err.message });
        res.status(500).json(err);
    }
});

router.get("/allUsers/:userId", verifyToken, async (req, res) => {
    logger.info('Data received', { data: req.body });
    try {
        const users = await User.find({ _id: { $ne: req.params._id } }).populate({ path: "followers", model: "User" }).exec();
        res.status(200).json(users);
    } catch (err) {
        logger.error('Error saving data', { error: err.message });
        res.status(500).json(err);
    }
});

// Viewed a post
// like a post
router.put('/:id/viewed', verifyToken, async (req, res) => {
    logger.info('Data received', { data: req.body });
    try {
        // Like a post
        const user = await User.findById(req.params.id);
        const viewedPosts = req.body.postId;
        for (let i = 0; i < viewedPosts.length; i++) {
            const post = viewedPosts[i];

            if (!user.viewedPosts.includes(post)) {
                await user.updateOne({ $push: { viewedPosts: req.body.postId } });
                res.status(200).json('The post has been viewed!');
            }

        }
    } catch (err) {
        logger.error('Error saving data', { error: err.message });
        res.status(500).json(err);
    }
})

// TimeMe
router.put('/:id/activity', verifyToken, async (req, res) => {
    logger.info('Data received', { data: req.body });

    try {
        const timeMe = new TimeMe({ userId: req.params.id, page: req.body.page, seconds: req.body.seconds });
        timeMe.save(async (err, block) => {
            const user = await User.findById(req.params.id);
            await user.updateOne({ $push: { activity: timeMe } });
            res.status(200).json('The time has been saved!');

        });
        // Like a post

    } catch (err) {
        logger.error('Error saving data', { error: err.message });
        console.log(err);
        res.status(500).json(err);
    }
});

// TimeMe
router.get('/:id/getTimeSpent', verifyToken, async (req, res) => {
    logger.info('Data received', { data: req.body });

    try {
        console.log("here");
        const today = new Date();
        //today.setHours(0, 0, 0, 0); 

        const One_before = new Date();
        //One_before.setDate(today.getDate() - 1);
        One_before.setHours(0, 0, 0, 0);

        const Two_before = new Date();
        Two_before.setDate(One_before.getDate() - 1);
        Two_before.setHours(0, 0, 0, 0);

        const Three_before = new Date();
        Three_before.setDate(Two_before.getDate() - 1);
        Three_before.setHours(0, 0, 0, 0);

        const Four_before = new Date();
        Four_before.setDate(Three_before.getDate() - 1);
        Four_before.setHours(0, 0, 0, 0);

        const Ffth_before = new Date();
        Ffth_before.setDate(Four_before.getDate() - 1);
        Ffth_before.setHours(0, 0, 0, 0);

        const userId = req.params.id;
        const today_Times = await TimeMe.find({ "userId": mongoose.Types.ObjectId(userId), "createdAt": { "$lt": today, "$gte": One_before } });

        console.log(userId);
        console.log(today);
        console.log(One_before);
        console.log(Two_before);
        console.log(Three_before);
        console.log(Four_before);
        console.log(Ffth_before);
        //console.log(today_Times);

        const One_before_Times = await TimeMe.find({ "userId": userId, "createdAt": { "$lt": One_before, "$gte": Two_before } });
        const Two_before_Times = await TimeMe.find({ "userId": userId, "createdAt": { "$lt": Two_before, "$gte": Three_before } });
        const Three_before_Times = await TimeMe.find({ "userId": userId, "createdAt": { "$lt": Three_before, "$gte": Four_before } });
        const Four_before_Times = await TimeMe.find({ "userId": userId, "createdAt": { "$lt": Four_before, "$gte": Ffth_before } });

        var sum_today = 0
        var One_before_today = 0
        var Two_before_today = 0
        var Three_before_today = 0
        var Four_before_today = 0
        if (today_Times !== null && today_Times !== undefined) {
            for (let i = 0; i < today_Times.length; i++) {
                tim = today_Times[i]
                const parsedNumber = parseInt(tim["seconds"], 10);
                //console.log(typeof parsedNumber);
                //console.log(sum_today);
                //console.log(parseInt(sum_today, 10) + parsedNumber)
                sum_today = parseInt(sum_today, 10) + parsedNumber;

            }
        }
        if (One_before_Times !== null && One_before_Times !== undefined) {
            for (let i = 0; i < One_before_Times.length; i++) {
                tim = One_before_Times[i]
                One_before_today = One_before_today + parseInt(tim["seconds"], 10);

            }
        }
        if (Two_before_Times !== null && Two_before_Times !== undefined) {
            for (let i = 0; i < Two_before_Times.length; i++) {
                tim = Two_before_Times[i]
                Two_before_today = Two_before_today + parseInt(tim["seconds"], 10);

            }
        }

        if (Three_before_Times !== null && Three_before_Times !== undefined) {
            for (let i = 0; i < Three_before_Times.length; i++) {
                tim = Three_before_Times[i]
                Three_before_today = Three_before_today + parseInt(tim["seconds"], 10);

            }
        }

        if (Four_before_Times !== null && Four_before_Times !== undefined) {
            for (let i = 0; i < Four_before_Times.length; i++) {
                tim = Four_before_Times[i]
                Four_before_today = Four_before_today + parseInt(tim["seconds"], 10);

            }
        }

        const randomNumber = Math.floor(Math.random() * 10);
        console.log("Number", randomNumber)
        if (randomNumber < 5) {
            const response = { "not": "no", "today": sum_today / 60, "oneDayBefore": One_before_today / 60, "twoDayBefore": Two_before_today / 60, "threeDayBefore": Three_before_today / 60, "fourDayBefore": Four_before_today / 60 }
            res.status(200).json(response);

        } else {
            const response = { "not": "yes", "today": sum_today / 60, "oneDayBefore": One_before_today / 60, "twoDayBefore": Two_before_today / 60, "threeDayBefore": Three_before_today / 60, "fourDayBefore": Four_before_today / 60 }
            res.status(200).json(response);

        }
    } catch (err) {
        logger.error('Error saving data', { error: err.message });
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/:id/getUserActionsRefresh', verifyToken, async (req, res) => {
    logger.info('Data received', { data: req.body });
    try {
        const userId = req.params.id;
        console.log(userId);

        const maxTreatmentPost = await Post
            .findOne({ "reactorUser": userId })
            .sort({ treatment: -1 })
            .exec();

        console.log(maxTreatmentPost);

        if (!maxTreatmentPost) {
            return res.status(404).json({ message: "No posts found for this user." });
        }

        const maxTreatment = maxTreatmentPost.treatment;
        console.log(maxTreatment);



        const postsWithMaxTreatment = await Post.find({
            "reactorUser": userId,
            treatment: maxTreatment
        }).select('_id');

        const postIds = postsWithMaxTreatment.map(post => post._id);
        console.log(postIds);

        const [
            commentCount,
            likeCount,
            dislikeCount,
            readCount
        ] = await Promise.all([
            Comment.countDocuments({ postId: { $in: postIds } }),
            PostLike.countDocuments({ postId: { $in: postIds } }),
            PostDislike.countDocuments({ postId: { $in: postIds } }),
            Viewpost.countDocuments({ postId: { $in: postIds } }),
        ]);

        console.log("Total Comments");
        console.log(commentCount);
        console.log(likeCount);
        console.log(dislikeCount);
        console.log(readCount);

        if (commentCount > 0 || likeCount > 0 || dislikeCount > 0) {

            if (readCount > 0 && maxTreatment == 2) {
                const response = { "showAlert": "final", "commentcount": String(commentCount), "postLikeCount": String(likeCount) }
                res.status(200).json(response);

            }

            if (readCount > 0) {
                const response = { "showAlert": "third", "commentcount": String(commentCount), "postLikeCount": String(likeCount) }
                res.status(200).json(response);

            } else {
                const response = { "showAlert": "fifth" }
                res.status(200).json(response);

            }

        } else {
            const response = { "showAlert": "fifth" }
            res.status(200).json(response);

        }

    } catch (err) {
        logger.error('Error saving data', { error: err.message });
        console.log(err);
        res.status(500).json(err);
    }
});

// My Actions
router.get('/:id/getUserActions', verifyToken, async (req, res) => {
    logger.info('Data received', { data: req.body });
    try {
        const userId = req.params.id;
        console.log(userId);

        const maxTreatmentPost = await Post
            .findOne({ "reactorUser": userId })
            .sort({ treatment: -1 })
            .exec();

        console.log(maxTreatmentPost);

        if (!maxTreatmentPost) {
            return res.status(404).json({ message: "No posts found for this user." });
        }

        const maxTreatment = maxTreatmentPost.treatment;
        console.log(maxTreatment);
        const postsWithMaxTreatment = await Post.find({
            "reactorUser": userId,
            treatment: maxTreatment
        }).select('_id');

        const postIds = postsWithMaxTreatment.map(post => post._id);
        console.log(postIds);

        const [
            commentCount,
            likeCount,
            dislikeCount,
            readCount
        ] = await Promise.all([
            Comment.countDocuments({ postId: { $in: postIds } }),
            PostLike.countDocuments({ postId: { $in: postIds } }),
            PostDislike.countDocuments({ postId: { $in: postIds } }),
            Viewpost.countDocuments({ postId: { $in: postIds } }),
        ]);

        console.log("Total Comments");
        console.log(commentCount);
        console.log(likeCount);
        console.log(dislikeCount);
        console.log(readCount);

        if (commentCount > 0 || likeCount > 0 || dislikeCount > 0) {

            if (readCount > 0 && maxTreatment == 2) {
                const response = { "showAlert": "third", "commentcount": String(commentCount), "postLikeCount": String(likeCount) }
                res.status(200).json(response);

            }

            if (readCount > 0) {
                const response = { "showAlert": "fifth" }
                res.status(200).json(response);

            }

        } else {
            const response = { "showAlert": "fifth" }
            res.status(200).json(response);

        }

    } catch (err) {
        logger.error('Error saving data', { error: err.message });
        console.log(err);
        res.status(500).json(err);
    }
});
// Read a post
// like a post
router.put('/:id/read', verifyToken, async (req, res) => {
    logger.info('Data received', { data: req.body });

    try {
        const user = await User.findById(req.params.id);
        const isAlreadyThere = await Readpost.findById(req.body.postId);
        var isAlreadyRead = false;

        if (isAlreadyThere) {
            if (isAlreadyThere.length > 0) {
                isAlreadyRead = true
            }
        }

        if (isAlreadyRead == false) {
            const postRead = new Readpost({ userId: req.params.id, postId: req.body.postId });
            await postRead.save();
            console.log(postRead);
            console.log("postRead is added");
        }

        if (!user.readPosts.includes(req.body.postId)) {
            await user.updateOne({ $push: { readPosts: req.body.postId } });
            res.status(200).json('The post has been read!');
        }

    } catch (err) {
        logger.error('Error saving data', { error: err.message });
        console.log(err);
        res.status(500).json(err);
    }
})

module.exports = router;