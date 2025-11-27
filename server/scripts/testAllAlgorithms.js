/**
 * Test all three recommendation algorithms with the new specifications
 */

const { loadArticlesFromCSV } = require('../utils/csvParser');
const { calculatePerspectiveScore, calculateOvertonWindow, surveyToStanceScore, isCentrist } = require('../utils/stanceCalculations');

async function testRecommendationAlgorithms() {
    const articles = await loadArticlesFromCSV();
    
    const topic = 'abortion';
    const topicArticles = articles
        .filter(a => a.topic === topic && a.stance && a.stance !== 'null')
        .map(a => ({
            id: a.id,
            stance: a.stance,
            strength: a.strength,
            perspectiveScore: calculatePerspectiveScore(a.stance, a.strength)
        }))
        .sort((a, b) => a.perspectiveScore - b.perspectiveScore); // Sort for easier visualization
    
    console.log(`Total ${topic} articles: ${topicArticles.length}\n`);
    
    // Test profiles
    const profiles = [
        {
            name: 'Centrist User',
            topicAttitude: 50,  // Neutral (0.0)
            surveyResults: {
                topicAttitude: 50,
                oneSide_openminded: 5, oneSide_moderate: 5,
                otherSide_openminded: 5, otherSide_moderate: 5,
                otherSide_moral: 5, otherSide_family: 5,
                otherSide_friend: 5, otherSide_coworker: 5
            }
        },
        {
            name: 'Strong Pro-Choice User (Extremist)',
            topicAttitude: 85,  // Pro-choice (0.7)
            surveyResults: {
                topicAttitude: 85,
                oneSide_openminded: 5, oneSide_moderate: 5,
                otherSide_openminded: 5, otherSide_moderate: 5,
                otherSide_moral: 4, otherSide_family: 4,
                otherSide_friend: 4, otherSide_coworker: 4
            }
        }
    ];
    
    profiles.forEach(profile => {
        const stanceScore = surveyToStanceScore(profile.topicAttitude);
        const window = calculateOvertonWindow(topic, profile.surveyResults);
        const userIsCentrist = isCentrist(stanceScore);
        const windowCenter = (window.min + window.max) / 2;
        
        console.log(`${'='.repeat(80)}`);
        console.log(profile.name.toUpperCase());
        console.log(`${'='.repeat(80)}`);
        console.log(`User Stance: ${stanceScore >= 0 ? '+' : ''}${stanceScore.toFixed(2)} (${userIsCentrist ? 'CENTRIST' : 'EXTREMIST'})`);
        console.log(`Overton Window: [${window.min.toFixed(2)}, ${window.max.toFixed(2)}] (center: ${windowCenter.toFixed(2)})`);
        
        const withinWindow = topicArticles.filter(a => 
            a.perspectiveScore >= window.min && a.perspectiveScore <= window.max
        );
        const outsideWindow = topicArticles.filter(a => 
            a.perspectiveScore < window.min || a.perspectiveScore > window.max
        );
        
        console.log(`Articles within window: ${withinWindow.length}`);
        console.log(`Articles outside window: ${outsideWindow.length}`);
        
        // CONTROL GROUP
        console.log(`\n--- CONTROL GROUP (Within Window, Relevance-Based) ---`);
        const control = [...withinWindow].sort((a, b) => {
            const distA = Math.abs(a.perspectiveScore - stanceScore);
            const distB = Math.abs(b.perspectiveScore - stanceScore);
            return distA - distB;
        });
        console.log(`Top 10: ${control.slice(0, 10).map(a => (a.perspectiveScore >= 0 ? '+' : '') + a.perspectiveScore.toFixed(1)).join(', ')}`);
        console.log(`Strategy: Shows ${control.length} articles within window, ranked by closeness to user stance`);
        
        // EDGE GROUP
        console.log(`\n--- EDGE GROUP (Start from Edges) ---`);
        let edge;
        if (userIsCentrist) {
            // Centrists: from both edges of window, then outward to extremes
            edge = topicArticles.sort((a, b) => {
                const distToEdgeA = Math.min(
                    Math.abs(a.perspectiveScore - window.min),
                    Math.abs(a.perspectiveScore - window.max)
                );
                const distToEdgeB = Math.min(
                    Math.abs(b.perspectiveScore - window.min),
                    Math.abs(b.perspectiveScore - window.max)
                );
                return distToEdgeA - distToEdgeB;
            });
            console.log(`Top 10: ${edge.slice(0, 10).map(a => (a.perspectiveScore >= 0 ? '+' : '') + a.perspectiveScore.toFixed(1)).join(', ')}`);
            console.log(`Strategy: Starts at window edges [${window.min.toFixed(2)}, ${window.max.toFixed(2)}], then moves to extremes`);
        } else {
            // Extremists: from opposite edge of window, moving away
            const oppositeEdge = stanceScore > 0 ? window.min : window.max;
            edge = topicArticles.sort((a, b) => {
                const distA = Math.abs(a.perspectiveScore - oppositeEdge);
                const distB = Math.abs(b.perspectiveScore - oppositeEdge);
                return distA - distB;
            });
            console.log(`Top 10: ${edge.slice(0, 10).map(a => (a.perspectiveScore >= 0 ? '+' : '') + a.perspectiveScore.toFixed(1)).join(', ')}`);
            console.log(`Strategy: Starts at opposite edge (${oppositeEdge.toFixed(2)}), moves away from user towards opposite extreme`);
        }
        
        // CENTER GROUP
        console.log(`\n--- CENTER GROUP (Start from Center, Expand Everywhere) ---`);
        const center = topicArticles.sort((a, b) => {
            const distA = Math.abs(a.perspectiveScore - windowCenter);
            const distB = Math.abs(b.perspectiveScore - windowCenter);
            return distA - distB;
        });
        console.log(`Top 10: ${center.slice(0, 10).map(a => (a.perspectiveScore >= 0 ? '+' : '') + a.perspectiveScore.toFixed(1)).join(', ')}`);
        console.log(`Strategy: Starts at window center (${windowCenter.toFixed(2)}), expands outward to all articles`);
        
        // Show first 20 for each algorithm with markers
        console.log(`\n--- FIRST 20 ARTICLES COMPARISON ---`);
        console.log(`Position | Control (${control.length} total) | Edge (${edge.length} total) | Center (${center.length} total)`);
        console.log('-'.repeat(80));
        for (let i = 0; i < 20; i++) {
            const pos = (i + 1).toString().padStart(2);
            const c = control[i] ? ((control[i].perspectiveScore >= 0 ? '+' : '') + control[i].perspectiveScore.toFixed(1)).padStart(5) : '  -  ';
            const e = edge[i] ? ((edge[i].perspectiveScore >= 0 ? '+' : '') + edge[i].perspectiveScore.toFixed(1)).padStart(5) : '  -  ';
            const ce = center[i] ? ((center[i].perspectiveScore >= 0 ? '+' : '') + center[i].perspectiveScore.toFixed(1)).padStart(5) : '  -  ';
            
            // Mark if outside window
            const cMark = control[i] && (control[i].perspectiveScore < window.min || control[i].perspectiveScore > window.max) ? '*' : ' ';
            const eMark = edge[i] && (edge[i].perspectiveScore < window.min || edge[i].perspectiveScore > window.max) ? '*' : ' ';
            const ceMark = center[i] && (center[i].perspectiveScore < window.min || center[i].perspectiveScore > window.max) ? '*' : ' ';
            
            console.log(`   ${pos}    |    ${c}${cMark}    |    ${e}${eMark}    |    ${ce}${ceMark}`);
        }
        console.log(`         (* = outside window)`);
        
        console.log('\n');
    });
    
    console.log(`${'='.repeat(80)}`);
    console.log('ALGORITHM SUMMARY');
    console.log(`${'='.repeat(80)}`);
    console.log('CONTROL GROUP:');
    console.log('  - Only shows articles within Overton window');
    console.log('  - Ranks by relevance (closest to user stance)');
    console.log('  - Reinforces user views\n');
    console.log('EDGE GROUP:');
    console.log('  - Centrists: Start from both window edges, expand to extremes (±1.0)');
    console.log('  - Extremists: Start from opposite edge, move away from user');
    console.log('  - Shows challenging content first\n');
    console.log('CENTER GROUP:');
    console.log('  - Start from center of window, expand outward');
    console.log('  - Shows within-window articles first, then beyond');
    console.log('  - Gradual exposure to diverse content');
    console.log(`${'='.repeat(80)}\n`);
}

testRecommendationAlgorithms();
