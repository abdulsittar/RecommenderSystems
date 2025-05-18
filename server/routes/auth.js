const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();
const IDStorage = require('../models/IDStorage');
const SelectedUser = require('../models/SelectedUser');
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
    const inputPassword = req.body.password.trim()
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
router.post('/login', async (req, res) => {
try {
    logger.info('Data received', { data: req.body });
    const user = await User.findOne({username: req.body.username});
    if (!user) {
        res.status(404).json("user not found");
        return
    }

     console.log(req.body.password);
    console.log(user.password);
    const inputPassword = req.body.password.trim()
    
    const validPassword = await bcrypt.compare(inputPassword, user.password);
    if (!validPassword){
            res.status(404).json("wrong password");
        return
    }

    const token = jwt.sign({ _id: user._id }, `${process.env.JWT_SECRET}`);

    const usr = {"user": user, "token": token}

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

module.exports = router;