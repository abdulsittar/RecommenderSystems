const IDStorage = require('../models/IDStorage');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const logger = require('../logs/logger');

const verifyToken = require('../middleware/verifyToken');

router.post('/getKey/:uniqueId',  verifyToken,  async (req, res) => {
    logger.info('Data received', { data: req.body });
    try {
    const idstor = await IDStorage.find({"_id": req.params.uniqueId});
    console.log(idstor)
        const fid = idstor[0]
        console.log("Key")
        console.log(fid)
        res.status(200).json({"key":fid.yourID});
        return

    } catch(err) {
        logger.error('Error saving data', { error: err.message });
        console.log(err)
        res.status(500).json(err);
    }
    })

    module.exports = router;