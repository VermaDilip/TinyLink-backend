/**
 * Error and Success Messages - Standardized API Response Messages
 *
 * This file contains all user-facing messages used throughout the TinyLink API.
 * Centralizing messages ensures consistency and makes localization easier.
 *
 * Message Categories:
 * - Success messages: Positive feedback for successful operations
 * - Error messages: User-friendly error descriptions for failed operations
 * - Validation messages: Specific messages for input validation failures
 *
 * These messages are used in controllers and services to provide clear,
 * consistent feedback to API consumers (frontend applications).
 */

export const MESSAGES = {
  // Success Messages
  LINK_CREATED: 'Link created successfully',
  LINK_DELETED: 'Link deleted successfully',

  // Error Messages
  LINK_NOT_FOUND: 'Link not found',
  CODE_EXISTS: 'Short code already exists',
  INVALID_URL: 'Invalid URL provided',
  INVALID_CODE: 'Invalid short code format',
  SERVER_ERROR: 'Internal server error',
};