import dotenv from 'dotenv';
const isProduction = process.env.NODE_ENV === 'production';

// include node variables for development read from .env file
if (!isProduction) {
    dotenv.config();
}

import express from 'express';
// controllers
import HealthController from './interfaces/health/HealthController';
import KeyManagementController from './interfaces/key-management/KeyManagementController';
// utils
import { jsonResponse } from './utils/standardResponses';
import { appErrorHandler } from './utils/errorHandler';

const app = express();

app.use(jsonResponse());

// Health check
app.get('/health', HealthController.getHealth);
app.post('/keys/create', KeyManagementController.createCustomerKey);

app.use(appErrorHandler());

// get the intended port number, use port 3000 if not provided
const port = process.env.PORT || 3000;
// Start server
const server = app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`Server started on port: ${port}`);
});

server.timeout = 300000;
