import dotenv from 'dotenv';
const isProduction = process.env.NODE_ENV === 'production';

// include node variables for development read from .env file
if (!isProduction) {
    dotenv.config();
}

import express from 'express';
import http from 'http';
import KeyManagementController from './interfaces/key-management/KeyManagementController';

const app = express();

// process.on('uncaughtException', (err) => {
//     console.error(`${(new Date()).toUTCString()} uncaughtException:`, err && err.message || err);
//     err && err.stack && console.error(err.stack);
//     process.exit(1);
// });

// Health check
app.get('/health', (req, res) => {
    res.send('OK');
});

app.post('/keys/create', KeyManagementController.createCustomerKey);

// get the intended port number, use port 3000 if not provided
const port = process.env.PORT || 3000;
// Start server
const server = app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`Server started on port: ${port}`);
});

server.timeout = 300000;
