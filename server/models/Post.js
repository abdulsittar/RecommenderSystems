const { Decimal128, Double } = require('mongodb');
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
userId: {
    type: String,
    required: true
},
reactorUser: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
    },
thumb:{
    type: String
},
desc: {
    type: String,
    required: true,
    max: 500
},
img:{
    type: String
},
reposts: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Repost'
  }],
pool: {
    type: String,
    default: ""
},
treatment: {
    type: String,
    default: ""
},
userGroup: {
    type: String,
    default: ""
},
content: {
    type: String,
    default: ""
},
webLinks: {
    type: String,
    default: ""
},
rank: {
    type: Number,
    default: 1000.0
},
weight: {
    type: Number,
    default: 0.0
},
ukraine: {
    type: Number,
    default: 0.0
},
disinfo: {
    type: Number,
    default: 0.0
},
likes: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'PostLike'
  }],
dislikes: [{
  type: mongoose.Schema.Types.ObjectId, 
  ref: 'PostDislike'
}],
comments:[{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment'
}],
postedBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }},
{timestamps: true}
);

module.exports = mongoose.model('Post', PostSchema);

