/**
 * Test Overton Window calculations with various user profiles
 */

const { calculateOvertonWindow, surveyToStanceScore } = require('../utils/stanceCalculations');

console.log('='.repeat(80));
console.log('OVERTON WINDOW ANALYSIS');
console.log('='.repeat(80));

// Test different user profiles
const profiles = [
    {
        name: 'Very Closed-Minded User',
        topicAttitude: 75, // Pro-stance (0.5)
        surveyResults: {
            oneSide_openminded: 8,
            oneSide_moderate: 8,
            otherSide_openminded: 2,
            otherSide_moderate: 2,
            otherSide_moral: 1,
            otherSide_family: 1,
            otherSide_friend: 1,
            otherSide_coworker: 1
        }
    },
    {
        name: 'Moderate User',
        topicAttitude: 50, // Neutral (0.0)
        surveyResults: {
            oneSide_openminded: 5,
            oneSide_moderate: 5,
            otherSide_openminded: 5,
            otherSide_moderate: 5,
            otherSide_moral: 5,
            otherSide_family: 5,
            otherSide_friend: 5,
            otherSide_coworker: 5
        }
    },
    {
        name: 'Very Open-Minded User',
        topicAttitude: 25, // Con-stance (-0.5)
        surveyResults: {
            oneSide_openminded: 9,
            oneSide_moderate: 9,
            otherSide_openminded: 9,
            otherSide_moderate: 9,
            otherSide_moral: 9,
            otherSide_family: 9,
            otherSide_friend: 9,
            otherSide_coworker: 9
        }
    }
];

const topics = ['abortion', 'gun control', 'assisted death'];

profiles.forEach(profile => {
    console.log(`\n${profile.name}`);
    console.log('-'.repeat(80));
    
    const stanceScore = surveyToStanceScore(profile.topicAttitude);
    console.log(`Stance Score: ${stanceScore.toFixed(2)} (topicAttitude: ${profile.topicAttitude})`);
    
    // Calculate openness metrics
    const oneSide = (profile.surveyResults.oneSide_openminded + profile.surveyResults.oneSide_moderate) / 2;
    const otherSide = (profile.surveyResults.otherSide_openminded + profile.surveyResults.otherSide_moderate) / 2;
    const connection = (profile.surveyResults.otherSide_moral + profile.surveyResults.otherSide_family + 
                       profile.surveyResults.otherSide_friend + profile.surveyResults.otherSide_coworker) / 4;
    const openness = (oneSide + otherSide) / 2 * 0.7 + connection * 0.3;
    
    console.log(`Openness Score: ${openness.toFixed(2)}/10`);
    console.log(`  - Own side perception: ${oneSide.toFixed(1)}/10`);
    console.log(`  - Other side perception: ${otherSide.toFixed(1)}/10`);
    console.log(`  - Connection to other side: ${connection.toFixed(1)}/10`);
    
    console.log('\nOverton Windows by Topic:');
    topics.forEach(topic => {
        const window = calculateOvertonWindow(topic, profile.surveyResults);
        const width = window.max - window.min;
        const center = (window.max + window.min) / 2;
        
        console.log(`  ${topic.padEnd(15)}: [${window.min.toFixed(2)}, ${window.max.toFixed(2)}]  (width: ${width.toFixed(2)}, center: ${center.toFixed(2)})`);
        
        // Show which articles would be visible
        if (topic === 'abortion') {
            const visible = {
                extreme_con: window.min <= -1.0 && window.max >= -1.0,
                strong_con: window.min <= -0.5 && window.max >= -0.5,
                moderate_con: window.min <= -0.2 && window.max >= -0.2,
                neutral: window.min <= 0 && window.max >= 0,
                moderate_pro: window.min <= 0.2 && window.max >= 0.2,
                strong_pro: window.min <= 0.5 && window.max >= 0.5,
                extreme_pro: window.min <= 1.0 && window.max >= 1.0
            };
            
            const visibleRanges = [];
            if (visible.extreme_con) visibleRanges.push('extreme con (-1.0)');
            if (visible.strong_con) visibleRanges.push('strong con (-0.5)');
            if (visible.moderate_con) visibleRanges.push('moderate con (-0.2)');
            if (visible.neutral) visibleRanges.push('neutral (0)');
            if (visible.moderate_pro) visibleRanges.push('moderate pro (+0.2)');
            if (visible.strong_pro) visibleRanges.push('strong pro (+0.5)');
            if (visible.extreme_pro) visibleRanges.push('extreme pro (+1.0)');
            
            console.log(`                    Articles visible: ${visibleRanges.join(', ')}`);
        }
    });
});

console.log('\n' + '='.repeat(80));
console.log('KEY INSIGHTS:');
console.log('='.repeat(80));
console.log('1. Base window width is now 0.6 (±0.3) - much tighter than before');
console.log('2. Closed-minded users get narrower windows (0.36 width)');
console.log('3. Open-minded users get wider windows (0.78 width)');
console.log('4. Windows are centered at 0, not at user\'s stance');
console.log('5. This creates meaningful filtering - users won\'t see ALL articles');
console.log('6. Control group will rank within window by relevance to user stance');
console.log('7. Edge/Center groups will explore within the filtered window');
console.log('='.repeat(80) + '\n');
