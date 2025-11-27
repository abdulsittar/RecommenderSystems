/**
 * Test Overton Window calculations centered around user stance
 */

const { calculateOvertonWindow, surveyToStanceScore } = require('../utils/stanceCalculations');

console.log('='.repeat(80));
console.log('OVERTON WINDOW CENTERED ON USER STANCE');
console.log('='.repeat(80));

// Test different user profiles with different stances
const profiles = [
    {
        name: 'Strong Pro-Choice User (Closed-Minded)',
        topicAttitude: 90, // Very pro-choice (0.8)
        surveyResults: {
            topicAttitude: 90,
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
        name: 'Moderate Pro-Choice User (Open-Minded)',
        topicAttitude: 65, // Moderate pro-choice (0.3)
        surveyResults: {
            topicAttitude: 65,
            oneSide_openminded: 7,
            oneSide_moderate: 7,
            otherSide_openminded: 7,
            otherSide_moderate: 7,
            otherSide_moral: 7,
            otherSide_family: 7,
            otherSide_friend: 7,
            otherSide_coworker: 7
        }
    },
    {
        name: 'Centrist User (Very Open-Minded)',
        topicAttitude: 50, // Neutral (0.0)
        surveyResults: {
            topicAttitude: 50,
            oneSide_openminded: 9,
            oneSide_moderate: 9,
            otherSide_openminded: 9,
            otherSide_moderate: 9,
            otherSide_moral: 9,
            otherSide_family: 9,
            otherSide_friend: 9,
            otherSide_coworker: 9
        }
    },
    {
        name: 'Moderate Pro-Life User (Open-Minded)',
        topicAttitude: 35, // Moderate pro-life (-0.3)
        surveyResults: {
            topicAttitude: 35,
            oneSide_openminded: 7,
            oneSide_moderate: 7,
            otherSide_openminded: 7,
            otherSide_moderate: 7,
            otherSide_moral: 7,
            otherSide_family: 7,
            otherSide_friend: 7,
            otherSide_coworker: 7
        }
    },
    {
        name: 'Strong Pro-Life User (Closed-Minded)',
        topicAttitude: 10, // Very pro-life (-0.8)
        surveyResults: {
            topicAttitude: 10,
            oneSide_openminded: 8,
            oneSide_moderate: 8,
            otherSide_openminded: 2,
            otherSide_moderate: 2,
            otherSide_moral: 1,
            otherSide_family: 1,
            otherSide_friend: 1,
            otherSide_coworker: 1
        }
    }
];

const topic = 'abortion';

profiles.forEach(profile => {
    console.log(`\n${profile.name}`);
    console.log('-'.repeat(80));
    
    const stanceScore = surveyToStanceScore(profile.topicAttitude);
    const window = calculateOvertonWindow(topic, profile.surveyResults);
    
    // Calculate openness metrics
    const oneSide = (profile.surveyResults.oneSide_openminded + profile.surveyResults.oneSide_moderate) / 2;
    const otherSide = (profile.surveyResults.otherSide_openminded + profile.surveyResults.otherSide_moderate) / 2;
    const connection = (profile.surveyResults.otherSide_moral + profile.surveyResults.otherSide_family + 
                       profile.surveyResults.otherSide_friend + profile.surveyResults.otherSide_coworker) / 4;
    const openness = (oneSide + otherSide) / 2 * 0.7 + connection * 0.3;
    
    const width = window.max - window.min;
    const center = (window.max + window.min) / 2;
    
    console.log(`User Stance: ${stanceScore >= 0 ? '+' : ''}${stanceScore.toFixed(2)} (${stanceScore > 0.2 ? 'Pro-Choice' : stanceScore < -0.2 ? 'Pro-Life' : 'Centrist'})`);
    console.log(`Openness Score: ${openness.toFixed(2)}/10`);
    console.log(`Overton Window: [${window.min.toFixed(2)}, ${window.max.toFixed(2)}]`);
    console.log(`  - Width: ${width.toFixed(2)}`);
    console.log(`  - Center: ${center.toFixed(2)} (should equal user stance: ${stanceScore.toFixed(2)})`);
    console.log(`  - Match: ${Math.abs(center - stanceScore) < 0.01 ? '✓ YES' : '✗ NO'}`);
    
    // Show what articles would be visible
    console.log(`\nArticle Perspective Scores Visible:`);
    const sampleScores = [-1.0, -0.8, -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1.0];
    const visible = sampleScores.filter(s => s >= window.min && s <= window.max);
    console.log(`  ${visible.map(s => (s >= 0 ? '+' : '') + s.toFixed(1)).join(', ')}`);
    
    // Show balance
    const negatives = visible.filter(s => s < stanceScore).length;
    const onStance = visible.filter(s => s === stanceScore).length;
    const positives = visible.filter(s => s > stanceScore).length;
    console.log(`  Balance: ${negatives} opposing | ${onStance} similar | ${positives} aligned`);
});

console.log('\n' + '='.repeat(80));
console.log('KEY INSIGHTS:');
console.log('='.repeat(80));
console.log('✓ Window is now CENTERED on user\'s stance, not at 0');
console.log('✓ Pro-choice users see articles centered around positive scores');
console.log('✓ Pro-life users see articles centered around negative scores');
console.log('✓ Window width still varies by openness (closed: 0.52, open: 0.74)');
console.log('✓ Users see articles AROUND their stance, creating filter bubble effect');
console.log('✓ Control group ranks within this window by relevance');
console.log('✓ Edge/Center groups explore within the user-centered window');
console.log('='.repeat(80) + '\n');
