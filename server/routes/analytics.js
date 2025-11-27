const router = require('express').Router();
const RecommendationLog = require('../models/RecommendationLog');
const SurveyResponse = require('../models/SurveyResponse');
const verifyToken = require('../middleware/verifyToken');
const logger = require('../logs/logger');

// Get recommendation logs for analysis
router.get('/recommendations', verifyToken, async (req, res) => {
    try {
        const { userId, controlGroup, topic, startDate, endDate, limit = 100 } = req.query;
        
        let query = {};
        
        if (userId) query.userId = userId;
        if (controlGroup) query.controlGroup = controlGroup;
        if (topic) query.topic = topic;
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }
        
        const logs = await RecommendationLog.find(query)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit))
            .populate('userId', 'username')
            .exec();
        
        res.status(200).json({ success: true, count: logs.length, logs });
    } catch (err) {
        logger.error('Error fetching recommendation logs', { error: err.message });
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get survey response history for analysis
router.get('/survey-responses', verifyToken, async (req, res) => {
    try {
        const { userId, topic, startDate, endDate, limit = 100 } = req.query;
        
        let query = {};
        
        if (userId) query.userId = userId;
        if (topic) query.topic = topic;
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }
        
        const responses = await SurveyResponse.find(query)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit))
            .populate('userId', 'username')
            .exec();
        
        res.status(200).json({ success: true, count: responses.length, responses });
    } catch (err) {
        logger.error('Error fetching survey responses', { error: err.message });
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get statistics summary
router.get('/summary', verifyToken, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        let dateFilter = {};
        if (startDate || endDate) {
            dateFilter = {};
            if (startDate) dateFilter.$gte = new Date(startDate);
            if (endDate) dateFilter.$lte = new Date(endDate);
        }
        
        const surveyQuery = dateFilter.timestamp ? { timestamp: dateFilter } : {};
        const recommendationQuery = dateFilter.timestamp ? { timestamp: dateFilter } : {};
        
        const [
            totalSurveys,
            totalRecommendations,
            controlGroupSurveys,
            edgeGroupSurveys,
            centerGroupSurveys
        ] = await Promise.all([
            SurveyResponse.countDocuments(surveyQuery),
            RecommendationLog.countDocuments(recommendationQuery),
            SurveyResponse.countDocuments({ ...surveyQuery, 'userId.controlGroup': 'control' }),
            SurveyResponse.countDocuments({ ...surveyQuery, 'userId.controlGroup': 'edge' }),
            SurveyResponse.countDocuments({ ...surveyQuery, 'userId.controlGroup': 'center' })
        ]);
        
        res.status(200).json({
            success: true,
            summary: {
                totalSurveys,
                totalRecommendations,
                controlGroups: {
                    control: controlGroupSurveys,
                    edge: edgeGroupSurveys,
                    center: centerGroupSurveys
                }
            }
        });
    } catch (err) {
        logger.error('Error fetching analytics summary', { error: err.message });
        res.status(500).json({ success: false, error: err.message });
    }
});

// Export case study data
router.post('/export-case-study-data', verifyToken, async (req, res) => {
    try {
        const { startDate, endDate, format = 'json' } = req.body;
        
        let dateFilter = {};
        if (startDate || endDate) {
            dateFilter = {};
            if (startDate) dateFilter.$gte = new Date(startDate);
            if (endDate) dateFilter.$lte = new Date(endDate);
        }
        
        // Gather all data
        const surveyResponses = await SurveyResponse.find(
            dateFilter.timestamp ? { timestamp: dateFilter } : {}
        ).populate('userId', 'username controlGroup').exec();
        
        const recommendationLogs = await RecommendationLog.find(
            dateFilter.timestamp ? { timestamp: dateFilter } : {}
        ).populate('userId', 'username controlGroup').exec();
        
        const data = {
            exportDate: new Date().toISOString(),
            dateRange: { startDate, endDate },
            surveyResponses: surveyResponses,
            recommendationLogs: recommendationLogs,
            summary: {
                totalSurveys: surveyResponses.length,
                totalRecommendations: recommendationLogs.length,
                controlGroups: {
                    control: surveyResponses.filter(s => s.userId?.controlGroup === 'control').length,
                    edge: surveyResponses.filter(s => s.userId?.controlGroup === 'edge').length,
                    center: surveyResponses.filter(s => s.userId?.controlGroup === 'center').length
                }
            }
        };
        
        if (format === 'csv') {
            // Convert to CSV format (simplified)
            const csv = convertToCSV(data);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=case-study-data.csv');
            res.status(200).send(csv);
        } else {
            res.status(200).json({ success: true, data });
        }
        
    } catch (err) {
        logger.error('Error exporting case study data', { error: err.message });
        res.status(500).json({ success: false, error: err.message });
    }
});

function convertToCSV(data) {
    // Simplified CSV conversion - implement full conversion as needed
    const headers = 'userId,controlGroup,topic,timestamp,topicAttitude,stanceScore\n';
    const rows = data.surveyResponses.map(r => 
        `${r.userId?._id},${r.userId?.controlGroup},${r.topic},${r.timestamp},${r.topicAttitude},${r.calculatedStanceScore}`
    ).join('\n');
    return headers + rows;
}

module.exports = router;
