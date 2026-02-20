const mongoose = require('mongoose');

const DemographicsDataSchema = new mongoose.Schema({
    uniqueId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'IDStorage' 
    },
    // Q1: Demographics
    age: { 
        type: String, 
        required: false
        // Note: Changed from age ranges to year of birth (e.g., '2005', '1990', etc.)
        // No enum constraint to allow any valid year
    },
    gender: { 
        type: String, 
        required: false,
        enum: ['Male', 'Female', 'Prefer not to say', 'Other', '']
    },
    education: { 
        type: String, 
        required: false,
        enum: ['Elementary school', 'High School', 'Bachelor\'s degree', 'Master\'s degree', 'PhD', 'Other', '']
    },
    employment: { 
        type: String, 
        required: false,
        enum: ['Employed full-time', 'Employed part-time', 'Self-employed', 'Unemployed', 'Studying', 'Retired', 'Other', '']
    },
    // Q2: Civil engagement
    hasVoted: { 
        type: String, 
        required: false,
        enum: ['1', '2', '3', '4', '5', '']
    },
    politicalActivities: { 
        type: String, 
        required: false,
        enum: ['1', '2', '3', '4', '5', '']
    },
    politicalMember: { 
        type: String, 
        required: false,
        enum: ['Yes', 'No', '']
    },
    // Q3: News consumption
    newsFrequency: { 
        type: String, 
        required: false,
        enum: ['Several times a day', 'Once a day', 'A few times a week', 'Rarely', 'Never', '']
    },
    newsFrequency2: { 
        type: String, 
        required: false,
        enum: ['Several times a day', 'Once a day', 'A few times a week', 'Rarely', 'Never', '']
    },
    newsSource: { 
        type: [String], 
        required: false,
        default: []
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('DemographicsData', DemographicsDataSchema);