const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
username: {
    type: String,
    required: true,
    min: 3,
    max: 20
},
username_second: {
    type: String, 
    required: true,
    min: 3,
    max: 20
},
email: {
    type: String,
    max: 50,
    uniquie: true
},
password: {
    type: String,
    required: true,
    min: 6
},
profilePicture: {
    type: String,
    default: '',
},
coverPicture: {
    type: String,
    default: '',
},
followers: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
    }],
followings: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
    }],
viewedPosts:[{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Viewpost'
    }],
readSpecialPosts:[{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'specialpost'
}],    
readPosts: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Readpost'
}],
activity: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'TimeMe'
}],
uniqueId:{
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'IDStorage'
},
isAdmin: {
    type: Boolean,
    default: false,
},
pool: {
    type: String,
    default: ""
},
feedValue: {
    type: String,
    default: "0"
},
desc: {
    type: String,
    max: 50,
},
city: {
    type: String,
    max: 50,
},
from: {
    type: String,
    max: 50,
},
relationship: {
    type: String,
    max: 20,
},
},
{timestamps: true}
);

module.exports = mongoose.model('User', UserSchema);

