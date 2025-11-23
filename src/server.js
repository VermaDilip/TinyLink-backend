/**
 * Server Entry Point - TinyLink Backend
 *
 * This is the main entry point for the TinyLink URL shortener backend application.
 * It initializes the database connection and starts the Express server.
 *
 * The server provides REST API endpoints for:
 * - Creating short links with custom or AI-generated codes
 * - Retrieving link statistics and analytics
 * - Redirecting short URLs to their original destinations
 * - Health monitoring and system status
 *
 * Architecture:
 * - Express.js for HTTP server and routing
 * - MongoDB for data persistence
 * - CORS enabled for frontend communication
 * - Environment-based configuration
 */

import app from './app.js';
import connectDB from './config/db.js';
import env from './config/env.js';

/**
 * Starts the server after establishing database connection
 *
 * This function performs the following steps:
 * 1. Connects to MongoDB database
 * 2. Starts the Express server on the configured port
 * 3. Handles any startup errors gracefully
 *
 * @async
 * @function startServer
 * @returns {Promise<void>}
 */
const startServer = async () => {
  try {
    // Establish connection to MongoDB database
    await connectDB();

    // Start the Express server and listen for incoming requests
    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    // Log the error and exit the process if server startup fails
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Initialize the server startup process
startServer();