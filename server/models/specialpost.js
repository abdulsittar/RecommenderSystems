const { Decimal128, Double } = require('mongodb');
const mongoose = require('mongoose');

const SpecialPostScheme = new mongoose.Schema({
desc: {
    type: String,
    required: true,
    max: 500
},
img:{
    type: String
},
no: {
    type: Number,
    default: "0"
},
version: {
    type: Number,
    default: "0"
},
 },
{timestamps: true}
);

module.exports = mongoose.model('specialpost', SpecialPostScheme);

