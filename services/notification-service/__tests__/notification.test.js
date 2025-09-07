const request = require('supertest');
const express = require('express');
const app = express();

// Import the routes
const notificationRoutes = require('../src/routes');
app.use(express.json());
app.use(notificationRoutes);

describe('Notification Service', () => {
    describe('GET /health', () => {
        it('should return health status', async () => {
            const res = await request(app).get('/health');
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'OK');
            expect(res.body).toHaveProperty('service', 'notification-service');
        });
    });

    describe('POST /notifications', () => {
        it('should create a new notification', async () => {
            const notification = {
                userId: '123',
                message: 'Test notification',
                type: 'TEST'
            };

            const res = await request(app)
                .post('/notifications')
                .send(notification);

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('userId', notification.userId);
            expect(res.body).toHaveProperty('message', notification.message);
            expect(res.body).toHaveProperty('type', notification.type);
            expect(res.body).toHaveProperty('status', 'sent');
        });

        it('should return 400 if required fields are missing', async () => {
            const res = await request(app)
                .post('/notifications')
                .send({});

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });
    });
});
