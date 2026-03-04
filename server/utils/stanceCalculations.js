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
 * Uses NEW WEIGHTING FORMULA:
 * - 33.33% for Q1 (feeling thermometer: topicAttitude)
 * - 33.33% for Q2-Q7 (oneSide questions)
 * - 33.33% for Q8-Q13 (otherSide questions)
 * 
 * The Overton window represents the range of acceptable perspectives a user is willing to see.
 * Tighter windows = more filter bubble effect
 * Wider windows = more diverse perspectives
 * 
 * @param {string} topic - Current topic (abortion, climate, etc)
 * @param {Object} surveyResults - Survey response object with 13 rating questions
 * @param {string} controlGroup - User's control group ('control', 'edge', 'center')
 * @returns {Object} {min: number, max: number}
 */
function calculateOvertonWindow(topic, surveyResults, controlGroup = 'control') {
    // NEW FORMULA: Calculate weighted stance score from all 13 questions
    // Q8-Q13 have NEGATIVE weight (they represent the opposite side)
    
    // Q1 (33.33%): Feeling thermometer [1-100] normalized to [-1, +1]
    // Value 1 → -1 (strongly against), Value 50.5 → 0 (neutral), Value 100 → +1 (strongly for)
    const topicAttitude = surveyResults.topicAttitude || 50.5;
    const q1_normalized = (topicAttitude - 50.5) / 49.5;
    const weight_q1 = q1_normalized * 0.3333;
    
    // Q2-Q7 (33.33%): oneSide questions [1-10] normalized to [-1, +1]
    // These measure alignment WITH your side
    const q2_7_values = [
        surveyResults.oneSide_openminded || 5.5,
        surveyResults.oneSide_moderate || 5.5,
        surveyResults.oneSide_moral || 5.5,
        surveyResults.oneSide_family || 5.5,
        surveyResults.oneSide_friend || 5.5,
        surveyResults.oneSide_coworker || 5.5
    ];
    const q2_7_avg = q2_7_values.reduce((a, b) => a + b, 0) / q2_7_values.length;
    const q2_7_normalized = (q2_7_avg - 5.5) / 4.5;  // Value 1→-1, 5.5→0, 10→+1
    const weight_q2_7 = q2_7_normalized * 0.3333;
    
    // Q8-Q13 (33.33%): otherSide questions [1-10] normalized to [-1, +1]
    // These measure alignment with OTHER side: NEGATIVE WEIGHT!
    // If other side rates high, your stance moves in negative direction
    const q8_13_values = [
        surveyResults.otherSide_openminded || 5.5,
        surveyResults.otherSide_moderate || 5.5,
        surveyResults.otherSide_moral || 5.5,
        surveyResults.otherSide_family || 5.5,
        surveyResults.otherSide_friend || 5.5,
        surveyResults.otherSide_coworker || 5.5
    ];
    const q8_13_avg = q8_13_values.reduce((a, b) => a + b, 0) / q8_13_values.length;
    const q8_13_normalized = (q8_13_avg - 5.5) / 4.5;  // Value 1→-1, 5.5→0, 10→+1
    const weight_q8_13 = -q8_13_normalized * 0.3333;  // NEGATIVE WEIGHT
    
    // Combined stance score directly in [-1, +1] scale
    const userStance = weight_q1 + weight_q2_7 + weight_q8_13;
    
    console.log('Overton Window Calculation (Backend):', {
        topicAttitude,
        q1_normalized,
        weight_q1,
        q2_7_avg,
        q2_7_normalized,
        weight_q2_7,
        q8_13_avg,
        q8_13_normalized,
        weight_q8_13_negative: weight_q8_13,
        userStance_final: userStance
    });
    
    // ALL GROUPS: Calculate personalized window based on openness/tolerance
    // Base windows per topic (in [-1, 1] scale for perspective scores)
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
    
    // Calculate openness/tolerance from Q2-Q13 (already calculated above)
    // Use the same Q2-Q7 and Q8-Q13 averages for consistency
    const avgTolerance = (q2_7_avg + q8_13_avg) / 2; // [1-10] scale
    
    // Calculate connection score (moral/family/friend/coworker proximity to other side)
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
    // - Score of 1 (very closed) → 0.6x window (significantly narrower)
    // - Score of 5.5 (neutral) → 1.0x window (base width)
    // - Score of 10 (very open) → 1.3x window (moderately wider)
    // This ensures even very open users don't see ALL content (filter bubble research goal)
    const scaleFactor = 0.6 + (opennessScore / 10) * 0.7;
    
    // Apply scaling to base window and center around user's stance
    const windowSize = baseWindow.max - baseWindow.min;
    const newHalfSize = (windowSize / 2) * scaleFactor;
    
    // Center window around user's stance (userStance already calculated above using new formula)
    // Convert from [-1, 1] scale to [0, 100] scale for consistency with articles
    const userStance_0_100 = (userStance + 1) * 50; // Convert [-1,1] to [0,100]
    const halfSize_0_100 = newHalfSize * 50; // Convert [-1,1] range to [0,100] range
    
    return {
        min: Math.max(0, userStance_0_100 - halfSize_0_100),   // Bound to [0, 100]
        max: Math.min(100, userStance_0_100 + halfSize_0_100)
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
