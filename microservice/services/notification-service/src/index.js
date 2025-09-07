const express = require('express');
const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
        service: 'notification-service'
    };
    res.status(200).json(healthcheck);
});

// Readiness probe endpoint
app.get('/ready', (req, res) => {
    res.status(200).json({ status: 'ready' });
});

// Notification endpoints
app.post('/notifications', (req, res) => {
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

app.get('/notifications/:userId', (req, res) => {
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

app.listen(port, () => {
    console.log(`Notification service listening on port ${port}`);
});
