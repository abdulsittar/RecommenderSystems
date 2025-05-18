const mongoose = require('mongoose');

const IDStorage = new mongoose.Schema({
yourID: {type: String, required: true},
},
{timestamps: true}
);

module.exports = mongoose.model('IDStorage', IDStorage);

