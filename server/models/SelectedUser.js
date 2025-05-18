const mongoose = require('mongoose');

const SelectedUser = new mongoose.Schema({
username: {
    type: String,
    required: true,
    min: 3,
    max: 20
},
available: {
    type: Boolean,
    default: true,
},
profilePicture: {
    type: String,
    default: '',
},
version: {
    type: String,
    default: "1"
},
password: {
    type: String,
    default: '',
},
},
{timestamps: true}
);

module.exports = mongoose.model('SelectedUser', SelectedUser);

