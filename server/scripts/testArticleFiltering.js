/**
 * Show exactly which articles are visible within different Overton windows
 */

const { loadArticlesFromCSV } = require('../utils/csvParser');
const { calculatePerspectiveScore, calculateOvertonWindow, surveyToStanceScore } = require('../utils/stanceCalculations');

async function testArticleFiltering() {
    const articles = await loadArticlesFromCSV();
    
    const topic = 'abortion';  // Test with abortion
    const topicArticles = articles
        .filter(a => a.topic === topic && a.stance && a.stance !== 'null')
        .map(a => ({
            id: a.id,
            stance: a.stance,
            strength: a.strength,
            perspectiveScore: calculatePerspectiveScore(a.stance, a.strength)
        }));
    
    console.log(`\nTotal ${topic} articles with valid data: ${topicArticles.length}`);
    
    // Test profiles
    const profiles = [
        {
            name: 'Closed-Minded Pro-Choice User',
            topicAttitude: 85,  // Strong pro-choice (0.7)
            surveyResults: {
                oneSide_openminded: 8, oneSide_moderate: 8,
                otherSide_openminded: 2, otherSide_moderate: 2,
                otherSide_moral: 1, otherSide_family: 1,
                otherSide_friend: 1, otherSide_coworker: 1
            }
        },
        {
            name: 'Moderate Centrist User',
            topicAttitude: 50,  // Neutral (0.0)
            surveyResults: {
                oneSide_openminded: 5, oneSide_moderate: 5,
                otherSide_openminded: 5, otherSide_moderate: 5,
                otherSide_moral: 5, otherSide_family: 5,
                otherSide_friend: 5, otherSide_coworker: 5
            }
        },
        {
            name: 'Open-Minded Pro-Life User',
            topicAttitude: 15,  // Strong pro-life (-0.7)
            surveyResults: {
                oneSide_openminded: 9, oneSide_moderate: 9,
                otherSide_openminded: 9, otherSide_moderate: 9,
                otherSide_moral: 9, otherSide_family: 9,
                otherSide_friend: 9, otherSide_coworker: 9
            }
        }
    ];
    
    profiles.forEach(profile => {
        const stanceScore = surveyToStanceScore(profile.topicAttitude);
        const window = calculateOvertonWindow(topic, profile.surveyResults);
        
        // Filter articles by window
        const visible = topicArticles.filter(a => 
            a.perspectiveScore >= window.min && a.perspectiveScore <= window.max
        );
        
        // Count by stance
        const proPro = visible.filter(a => a.perspectiveScore > 0).length;
        const neutral = visible.filter(a => a.perspectiveScore === 0).length;
        const proLife = visible.filter(a => a.perspectiveScore < 0).length;
        
        console.log(`\n${'='.repeat(80)}`);
        console.log(profile.name);
        console.log(`${'='.repeat(80)}`);
        console.log(`User Stance: ${stanceScore >= 0 ? '+' : ''}${stanceScore.toFixed(2)} (${stanceScore > 0.2 ? 'Pro-Choice' : stanceScore < -0.2 ? 'Pro-Life' : 'Centrist'})`);
        console.log(`Overton Window: [${window.min.toFixed(2)}, ${window.max.toFixed(2)}] (width: ${(window.max - window.min).toFixed(2)})`);
        console.log(`\nArticles Visible: ${visible.length}/${topicArticles.length} (${(visible.length/topicArticles.length*100).toFixed(1)}%)`);
        console.log(`  - Pro-Choice articles: ${proPro}`);
        console.log(`  - Neutral articles: ${neutral}`);
        console.log(`  - Pro-Life articles: ${proLife}`);
        
        // Show distribution of visible articles by perspective score
        const scoreDistribution = {};
        visible.forEach(a => {
            const score = a.perspectiveScore.toFixed(1);
            scoreDistribution[score] = (scoreDistribution[score] || 0) + 1;
        });
        
        console.log(`\nVisible Articles by Perspective Score:`);
        Object.keys(scoreDistribution)
            .map(k => parseFloat(k))
            .sort((a, b) => a - b)
            .forEach(score => {
                const count = scoreDistribution[score.toFixed(1)];
                const bar = '█'.repeat(Math.ceil(count / 2));
                console.log(`  ${score >= 0 ? '+' : ''}${score.toFixed(1)}: ${count.toString().padStart(2)} ${bar}`);
            });
        
        // Show which would be recommended by each algorithm
        console.log(`\nRecommendation Strategies:`);
        
        // Control: rank by closeness to user stance
        const control = [...visible].sort((a, b) => {
            const distA = Math.abs(a.perspectiveScore - stanceScore);
            const distB = Math.abs(b.perspectiveScore - stanceScore);
            return distA - distB;
        });
        console.log(`  Control Group (closest to stance): Top 5 scores = ${control.slice(0, 5).map(a => a.perspectiveScore.toFixed(1)).join(', ')}`);
        
        // Edge: show extremes
        const center = (window.min + window.max) / 2;
        const edge = [...visible].sort((a, b) => {
            const distA = Math.abs(a.perspectiveScore - center);
            const distB = Math.abs(b.perspectiveScore - center);
            return distB - distA;  // Furthest from center = edges
        });
        console.log(`  Edge Group (extremes): Top 5 scores = ${edge.slice(0, 5).map(a => a.perspectiveScore.toFixed(1)).join(', ')}`);
        
        // Center: expand from center
        const centerAlg = [...visible].sort((a, b) => {
            const distA = Math.abs(a.perspectiveScore - center);
            const distB = Math.abs(b.perspectiveScore - center);
            return distA - distB;  // Closest to center first
        });
        console.log(`  Center Group (from middle): Top 5 scores = ${centerAlg.slice(0, 5).map(a => a.perspectiveScore.toFixed(1)).join(', ')}`);
    });
    
    console.log(`\n${'='.repeat(80)}\n`);
}

testArticleFiltering();
