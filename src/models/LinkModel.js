/**
 * Link Model - MongoDB Schema for URL Links
 *
 * This file defines the Mongoose schema and model for storing URL links in TinyLink.
 * Each document represents a single short URL with its associated metadata.
 *
 * Database Collection: 'links'
 *
 * Schema Fields:
 * - shortCode: Unique identifier for the shortened URL (6-8 chars)
 * - originalUrl: The full URL that the short code redirects to
 * - clicks: Counter for how many times the link has been accessed
 * - lastClicked: Timestamp of the most recent click
 * - createdAt: Timestamp when the link was first created
 *
 * Indexes:
 * - shortCode: Unique index for fast lookups during redirects
 * - createdAt: Index for sorting links by creation date
 */

import mongoose from 'mongoose';

/**
 * Mongoose schema definition for URL links
 *
 * Defines the structure and validation rules for link documents in MongoDB.
 * Includes field types, required fields, uniqueness constraints, and default values.
 */
const linkSchema = new mongoose.Schema({
  // Unique short code that identifies this link (e.g., "abc1234")
  // Must be 6-8 alphanumeric characters, globally unique across all links
  shortCode: {
    type: String,
    required: true,
    unique: true,
    minlength: 6,
    maxlength: 8
  },

  // The original URL that users want to shorten
  // Must be a valid URL format, no length restrictions
  originalUrl: {
    type: String,
    required: true
  },

  // Click counter - tracks how many times this link has been accessed
  // Automatically incremented on each redirect
  clicks: {
    type: Number,
    default: 0
  },

  // Timestamp of the last time this link was clicked
  // Updated atomically with click counter during redirects
  lastClicked: {
    type: Date,
    default: null
  },

  // Timestamp when this link was first created
  // Automatically set to current date/time when document is created
  createdAt: {
    type: Date,
    default: Date.now
  },
});

/**
 * Mongoose model for Link documents
 *
 * Provides the interface for database operations on link documents.
 * Automatically creates 'links' collection in MongoDB if it doesn't exist.
 *
 * @type {mongoose.Model}
 */
const Link = mongoose.model('Link', linkSchema);

// Export the Link model for use in services and controllers
export default Link;