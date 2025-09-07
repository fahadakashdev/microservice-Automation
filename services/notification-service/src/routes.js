const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
        service: 'notification-service'
    };
    res.status(200).json(healthcheck);
});

// Readiness probe endpoint
router.get('/ready', (req, res) => {
    res.status(200).json({ status: 'ready' });
});

// Notification endpoints
router.post('/notifications', (req, res) => {
    const { userId, message, type } = req.body;
    
    if (!userId || !message || !type) {
        return res.status(400).json({ error: 'UserId, message and type are required' });
    }

    // In a real application, you would:
    // 1. Save to database
    // 2. Send actual notifications (email, SMS, push)
    console.log(`Sending ${type} notification to user ${userId}: ${message}`);
    
    res.status(201).json({
        id: Date.now(),
        userId,
        message,
        type,
        status: 'sent',
        timestamp: new Date().toISOString()
    });
});

router.get('/notifications/:userId', (req, res) => {
    const { userId } = req.params;
    // In a real app, fetch from database
    res.json([
        {
            id: 1,
            userId,
            message: 'Your order has been processed',
            type: 'ORDER_UPDATE',
            timestamp: new Date().toISOString()
        }
    ]);
});

module.exports = router;
