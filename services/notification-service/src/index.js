const express = require('express');
const app = express();
const port = process.env.PORT || 3002;
const routes = require('./routes');

app.use(express.json());
app.use(routes);

app.listen(port, () => {
    console.log(`Notification service listening on port ${port}`);
});
