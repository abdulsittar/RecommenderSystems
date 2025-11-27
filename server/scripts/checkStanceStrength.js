/**
 * Quick script to check stance and strength values
 */

const { loadArticlesFromCSV } = require('../utils/csvParser');
const { calculatePerspectiveScore } = require('../utils/stanceCalculations');

async function checkData() {
    const articles = await loadArticlesFromCSV();
    
    console.log('\n=== ABORTION ARTICLES (first 10) ===\n');
    articles.filter(a => a.topic === 'abortion').slice(0, 10).forEach(a => {
        const score = calculatePerspectiveScore(a.stance, a.strength);
        console.log(`ID ${a.id}: stance="${a.stance}" strength=${a.strength} -> perspectiveScore=${score.toFixed(3)}`);
    });
    
    console.log('\n=== GUN CONTROL ARTICLES (first 10) ===\n');
    articles.filter(a => a.topic === 'gun control').slice(0, 10).forEach(a => {
        const score = calculatePerspectiveScore(a.stance, a.strength);
        console.log(`ID ${a.id}: stance="${a.stance}" strength=${a.strength} -> perspectiveScore=${score.toFixed(3)}`);
    });
}

checkData();
