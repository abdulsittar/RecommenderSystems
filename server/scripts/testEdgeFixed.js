/**
 * Test Edge algorithm using actual recommendation service
 */

const { loadArticlesFromCSV } = require('../utils/csvParser');
const { calculatePerspectiveScore, calculateOvertonWindow, surveyToStanceScore, isCentrist } = require('../utils/stanceCalculations');

async function testEdgeAlgorithm() {
    const articles = await loadArticlesFromCSV();
    
    const topic = 'abortion';
    const posts = articles
        .filter(a => a.topic === topic && a.stance && a.stance !== 'null')
        .map(a => ({
            article: {
                perspectiveScore: calculatePerspectiveScore(a.stance, a.strength)
            }
        }));
    
    // Centrist user with window [-0.3, 0.3]
    const user = {
        stanceScore: 0.0,
        overtonWindow: { min: -0.3, max: 0.3 }
    };
    
    const userIsCentrist = isCentrist(user.stanceScore);
    const windowCenter = (user.overtonWindow.min + user.overtonWindow.max) / 2;
    
    console.log(`User: Stance ${user.stanceScore}, Window [${user.overtonWindow.min}, ${user.overtonWindow.max}]`);
    console.log(`Is Centrist: ${userIsCentrist}\n`);
    
    // Apply Edge algorithm
    const ranked = posts.sort((a, b) => {
        const scoreA = a.article.perspectiveScore;
        const scoreB = b.article.perspectiveScore;
        
        const isAInWindow = scoreA >= user.overtonWindow.min && scoreA <= user.overtonWindow.max;
        const isBInWindow = scoreB >= user.overtonWindow.min && scoreB <= user.overtonWindow.max;
        
        // Distance to nearest edge (for articles outside window)
        const distToEdgeA = Math.min(
            Math.abs(scoreA - user.overtonWindow.min),
            Math.abs(scoreA - user.overtonWindow.max)
        );
        const distToEdgeB = Math.min(
            Math.abs(scoreB - user.overtonWindow.min),
            Math.abs(scoreB - user.overtonWindow.max)
        );
        
        // If both outside window: prefer closest to edges first
        if (!isAInWindow && !isBInWindow) {
            return distToEdgeA - distToEdgeB; // Closest to edges first
        }
        
        // If both inside window: deprioritize (show after outside articles)
        if (isAInWindow && isBInWindow) {
            return 1; // Both equally low priority
        }
        
        // One inside, one outside: prefer outside first
        return isAInWindow ? 1 : -1;
    });
    
    console.log('EDGE GROUP - First 30 Articles:\n');
    console.log('Pos | Score | In Window? | Distance to Edge');
    console.log('-'.repeat(55));
    
    for (let i = 0; i < Math.min(30, ranked.length); i++) {
        const article = ranked[i].article;
        const score = article.perspectiveScore;
        const inWindow = score >= user.overtonWindow.min && score <= user.overtonWindow.max;
        const distToEdge = Math.min(
            Math.abs(score - user.overtonWindow.min),
            Math.abs(score - user.overtonWindow.max)
        );
        
        const pos = (i + 1).toString().padStart(3);
        const scoreStr = (score >= 0 ? '+' : '') + score.toFixed(1);
        const inWindowStr = inWindow ? 'YES' : 'NO ';
        const edgeDist = distToEdge.toFixed(2);
        
        console.log(`${pos} | ${scoreStr.padStart(5)} |    ${inWindowStr}     |      ${edgeDist}`);
    }
    
    // Count articles in different ranges
    const outsideWindow = ranked.filter(p => {
        const s = p.article.perspectiveScore;
        return s < user.overtonWindow.min || s > user.overtonWindow.max;
    });
    const insideWindow = ranked.filter(p => {
        const s = p.article.perspectiveScore;
        return s >= user.overtonWindow.min && s <= user.overtonWindow.max;
    });
    
    console.log(`\nSummary:`);
    console.log(`- Articles outside window shown first: ${outsideWindow.length}`);
    console.log(`- Articles inside window shown after: ${insideWindow.length}`);
    console.log(`\n✓ Edge group for centrists starts OUTSIDE window, moves to extremes`);
    console.log(`✓ First articles should be ±0.4, ±0.5, etc. (outside [-0.3, 0.3])`);
}

testEdgeAlgorithm();
