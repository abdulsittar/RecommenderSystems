const mongoose = require('mongoose');

const ConsentResponseSchema = new mongoose.Schema({
    uniqueId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'IDStorage' 
    },
    consentAnswers: {
        type: [Boolean],
        required: true,
        // PILOT STUDY: Validate for 1 consent question
        validate: {
            validator: function(v) {
                return v.length === 1; // We have 1 consent question for pilot
            },
            message: 'consentAnswers must contain exactly 1 boolean value'
        }
        // MAIN STUDY: Uncomment below for 8 consent questions
        /*
        validate: {
            validator: function(v) {
                return v.length === 8; // We have 8 consent questions
            },
            message: 'consentAnswers must contain exactly 8 boolean values'
        }
        */
    },
    agreedToParticipate: {
        type: Boolean,
        required: true,
        default: function() {
            return this.consentAnswers && this.consentAnswers.every(answer => answer === true);
        }
    },
    consentDate: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ConsentResponse', ConsentResponseSchema);