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
        validate: {
            validator: function(v) {
                return v.length === 6; // We have 6 consent questions
            },
            message: 'consentAnswers must contain exactly 6 boolean values'
        }
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