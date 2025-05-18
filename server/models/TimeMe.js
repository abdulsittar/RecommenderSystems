const mongoose = require('mongoose');

const TimeMeSchema = new mongoose.Schema({
userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
page: {
        type: String,
        required: false,
      },
seconds: {
        type: String,
        timestamps: true
    }},
{timestamps: true}
);

module.exports = mongoose.model('TimeMe', TimeMeSchema);

