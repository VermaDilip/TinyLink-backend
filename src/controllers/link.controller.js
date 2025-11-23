/**
 * Link Controller - Handles HTTP requests for URL link operations
 *
 * This controller manages all CRUD operations for URL links in the TinyLink application.
 * It acts as the interface between HTTP requests and the business logic layer (services).
 *
 * Responsibilities:
 * - Validate incoming request data
 * - Call appropriate service methods
 * - Handle errors and send appropriate HTTP responses
 * - Format response data for API consumers
 *
 * Routes handled:
 * - POST /api/links - Create new short links
 * - GET /api/links - Retrieve all links
 * - GET /api/links/:code - Get specific link statistics
 * - DELETE /api/links/:code - Delete a link
 * - GET /:code - Redirect to original URL
 */

import linkService from '../services/link.service.js';
import { STATUS } from '../constants/apiStatus.js';
import { MESSAGES } from '../constants/messages.js';

/**
 * Controller class for handling link-related HTTP requests
 * Uses singleton pattern - exported as instantiated object
 */
class LinkController {

  /**
   * Creates a new short link
   *
   * Accepts original URL and optional custom short code.
   * If no custom code provided, service will generate one.
   * Validates URL format and ensures code uniqueness.
   *
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body
   * @param {string} req.body.originalUrl - The original URL to shorten
   * @param {string} [req.body.shortCode] - Optional custom short code
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async createLink(req, res) {
    try {
      const { originalUrl, shortCode } = req.body;

      // Call service to create the link
      const link = await linkService.createLink(originalUrl, shortCode);

      // Return success response with created link details
      res.status(STATUS.CREATED).json({
        shortCode: link.shortCode,
        originalUrl: link.originalUrl
      });
    } catch (error) {
      // Handle specific error cases
      if (error.message === MESSAGES.CODE_EXISTS) {
        // Short code already exists - return conflict status
        res.status(STATUS.CONFLICT).json({ error: error.message });
      } else {
        // Other validation errors (invalid URL, etc.)
        res.status(STATUS.BAD_REQUEST).json({ error: error.message });
      }
    }
  }

  /**
   * Retrieves all links for the dashboard
   *
   * Returns a list of all short links with their basic information.
   * Used by the frontend dashboard to display user's links.
   *
   * @async
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async getAllLinks(req, res) {
    try {
      // Fetch all links from service layer
      const links = await linkService.getAllLinks();

      // Return links array as JSON response
      res.json(links);
    } catch (error) {
      // Handle database or service errors
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.SERVER_ERROR });
    }
  }

  /**
   * Retrieves statistics for a specific link
   *
   * Returns detailed information about a single short link including
   * click count, last clicked time, and original URL.
   *
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Route parameters
   * @param {string} req.params.code - The short code to look up
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async getLinkStats(req, res) {
    try {
      const { code } = req.params;

      // Find the link by its short code
      const link = await linkService.getLinkByCode(code);

      // Return 404 if link doesn't exist
      if (!link) {
        return res.status(STATUS.NOT_FOUND).json({ error: MESSAGES.LINK_NOT_FOUND });
      }

      // Return link statistics
      res.json({
        shortCode: link.shortCode,
        originalUrl: link.originalUrl,
        clicks: link.clicks,
        lastClicked: link.lastClicked,
      });
    } catch (error) {
      // Handle database or service errors
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.SERVER_ERROR });
    }
  }

  /**
   * Deletes a link by its short code
   *
   * Permanently removes a short link from the database.
   * After deletion, the short code will return 404 on access.
   *
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Route parameters
   * @param {string} req.params.code - The short code to delete
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async deleteLink(req, res) {
    try {
      const { code } = req.params;

      // Attempt to delete the link
      await linkService.deleteLink(code);

      // Return 204 No Content on successful deletion
      res.status(STATUS.NO_CONTENT).send();
    } catch (error) {
      // Handle specific error cases
      if (error.message === MESSAGES.LINK_NOT_FOUND) {
        // Link doesn't exist - return 404
        res.status(STATUS.NOT_FOUND).json({ error: error.message });
      } else {
        // Other errors (database issues, etc.)
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.SERVER_ERROR });
      }
    }
  }

  /**
   * Redirects short code to original URL
   *
   * This is the core redirection functionality of TinyLink.
   * Increments click counter and redirects user to original URL.
   * Uses HTTP 302 (temporary redirect) as per spec.
   *
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Route parameters
   * @param {string} req.params.code - The short code to redirect
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async redirectLink(req, res) {
    try {
      const { code } = req.params;

      // Find the link by short code
      const link = await linkService.getLinkByCode(code);

      // Return 404 if link doesn't exist
      if (!link) {
        return res.status(STATUS.NOT_FOUND).send('Not Found');
      }

      // Increment click counter and update last clicked time
      await linkService.incrementClicks(link);

      // Redirect to original URL with 302 status
      res.redirect(302, link.originalUrl);
    } catch (error) {
      // Handle any errors during redirection
      res.status(STATUS.INTERNAL_SERVER_ERROR).send('Server error');
    }
  }
}

// Export singleton instance of the controller
export default new LinkController();