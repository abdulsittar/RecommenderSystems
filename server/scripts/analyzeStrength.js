/**
 * Analyze strength distribution in articles
 */

const { loadArticlesFromCSV } = require('../utils/csvParser');
const { calculatePerspectiveScore } = require('../utils/stanceCalculations');

async function analyzeStrength() {
    const articles = await loadArticlesFromCSV();
    
    const topics = ['abortion', 'gun control'];
    
    for (const topic of topics) {
        const topicArticles = articles.filter(a => a.topic === topic && a.stance && a.stance !== 'null');
        
        console.log(`\n${'='.repeat(80)}`);
        console.log(`TOPIC: ${topic.toUpperCase()}`);
        console.log(`${'='.repeat(80)}`);
        
        // Group by strength value
        const strengthGroups = {};
        topicArticles.forEach(a => {
            const key = a.strength || 'null';
            if (!strengthGroups[key]) strengthGroups[key] = [];
            strengthGroups[key].push(a);
        });
        
        console.log('\nArticles by Strength Value:');
        Object.keys(strengthGroups).sort((a, b) => a - b).forEach(strength => {
            const articles = strengthGroups[strength];
            const score = calculatePerspectiveScore(articles[0].stance, parseInt(strength));
            console.log(`  Strength ${strength}: ${articles.length} articles (perspective score: ±${Math.abs(score).toFixed(2)})`);
        });
        
        // Show perspective score distribution
        const scores = topicArticles.map(a => Math.abs(calculatePerspectiveScore(a.stance, a.strength)));
        const uniqueScores = [...new Set(scores)].sort((a, b) => a - b);
        
        console.log('\nUnique Absolute Perspective Scores:');
        uniqueScores.forEach(score => {
            const count = scores.filter(s => s === score).length;
            console.log(`  ±${score.toFixed(2)}: ${count} articles`);
        });
    }
}

analyzeStrength();
