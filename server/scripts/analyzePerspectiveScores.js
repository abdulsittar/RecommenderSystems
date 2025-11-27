/**
 * Script to analyze perspective score distribution across articles
 * Run with: node server/scripts/analyzePerspectiveScores.js
 */

const { loadArticlesFromCSV } = require('../utils/csvParser');
const { calculatePerspectiveScore } = require('../utils/stanceCalculations');

async function analyzePerspectiveScores() {
    try {
        console.log('Loading articles from CSV...\n');
        const articles = await loadArticlesFromCSV();
        
        console.log(`Total articles: ${articles.length}\n`);
        
        // Group by topic
        const byTopic = {};
        
        articles.forEach(article => {
            const topic = article.topic || 'unknown';
            if (!byTopic[topic]) {
                byTopic[topic] = [];
            }
            
            const perspectiveScore = calculatePerspectiveScore(article.stance, article.strength);
            byTopic[topic].push({
                id: article.id,
                title: article.title.substring(0, 60),
                stance: article.stance,
                strength: article.strength,
                perspectiveScore: perspectiveScore
            });
        });
        
        // Analyze each topic
        for (const [topic, articles] of Object.entries(byTopic)) {
            console.log(`\n${'='.repeat(80)}`);
            console.log(`TOPIC: ${topic.toUpperCase()}`);
            console.log(`${'='.repeat(80)}`);
            console.log(`Total articles: ${articles.length}`);
            
            // Filter out articles with null perspective scores
            const validArticles = articles.filter(a => 
                a.perspectiveScore !== 0 || (a.stance && a.strength !== null && a.strength !== undefined)
            );
            
            if (validArticles.length === 0) {
                console.log('No articles with valid perspective scores!\n');
                continue;
            }
            
            const scores = validArticles.map(a => a.perspectiveScore);
            const min = Math.min(...scores);
            const max = Math.max(...scores);
            const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            
            console.log(`\nPerspective Score Range:`);
            console.log(`  Min: ${min.toFixed(3)}`);
            console.log(`  Max: ${max.toFixed(3)}`);
            console.log(`  Avg: ${avg.toFixed(3)}`);
            console.log(`  Range: ${(max - min).toFixed(3)}`);
            
            // Distribution analysis
            const negative = validArticles.filter(a => a.perspectiveScore < -0.2).length;
            const centrist = validArticles.filter(a => a.perspectiveScore >= -0.2 && a.perspectiveScore <= 0.2).length;
            const positive = validArticles.filter(a => a.perspectiveScore > 0.2).length;
            
            console.log(`\nDistribution:`);
            console.log(`  Negative (<-0.2): ${negative} articles (${(negative/validArticles.length*100).toFixed(1)}%)`);
            console.log(`  Centrist (-0.2 to 0.2): ${centrist} articles (${(centrist/validArticles.length*100).toFixed(1)}%)`);
            console.log(`  Positive (>0.2): ${positive} articles (${(positive/validArticles.length*100).toFixed(1)}%)`);
            
            // Show sample articles from each range
            console.log(`\nSample Articles:`);
            
            const negSample = validArticles.filter(a => a.perspectiveScore < 0).slice(0, 3);
            if (negSample.length > 0) {
                console.log(`\n  Negative Stance Articles:`);
                negSample.forEach(a => {
                    console.log(`    Score ${a.perspectiveScore.toFixed(2)}: ${a.stance} (${a.strength}) - ${a.title}`);
                });
            }
            
            const posSample = validArticles.filter(a => a.perspectiveScore > 0).slice(0, 3);
            if (posSample.length > 0) {
                console.log(`\n  Positive Stance Articles:`);
                posSample.forEach(a => {
                    console.log(`    Score ${a.perspectiveScore.toFixed(2)}: ${a.stance} (${a.strength}) - ${a.title}`);
                });
            }
        }
        
        console.log(`\n${'='.repeat(80)}\n`);
        
    } catch (error) {
        console.error('Error analyzing perspective scores:', error);
    }
}

// Run analysis
analyzePerspectiveScores();
