/**
 * Express Application Configuration - TinyLink Backend
 *
 * This file configures the main Express application for the TinyLink URL shortener.
 * It sets up middleware, routes, and request handling for all API endpoints.
 *
 * Key Features:
 * - CORS enabled for cross-origin requests from frontend
 * - JSON body parsing for API requests
 * - Modular route organization
 * - URL redirection handling with validation
 *
 * API Endpoints:
 * - POST /api/links - Create new short links
 * - GET /api/links - Retrieve all links
 * - GET /api/links/:code - Get specific link stats
 * - DELETE /api/links/:code - Delete a link
 * - GET /:code - Redirect to original URL
 * - GET /healthz - Health check endpoint
 */

import express from 'express';
import cors from 'cors';
import linkRoutes from './routes/link.routes.js';
import healthRoutes from './routes/health.routes.js';
import linkController from './controllers/link.controller.js';
import validateCode from './middleware/validateCode.js';

// Create the main Express application instance
const app = express();

// Middleware Configuration
// Enable CORS for cross-origin requests from the frontend application
app.use(cors());

// Parse incoming JSON payloads in request bodies
app.use(express.json());

// Route Configuration
// Mount link-related routes under /api/links prefix
// Handles CRUD operations for URL links
app.use('/api/links', linkRoutes);

// Mount health check routes under /healthz prefix
// Provides system status and monitoring information
app.use('/healthz', healthRoutes);

// URL Redirection Route
// Handles short code redirects to original URLs
// Includes validation middleware to ensure code format and existence
app.get('/:code', validateCode, linkController.redirectLink);

// Export the configured Express application
export default app;