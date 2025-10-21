// Dynamic articles data loaded from CSV
const { loadArticlesFromCSV } = require('./csvParser');

let sampleArticles = []; // Will be populated from CSV

// Load CSV data on module initialization
const initializeSampleArticles = async () => {
  try {
    const articles = await loadArticlesFromCSV();
    sampleArticles = articles.map(article => ({
      articleId: article.id,
      title: article.title,
      body: article.body,
      topic: article.topic,
      strength: article.strength,
      stance: article.stance
    }));
    console.log(`Initialized ${sampleArticles.length} sample articles from CSV data`);
  } catch (error) {
    console.error('Failed to initialize sample articles from CSV:', error);
    // Fallback to minimal hardcoded data if CSV loading fails
    sampleArticles = [
      {
        articleId: 1,
        title: "Hospital tells family brain-dead Georgia woman must carry fetus due to abortion ban",
        body: "<p>Sample article content...</p>",
        topic: "abortion",
        strength: null,
        stance: null
      }
    ];
    console.log('Using fallback hardcoded sample articles');
  }
};

// Initialize data immediately
initializeSampleArticles();

module.exports = { sampleArticles };