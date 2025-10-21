// utils/posts.js

const { loadArticlesFromCSV, convertArticlesToPosts } = require('./csvParser');

// ===============================
// 🔹 DYNAMIC DATASET FROM CSV
// ===============================
let postsData = []; // Will be populated from CSV

// Load CSV data on module initialization
const initializePostsData = async () => {
  try {
    const articles = await loadArticlesFromCSV();
    postsData = convertArticlesToPosts(articles);
    console.log(`Initialized ${postsData.length} posts from CSV data`);
  } catch (error) {
    console.error('Failed to initialize posts data from CSV:', error);
    // Fallback to minimal hardcoded data if CSV loading fails
    postsData = [
      { id: 1, articleId: 1, title: "Hospital tells family brain-dead Georgia woman must carry fetus due to abortion ban", topic: "abortion", strength: null, stance: null },
      { id: 8, articleId: 8, title: "Balancing Perspectives on Abortion Rights", topic: "abortion", strength: 1, stance: "Pro-choice" },
      { id: 9, articleId: 9, title: "Medical and Legal Experts Discuss the Complex Landscape of Abortion Access", topic: "abortion", strength: 1, stance: "Pro-choice" },
      { id: 10, articleId: 10, title: "A Balanced View on Abortion: Respecting Personal Choice", topic: "abortion", strength: 1, stance: "Pro-choice" },
      { id: 11, articleId: 11, title: "Navigating the Complexities of Abortion Legislation", topic: "abortion", strength: 1, stance: "Pro-choice" }
    ];
    console.log('Using fallback hardcoded posts data');
  }
};

// Initialize data immediately
initializePostsData();

// ===============================
// 🔹 DYNAMIC TOPIC-BASED WEB LINKS
// ===============================
// Generate web links dynamically based on available articles
const getWebLinksForTopic = (topic) => {
  const { getArticlesByTopic } = require('./articlesData');
  const articles = getArticlesByTopic(topic);
  
  // Create links to our dynamic article routes
  return articles.slice(0, 15).map(article => 
    `https://socialapp2.ijs.si/news/article/${article.id}`
  );
};

// Pre-generate common topic links for performance
const webLinks = {
  "abortion": [],
  "gun control": [],
  "assisted death": []
};

// Initialize web links
const initializeWebLinks = () => {
  try {
    Object.keys(webLinks).forEach(topic => {
      webLinks[topic] = getWebLinksForTopic(topic);
    });
  } catch (error) {
    console.error('Failed to initialize web links:', error);
    // Fallback to basic structure if initialization fails
    webLinks["abortion"] = ["https://socialapp2.ijs.si/news/abortion_1"];
    webLinks["gun control"] = ["https://socialapp2.ijs.si/news/gun-control_1"];
    webLinks["assisted death"] = ["https://socialapp2.ijs.si/news/assisted-death_1"];
  }
};

// Initialize links after a short delay to ensure articles are loaded
setTimeout(initializeWebLinks, 1000);

// ===============================
// 🔹 HELPER FUNCTIONS
// ===============================

// Get random sample of N posts
function getRandomSample(array, n) {
  return array.sort(() => 0.5 - Math.random()).slice(0, n);
}

// Get 5 initial posts by topic
function getInitialPostsByTopic(topic) {
  let filtered = postsData.filter(
    (p) => p.topic.toLowerCase() === topic.toLowerCase()
  );
  
  // If no posts found for topic (e.g., "other"), fall back to random mix from all topics
  if (filtered.length === 0) {
    console.log(`No posts found for topic "${topic}", using mixed content`);
    filtered = getRandomSample(postsData, 5); // Get random mix
  }
  
  // Ensure all posts have articleId (fallback to id if not set)
  const withArticleIds = filtered.map(post => ({
    ...post,
    articleId: post.articleId || post.id
  }));
  return getRandomSample(withArticleIds, 5);
}

// Get posts by topic and page (deterministic pagination)
function getPostsByTopicAndPage(topic, page = 0, pageSize = 5) {
  const filtered = postsData
    .filter((p) => p.topic.toLowerCase() === topic.toLowerCase())
    // stable deterministic order so pagination is predictable
    .sort((a, b) => (a.id || 0) - (b.id || 0));

  const pageNum = Math.max(0, Number(page) || 0);
  const size = Math.max(1, Number(pageSize) || 5);
  const start = pageNum * size;
  return filtered.slice(start, start + size);
}

// Get posts by topic and strength level
function getPostsByTopicAndStrength(topic, strength) {
  return postsData.filter(
    (p) =>
      p.topic.toLowerCase() === topic.toLowerCase() &&
      Number(p.strength) === Number(strength)
  );
}

// Get web links for a topic
function getWebLinksByTopic(topic) {
  return webLinks[topic.toLowerCase()] || [];
}

module.exports = {
  postsData,
  getInitialPostsByTopic,
  getPostsByTopicAndStrength,
  getWebLinksByTopic,
  getPostsByTopicAndPage
};
