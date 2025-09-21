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
        required: false,
        enum: ['18–24', '25–34', '35–44', '45–54', '55–64', '65+', '']
    },
    gender: { 
        type: String, 
        required: false,
        enum: ['Male', 'Female', 'Non-binary', 'Prefer not to say', '']
    },
    education: { 
        type: String, 
        required: false,
        enum: ['No formal education', 'High school diploma', 'Some college', 'Bachelor\'s degree', 'Master\'s degree', 'Doctorate', 'Other', '']
    },
    employment: { 
        type: String, 
        required: false,
        enum: ['Employed full-time', 'Employed part-time', 'Self-employed', 'Unemployed', 'Student', 'Retired', 'Other', '']
    },
    // Q2: Civil engagement
    hasVoted: { 
        type: String, 
        required: false,
        enum: ['Yes', 'No', '']
    },
    politicalActivities: { 
        type: String, 
        required: false,
        enum: ['Yes', 'No', '']
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
    newsSource: { 
        type: String, 
        required: false,
        enum: ['Television', 'Newspapers', 'Online news websites', 'Social media', 'Radio', 'Other', '']
    },
    newsTime: { 
        type: String, 
        required: false,
        enum: ['Less than 30 minutes', '30–60 minutes', '1–2 hours', 'More than 2 hours', '']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('DemographicsData', DemographicsDataSchema);