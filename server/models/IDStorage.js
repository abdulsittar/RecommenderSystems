const mongoose = require('mongoose');

const IDStorage = new mongoose.Schema({
yourID: {type: String, required: true},
available: {type: Boolean, default: true},
version: {type: Number, default: 1}  // Added version field
},
{timestamps: true}
);

module.exports = mongoose.model('IDStorage', IDStorage, 'idstorages');

