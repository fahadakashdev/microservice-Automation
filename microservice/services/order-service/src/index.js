const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Configuration for service URLs
const config = {
    userServiceUrl: process.env.USER_SERVICE_URL || 'http://user-service',
    notificationServiceUrl: process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service'
};

// Health check endpoint
app.get('/health', (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
        service: 'order-service'
    };
    res.status(200).json(healthcheck);
});

// Readiness probe endpoint
app.get('/ready', (req, res) => {
    res.status(200).json({ status: 'ready' });
});

// Order endpoints
app.post('/orders', async (req, res) => {
    const { userId, items, totalAmount } = req.body;

    if (!userId || !items || !totalAmount) {
        return res.status(400).json({ error: 'UserId, items and totalAmount are required' });
    }

    try {
        // Verify user exists
        const userResponse = await axios.get(`${config.userServiceUrl}/users/${userId}`);
        
        // Create order
        const order = {
            id: Date.now(),
            userId,
            items,
            totalAmount,
            status: 'CREATED',
            createdAt: new Date().toISOString()
        };

        // Send notification
        await axios.post(`${config.notificationServiceUrl}/notifications`, {
            userId,
            message: `Your order #${order.id} has been created`,
            type: 'ORDER_CREATED'
        });

        res.status(201).json(order);
    } catch (error) {
        console.error('Error processing order:', error.message);
        res.status(500).json({ error: 'Error processing order' });
    }
});

app.get('/orders/:userId', (req, res) => {
    const { userId } = req.params;
    // In a real app, fetch from database
    res.json([
        {
            id: 1,
            userId,
            items: [{ productId: 1, quantity: 2, price: 29.99 }],
            totalAmount: 59.98,
            status: 'COMPLETED',
            createdAt: new Date().toISOString()
        }
    ]);
});

app.patch('/orders/:orderId/status', async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }

    try {
        // In a real app, update in database
        const order = {
            id: orderId,
            status,
            updatedAt: new Date().toISOString()
        };

        // Send notification
        await axios.post(`${config.notificationServiceUrl}/notifications`, {
            userId: order.userId,
            message: `Your order #${order.id} status has been updated to ${status}`,
            type: 'ORDER_STATUS_UPDATED'
        });

        res.json(order);
    } catch (error) {
        console.error('Error updating order:', error.message);
        res.status(500).json({ error: 'Error updating order' });
    }
});

app.listen(port, () => {
    console.log(`Order service listening on port ${port}`);
});
