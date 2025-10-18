const mongoose = require('mongoose');

const IDStorage = new mongoose.Schema({
yourID: {type: String, required: true},
available: {type: Boolean, default: true},
version: {type: Number, default: 1},  // Added version field
defaultPassword: {type: String}  // First 10 chars of yourID as default password
},
{timestamps: true}
);

module.exports = mongoose.model('IDStorage', IDStorage, 'idstorages');

