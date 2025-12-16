/**
 * Stance and Overton Window Calculation Utilities
 * For Control Group Recommendation System
 */

/**
 * Convert survey topicAttitude (0-100) to stanceScore (-1 to 1)
 * @param {number} topicAttitude - Survey response 0=strongly against, 50=neutral, 100=strongly for
 * @returns {number} Stance score in range [-1, 1]
 */
function surveyToStanceScore(topicAttitude) {
    if (topicAttitude === undefined || topicAttitude === null) {
        return 0; // Default to neutral
    }
    // Map 0-100 to -1 to 1
    return (topicAttitude - 50) / 50;
}

/**
 * Determine if user is centrist based on stance score
 * @param {number} stanceScore - User's stance (-1 to 1)
 * @param {number} threshold - Distance from 0 to be considered centrist (default 0.2)
 * @returns {boolean} True if centrist
 */
function isCentrist(stanceScore, threshold = 0.2) {
    return Math.abs(stanceScore) < threshold;
}

/**
 * Calculate Overton window based on topic and survey data
 * Uses survey responses about open-mindedness and moderation to adjust window size
 * 
 * The Overton window represents the range of acceptable perspectives a user is willing to see.
 * Tighter windows = more filter bubble effect
 * Wider windows = more diverse perspectives
 * 
 * @param {string} topic - Current topic (abortion, climate, etc)
 * @param {Object} surveyResults - Survey response object with 12 rating questions (1-10 scale)
 * @returns {Object} {min: number, max: number}
 */
function calculateOvertonWindow(topic, surveyResults) {
    // TIGHTER base windows per topic - these create meaningful filtering
    // Window size should exclude extreme opposite views while including moderate diversity
    // With perspective scores ranging -1.0 to +1.0, a window of ~0.4-0.6 width is reasonable
    const baseWindows = {
        'abortion': { min: -0.3, max: 0.3 },              // Narrow - highly polarized topic
        'gun control': { min: -0.3, max: 0.3 },           // Narrow - polarized
        'assisted death': { min: -0.4, max: 0.4 },        // Wider - less polarized
        'nuclear power': { min: -0.35, max: 0.35 },       // Moderate - technical topic
        'social media regulation': { min: -0.35, max: 0.35 }, // Moderate
        'military armament': { min: -0.3, max: 0.3 },     // Narrow - polarized
        'climate action': { min: -0.35, max: 0.35 },      // Moderate - scientific topic
        'default': { min: -0.3, max: 0.3 }
    };
    
    const baseWindow = baseWindows[topic] || baseWindows['default'];
    
    // Calculate tolerance score from survey data (how open-minded and moderate they see both sides)
    // Higher scores = more tolerant = wider Overton window
    const oneSideScore = (
        (surveyResults.oneSide_openminded || 5) +
        (surveyResults.oneSide_moderate || 5)
    ) / 2;
    
    const otherSideScore = (
        (surveyResults.otherSide_openminded || 5) +
        (surveyResults.otherSide_moderate || 5)
    ) / 2;
    
    // Average tolerance across both sides (1-10 scale)
    const avgTolerance = (oneSideScore + otherSideScore) / 2;
    
    // Calculate how moral/family/friend/coworker connected they feel (1-10 scale)
    // Higher connection to opposite side = more tolerance
    const connectionScore = (
        (surveyResults.otherSide_moral || 5) +
        (surveyResults.otherSide_family || 5) +
        (surveyResults.otherSide_friend || 5) +
        (surveyResults.otherSide_coworker || 5)
    ) / 4;
    
    // Combined openness score (weight tolerance more than connection)
    const opennessScore = (avgTolerance * 0.7) + (connectionScore * 0.3);
    
    // TIGHTER scale factor range to prevent windows from becoming too wide
    // - Score of 1 (very closed) → 0.6x window (significantly narrower, min ~0.36 width)
    // - Score of 5.5 (neutral) → 1.0x window (base ~0.6 width)
    // - Score of 10 (very open) → 1.3x window (moderately wider, max ~0.78 width)
    // This ensures even very open users don't see ALL content (filter bubble research goal)
    const scaleFactor = 0.6 + (opennessScore / 10) * 0.7;
    
    // Calculate user's stance from topicAttitude (if available in surveyResults)
    // This centers the Overton window around the user's position, not at 0
    const userStance = surveyResults.topicAttitude !== undefined 
        ? surveyToStanceScore(surveyResults.topicAttitude)
        : 0; // Default to center if no stance available
    
    // Apply scaling to base window
    const windowSize = baseWindow.max - baseWindow.min;
    const newHalfSize = (windowSize / 2) * scaleFactor;
    
    // Center window around user's stance, not at 0
    return {
        min: Math.max(-1, userStance - newHalfSize), // Bound to [-1, 1]
        max: Math.min(1, userStance + newHalfSize)
    };
}

/**
 * Calculate perspective score from article stance and strength
 * Used to convert existing article data to perspective scores
 * 
 * Stance values from articles.csv:
 * - abortion: 'Pro-choice' (+) / 'Pro-life' (-)
 * - gun control: 'Pro gun control' (+) / 'Pro gun freedom' (-)
 * - assisted death: 'Pro assisted death' (+) / 'Anti assisted death' (-)
 * - nuclear power: 'pro nuclear power' (+) / 'anti nuclear power' (-)
 * - social media regulation: 'pro regulation' (+) / 'anti regulation' (-)
 * - military armament: 'pro armament' (+) / 'anti armament' (-)
 * - climate action: 'high concern' (+) / 'low concern' (-)
 * 
 * @param {string} stance - Article stance from CSV
 * @param {number} strength - Strength value (1-10 scale)
 * @returns {number} Perspective score in range [-1, 1]
 */
function calculatePerspectiveScore(stance, strength) {
    if (!stance || strength === undefined || strength === null) {
        return 0; // Default to neutral
    }
    
    // Normalize strength to 0-1 range (1-10 scale from CSV data)
    // Strength 1 = 0.1, Strength 10 = 1.0
    const normalizedStrength = Math.max(0, Math.min(1, strength / 10));
    
    // Normalize stance: lowercase and replace en-dash with regular dash
    const stanceLower = stance.toLowerCase().trim().replace(/–/g, '-');
    
    // POSITIVE stances (progressive/permissive/concerned direction)
    // These get positive perspective scores
    if (stanceLower.includes('pro-choice') ||           // Abortion
        stanceLower.includes('pro gun control') ||      // Gun control
        stanceLower.includes('pro-gun control') ||      // Gun control (with dash)
        stanceLower.includes('pro assisted death') ||   // Assisted death
        stanceLower.includes('pro-assisted death') ||   // Assisted death (with dash)
        stanceLower.includes('pro nuclear power') ||    // Nuclear power
        stanceLower.includes('pro regulation') ||       // Social media regulation
        stanceLower.includes('pro armament') ||         // Military armament
        stanceLower.includes('high concern')) {         // Climate action
        return normalizedStrength; // Positive score
    } 
    // NEGATIVE stances (conservative/restrictive/unconcerned direction)
    // These get negative perspective scores
    else if (stanceLower.includes('pro-life') ||        // Abortion
             stanceLower.includes('pro gun freedom') || // Gun control
             stanceLower.includes('pro-gun freedom') || // Gun control (with dash)
             stanceLower.includes('anti assisted death') || // Assisted death
             stanceLower.includes('anti-assisted death') || // Assisted death (with dash)
             stanceLower.includes('anti nuclear power') || // Nuclear power
             stanceLower.includes('anti regulation') || // Social media regulation
             stanceLower.includes('anti armament') ||   // Military armament
             stanceLower.includes('low concern')) {     // Climate action
        return -normalizedStrength; // Negative score
    } 
    // Neutral or unknown
    else {
        console.warn('Unknown stance value:', stance);
        return 0;
    }
}

module.exports = {
    surveyToStanceScore,
    isCentrist,
    calculateOvertonWindow,
    calculatePerspectiveScore
};
