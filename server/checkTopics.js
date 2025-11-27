const {loadArticlesFromCSV} = require('./utils/csvParser');

loadArticlesFromCSV().then(articles => {
    const topics = {};
    articles.forEach(a => {
        if (!topics[a.topic]) {
            topics[a.topic] = {total: 0, withBoth: 0, noData: 0, samples: []};
        }
        topics[a.topic].total++;
        if (a.stance && a.strength) topics[a.topic].withBoth++;
        if (!a.stance && !a.strength) topics[a.topic].noData++;
        
        if (topics[a.topic].samples.length < 3) {
            topics[a.topic].samples.push({id: a.id, stance: a.stance, strength: a.strength});
        }
    });
    
    console.log('\nTopic Distribution:\n');
    Object.keys(topics).sort().forEach(topic => {
        const t = topics[topic];
        console.log(`${topic}:`);
        console.log(`  Total: ${t.total}`);
        console.log(`  With stance AND strength: ${t.withBoth}`);
        console.log(`  Missing data: ${t.noData}`);
        console.log(`  Samples:`);
        t.samples.forEach(s => {
            console.log(`    ID ${s.id}: stance='${s.stance}', strength=${s.strength}`);
        });
        console.log('');
    });
});
