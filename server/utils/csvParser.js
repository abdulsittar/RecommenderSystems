const fs = require('fs');
const path = require('path');

// CSV file path - updated to point to the new articles file with semicolon delimiter
const CSV_FILE_PATH = path.join(__dirname, '../../articles.csv');

/**
 * Parse CSV content into JavaScript objects
 * @param {string} csvContent - Raw CSV content
 * @returns {Array} Array of article objects
 */
function parseCSV(csvContent) {
    const rows = parseCSVRows(csvContent);
    if (rows.length === 0) return [];
    
    // Parse header
    const headers = rows[0];
    const articles = [];
    
    // Parse data rows
    for (let i = 1; i < rows.length; i++) {
        const values = rows[i];
        // Skip completely empty rows
        if (values.length === 0 || values.every(v => !v || v.trim() === '')) {
            continue;
        }
        
        // Must have at least an ID to be valid
        if (!values[0] || !parseInt(values[0])) {
            console.warn(`Skipping row ${i}: missing or invalid ID`);
            continue;
        }
        
        const article = {};
        headers.forEach((header, index) => {
            let value = values[index] || '';
            
            // Handle special conversions
            if (header === 'id') {
                value = parseInt(value) || 0;
            } else if (header === 'strength') {
                value = value && value !== 'NULL' ? parseInt(value) : null;
            } else if (header === 'stance') {
                value = value && value !== 'NULL' ? value : null;
            }
            
            article[header] = value;
        });
        
        // Map id to articleId for consistency with existing schema
        if (article.id) {
            article.articleId = article.id;
        }
        
        articles.push(article);
    }
    
    return articles;
}

/**
 * Parse CSV content with proper handling of multi-line quoted fields
 * @param {string} csvContent - Raw CSV content
 * @returns {Array} Array of parsed rows
 */
function parseCSVRows(csvContent) {
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let inQuotes = false;
    let i = 0;
    
    while (i < csvContent.length) {
        const char = csvContent[i];
        const nextChar = csvContent[i + 1];
        
        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // Escaped quote - add one quote to field
                currentField += '"';
                i += 2;
            } else {
                // Toggle quote state
                inQuotes = !inQuotes;
                i++;
            }
        } else if (char === ';' && !inQuotes) {
            // Field separator (semicolon for articles.csv)
            currentRow.push(currentField.trim());
            currentField = '';
            i++;
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
            // Row separator
            if (currentField || currentRow.length > 0) {
                currentRow.push(currentField.trim());
                if (currentRow.some(field => field.length > 0)) {
                    rows.push(currentRow);
                }
                currentRow = [];
                currentField = '';
            }
            // Skip \r\n combinations
            if (char === '\r' && nextChar === '\n') {
                i += 2;
            } else {
                i++;
            }
        } else {
            currentField += char;
            i++;
        }
    }
    
    // Add final field/row if exists
    if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        if (currentRow.some(field => field.length > 0)) {
            rows.push(currentRow);
        }
    }
    
    return rows;
}

/**
 * Load articles from CSV file
 * @returns {Promise<Array>} Promise resolving to array of article objects
 */
async function loadArticlesFromCSV() {
    try {
        // Try to read from the default path first
        let csvPath = CSV_FILE_PATH;
        
        // If file doesn't exist at default location, try alternative paths
        if (!fs.existsSync(csvPath)) {
            const alternatives = [
                path.join(process.cwd(), 'articles.csv'),
                path.join(__dirname, '../../../articles.csv'),
                '/home/mateja/Downloads/articles.csv'
            ];
            
            for (const altPath of alternatives) {
                if (fs.existsSync(altPath)) {
                    csvPath = altPath;
                    break;
                }
            }
        }
        
        if (!fs.existsSync(csvPath)) {
            console.error('CSV file not found at any expected location');
            return [];
        }
        
        console.log(`Loading articles from: ${csvPath}`);
        const csvContent = fs.readFileSync(csvPath, 'utf-8');
        const articles = parseCSV(csvContent);
        
        console.log(`Loaded ${articles.length} articles from CSV`);
        return articles;
        
    } catch (error) {
        console.error('Error loading articles from CSV:', error);
        return [];
    }
}

/**
 * Convert articles to the format expected by posts.js
 * @param {Array} articles - Raw articles from CSV
 * @returns {Array} Articles formatted for posts system
 */
function convertArticlesToPosts(articles) {
    return articles.map(article => {
        return {
            id: article.id,
            articleId: article.id, // Use the same ID for articleId
            title: article.title,
            topic: article.topic,
            strength: article.strength,
            stance: article.stance
        };
    });
}

/**
 * Filter articles by topic
 * @param {Array} articles - Array of articles
 * @param {string} topic - Topic to filter by
 * @returns {Array} Filtered articles
 */
function filterByTopic(articles, topic) {
    return articles.filter(article => 
        article.topic && article.topic.toLowerCase() === topic.toLowerCase()
    );
}

/**
 * Get random sample of articles
 * @param {Array} articles - Array of articles
 * @param {number} count - Number of articles to return
 * @returns {Array} Random sample of articles
 */
function getRandomSample(articles, count) {
    const shuffled = [...articles].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

module.exports = {
    loadArticlesFromCSV,
    convertArticlesToPosts,
    filterByTopic,
    getRandomSample,
    parseCSV
};