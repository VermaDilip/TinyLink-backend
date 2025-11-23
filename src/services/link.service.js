/**
 * Link Service - Business Logic Layer for URL Link Operations
 *
 * This service contains the core business logic for managing URL links in TinyLink.
 * It handles data validation, database operations, and business rules.
 *
 * Responsibilities:
 * - URL and short code validation
 * - Database CRUD operations for links
 * - Click tracking and analytics
 * - Business rule enforcement (uniqueness, format validation)
 *
 * Architecture:
 * - Pure business logic, no HTTP concerns
 * - Uses Mongoose models for database operations
 * - Throws specific errors for different failure cases
 * - Returns domain objects (Link instances)
 */

import Link from '../models/LinkModel.js';
import generateCode from '../utils/generateCode.js';
import { CODE_REGEX } from '../constants/regex.js';
import { MESSAGES } from '../constants/messages.js';

/**
 * Service class for handling link business logic
 * Uses singleton pattern - exported as instantiated object
 */
class LinkService {

  /**
   * Creates a new short link with validation and uniqueness checks
   *
   * Business Rules:
   * - Original URL must be valid
   * - Short code must be 6-8 alphanumeric characters
   * - Short codes must be globally unique
   * - If no custom code provided, auto-generate one
   *
   * @async
   * @param {string} originalUrl - The original URL to shorten
   * @param {string} [customCode] - Optional custom short code
   * @returns {Promise<Object>} Created link document
   * @throws {Error} If URL is invalid, code format is wrong, or code already exists
   */
  async createLink(originalUrl, customCode) {
    // Step 1: Validate that the original URL is properly formatted
    try {
      new URL(originalUrl);
    } catch (err) {
      throw new Error(MESSAGES.INVALID_URL);
    }

    // Step 2: Determine the short code (custom or auto-generated)
    let shortCode = customCode;
    if (!shortCode) {
      // Generate a random code if none provided
      shortCode = generateCode();
    }

    // Step 3: Validate short code format
    if (!CODE_REGEX.test(shortCode)) {
      throw new Error(MESSAGES.INVALID_CODE);
    }

    // Step 4: Check for uniqueness - ensure code doesn't already exist
    const existingLink = await Link.findOne({ shortCode });
    if (existingLink) {
      throw new Error(MESSAGES.CODE_EXISTS);
    }

    // Step 5: Create and save the new link
    const newLink = new Link({ shortCode, originalUrl });
    await newLink.save();
    return newLink;
  }

  /**
   * Retrieves all links for dashboard display
   *
   * Returns basic information for all links without sensitive data.
   * Used by the frontend dashboard to show user's links.
   *
   * @async
   * @returns {Promise<Array>} Array of link objects with selected fields
   */
  async getAllLinks() {
    // Return only essential fields for dashboard display
    return await Link.find({}, 'shortCode originalUrl clicks lastClicked');
  }

  /**
   * Finds a link by its short code
   *
   * Used for redirects and statistics retrieval.
   * Returns null if link doesn't exist.
   *
   * @async
   * @param {string} code - The short code to search for
   * @returns {Promise<Object|null>} Link document or null if not found
   */
  async getLinkByCode(code) {
    return await Link.findOne({ shortCode: code });
  }

  /**
   * Increments click count and updates last clicked timestamp
   *
   * This method is called whenever a short link is accessed.
   * Updates both click counter and timestamp atomically.
   *
   * @async
   * @param {Object} link - The link document to update
   * @param {string} link.shortCode - Short code identifier
   * @param {number} link.clicks - Current click count
   * @returns {Promise<Object>} Updated link document
   */
  async incrementClicks(link) {
    // Increment click counter
    link.clicks += 1;

    // Update last clicked timestamp
    link.lastClicked = new Date();

    // Save the updated link
    await link.save();
    return link;
  }

  /**
   * Deletes a link by its short code
   *
   * Permanently removes a link from the database.
   * Throws error if link doesn't exist.
   *
   * @async
   * @param {string} code - The short code of the link to delete
   * @returns {Promise<Object>} The deleted link document
   * @throws {Error} If link doesn't exist
   */
  async deleteLink(code) {
    // Attempt to find and delete the link in one operation
    const link = await Link.findOneAndDelete({ shortCode: code });

    // Throw error if link was not found
    if (!link) {
      throw new Error(MESSAGES.LINK_NOT_FOUND);
    }

    return link;
  }
}

// Export singleton instance of the service
export default new LinkService();