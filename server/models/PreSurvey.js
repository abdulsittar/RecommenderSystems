const mongoose = require('mongoose');

const PreSurvey = new mongoose.Schema({
  uniqueId:{  type: mongoose.Schema.Types.ObjectId, required: true, ref: 'IDStorage'},
    q1: { type: String, required: false,},
    q2: { type: String, required: false,},
    q3: { type: String, required: false,},
    q4: { type: String, required: false,},
    q5: { type: String, required: false,},
    q6: { type: String, required: false,},
    q7: { type: String, required: false,},
    q8: { type: String, required: false,},
    q9: { type: String, required: false,},
    q10: { type: String, required: false,},
    prolific_Code: { type: String, required: true,},
    feedback: { type: String, required: false,},
},{
  timestamps: true 
});

module.exports = mongoose.model('PreSurvey', PreSurvey);