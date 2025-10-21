// articlesData.js - Complete articles dataset loaded from CSV
const { loadArticlesFromCSV } = require('./csvParser');

let articlesData = []; // Will be populated from CSV

// Load CSV data on module initialization
const initializeArticlesData = async () => {
  try {
    articlesData = await loadArticlesFromCSV();
    console.log(`Initialized ${articlesData.length} articles from CSV data`);
  } catch (error) {
    console.error('Failed to initialize articles data from CSV:', error);
    // Fallback to empty array if CSV loading fails
    articlesData = [];
  }
};

// Initialize data immediately
initializeArticlesData();

/**
 * Get article by ID
 * @param {number} articleId - Article ID to find
 * @returns {Object|null} Article object or null if not found
 */
function getArticleById(articleId) {
  return articlesData.find(article => article.id === parseInt(articleId)) || null;
}

/**
 * Get articles by topic
 * @param {string} topic - Topic to filter by
 * @returns {Array} Array of articles for the topic
 */
function getArticlesByTopic(topic) {
  return articlesData.filter(article => 
    article.topic && article.topic.toLowerCase() === topic.toLowerCase()
  );
}

/**
 * Get random articles by topic
 * @param {string} topic - Topic to filter by
 * @param {number} count - Number of articles to return
 * @returns {Array} Random sample of articles
 */
function getRandomArticlesByTopic(topic, count = 5) {
  const topicArticles = getArticlesByTopic(topic);
  const shuffled = [...topicArticles].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Get all available topics
 * @returns {Array} Array of unique topics
 */
function getAvailableTopics() {
  const topics = [...new Set(articlesData.map(article => article.topic).filter(Boolean))];
  return topics;
}

/**
 * Search articles by title or content
 * @param {string} query - Search query
 * @returns {Array} Array of matching articles
 */
function searchArticles(query) {
  const lowerQuery = query.toLowerCase();
  return articlesData.filter(article => 
    article.title.toLowerCase().includes(lowerQuery) ||
    article.body.toLowerCase().includes(lowerQuery)
  );
}

module.exports = {
  articlesData,
  getArticleById,
  getArticlesByTopic,
  getRandomArticlesByTopic,
  getAvailableTopics,
  searchArticles,
  initializeArticlesData
};