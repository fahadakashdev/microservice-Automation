const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Health check endpoint for Kubernetes probes
app.get('/health', (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
        service: 'user-service'
    };
    res.status(200).json(healthcheck);
});

// Readiness probe endpoint
app.get('/ready', (req, res) => {
    // Add any additional readiness checks here (e.g., database connectivity)
    res.status(200).json({ status: 'ready' });
});

// Sample user endpoints
app.get('/users', (req, res) => {
    res.json([
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ]);
});

app.post('/users', (req, res) => {
    // Add validation and error handling
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }
    // In a real app, you would save to a database here
    res.status(201).json({ id: 3, name, email });
});

app.listen(port, () => {
    console.log(`User service listening on port ${port}`);
});
