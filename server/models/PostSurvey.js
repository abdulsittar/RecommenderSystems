const mongoose = require('mongoose');

const PostSurvey = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },

  q1: { type: String, required: false },
  q2: { type: String, required: false },
  q3: { type: String, required: false },
  q4: { type: String, required: false },
  q5: { type: String, required: false },

  q6: { type: String, required: false },
  q6_1: { type: String, required: false },
  q6_2: { type: String, required: false },

  q7_1: { type: String, required: false },
  q7_2: { type: String, required: false },
  q7_3: { type: String, required: false },
  q7_4: { type: String, required: false },
  q7_5: { type: String, required: false },
  q7_6: { type: String, required: false },
  q7_7: { type: String, required: false },

  q8_1: { type: String, required: false },
  q8_2: { type: String, required: false },
  q8_3: { type: String, required: false },
  q8_4: { type: String, required: false },
  q8_5: { type: String, required: false },
  q8_6: { type: String, required: false },
  q8_7: { type: String, required: false },
  q8_8: { type: String, required: false },
  q8_9: { type: String, required: false },
  q8_10: { type: String, required: false },

  q9: { type: String, required: false },
  q10: { type: String, required: false },
  q11: { type: String, required: false },
  q12: { type: String, required: false },
  q13: { type: String, required: false },
  q14: { type: String, required: false },
  q15: { type: String, required: false },
  q16: { type: String, required: false },
  q17: { type: String, required: false },
  q18: { type: String, required: false },
  q19: { type: String, required: false },
  q20: { type: String, required: false },

  q21: { type: String, required: false },   // feedback2
  feedback: { type: String, required: false }, // feedback3

  prolific_code: { type: String, required: false }
},{
  timestamps: true 
});

module.exports = mongoose.model('PostSurvey', PostSurvey);