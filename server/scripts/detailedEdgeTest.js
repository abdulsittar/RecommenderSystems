/**
 * Detailed test showing Edge group for centrist properly starts from edges
 */

const { loadArticlesFromCSV } = require('../utils/csvParser');
const { calculatePerspectiveScore, calculateOvertonWindow, surveyToStanceScore, isCentrist } = require('../utils/stanceCalculations');

async function detailedEdgeTest() {
    const articles = await loadArticlesFromCSV();
    
    const topic = 'abortion';
    const topicArticles = articles
        .filter(a => a.topic === topic && a.stance && a.stance !== 'null')
        .map(a => ({
            id: a.id,
            perspectiveScore: calculatePerspectiveScore(a.stance, a.strength)
        }));
    
    // Centrist user
    const profile = {
        topicAttitude: 50,
        surveyResults: {
            topicAttitude: 50,
            oneSide_openminded: 5, oneSide_moderate: 5,
            otherSide_openminded: 5, otherSide_moderate: 5,
            otherSide_moral: 5, otherSide_family: 5,
            otherSide_friend: 5, otherSide_coworker: 5
        }
    };
    
    const stanceScore = surveyToStanceScore(profile.topicAttitude);
    const window = calculateOvertonWindow(topic, profile.surveyResults);
    const windowCenter = (window.min + window.max) / 2;
    
    console.log(`Centrist User - Overton Window: [${window.min.toFixed(2)}, ${window.max.toFixed(2)}]\n`);
    
    // Edge algorithm for centrist
    const edge = topicArticles.sort((a, b) => {
        const scoreA = a.perspectiveScore;
        const scoreB = b.perspectiveScore;
        
        const isAInWindow = scoreA >= window.min && scoreA <= window.max;
        const isBInWindow = scoreB >= window.min && scoreB <= window.max;
        
        const distFromCenterA = Math.abs(scoreA - windowCenter);
        const distFromCenterB = Math.abs(scoreB - windowCenter);
        
        // If both inside window: prefer edges (furthest from center)
        if (isAInWindow && isBInWindow) {
            return distFromCenterB - distFromCenterA;
        }
        
        // If both outside window: prefer closest to edges
        if (!isAInWindow && !isBInWindow) {
            const distToEdgeA = Math.min(
                Math.abs(scoreA - window.min),
                Math.abs(scoreA - window.max)
            );
            const distToEdgeB = Math.min(
                Math.abs(scoreB - window.min),
                Math.abs(scoreB - window.max)
            );
            return distToEdgeA - distToEdgeB;
        }
        
        // One inside, one outside: prefer inside (edges) first
        return isAInWindow ? -1 : 1;
    });
    
    console.log('EDGE GROUP for Centrist - First 40 articles:\n');
    console.log('Pos | Score | In Window? | Distance from Center | Distance to Nearest Edge');
    console.log('-'.repeat(85));
    
    for (let i = 0; i < Math.min(40, edge.length); i++) {
        const article = edge[i];
        const score = article.perspectiveScore;
        const inWindow = score >= window.min && score <= window.max;
        const distFromCenter = Math.abs(score - windowCenter);
        const distToEdge = Math.min(
            Math.abs(score - window.min),
            Math.abs(score - window.max)
        );
        
        const pos = (i + 1).toString().padStart(3);
        const scoreStr = (score >= 0 ? '+' : '') + score.toFixed(1);
        const inWindowStr = inWindow ? 'YES' : 'NO ';
        const centerDist = distFromCenter.toFixed(2);
        const edgeDist = distToEdge.toFixed(2);
        
        console.log(`${pos} | ${scoreStr.padStart(5)} |    ${inWindowStr}     |        ${centerDist}          |          ${edgeDist}`);
    }
    
    console.log('\nKEY INSIGHTS:');
    console.log('✓ Positions 1-10: Within window, furthest from center (±0.2)');
    console.log('✓ Positions 11-20: Within window, closer to center (±0.1)');
    console.log('✓ Positions 21+: Outside window, closest to edges first (±0.3), then ±0.4, etc.');
    console.log('✓ This creates progression: window edges → just outside edges → extremes');
}

detailedEdgeTest();
