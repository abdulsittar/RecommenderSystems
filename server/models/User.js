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
sessionReadPosts: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post'
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
lastLoginDate: {
    type: Date,
},
loginCount: {
    type: Number,
    default: 0
},
currentTopic: {
    type: String,
    default: null
},
lastTopicChangeDate: {
    type: Date,
    default: null
},
controlGroup: {
    type: String,
    enum: ['control', 'edge', 'center', null],
    default: null
},
stanceScore: {
    type: Number,
    min: -1,
    max: 1,
    default: 0
},
overtonWindow: {
    min: { type: Number, default: -0.5 },
    max: { type: Number, default: 0.5 }
},
latestSurveyResults: {
    topicAttitude: { type: Number, default: 50 },
    oneSide_openminded: { type: Number, default: 5 },
    oneSide_moderate: { type: Number, default: 5 },
    oneSide_moral: { type: Number, default: 5 },
    oneSide_family: { type: Number, default: 5 },
    oneSide_friend: { type: Number, default: 5 },
    oneSide_coworker: { type: Number, default: 5 },
    otherSide_openminded: { type: Number, default: 5 },
    otherSide_moderate: { type: Number, default: 5 },
    otherSide_moral: { type: Number, default: 5 },
    otherSide_family: { type: Number, default: 5 },
    otherSide_friend: { type: Number, default: 5 },
    otherSide_coworker: { type: Number, default: 5 }
},
controlGroupAssignedAt: {
    type: Date,
    default: null
}
},
{timestamps: true}
);

module.exports = mongoose.model('User', UserSchema);

