/**
 * HTTP Status Codes - Standardized API Response Codes
 *
 * This file defines all HTTP status codes used throughout the TinyLink API.
 * Using named constants ensures consistency and prevents magic numbers in code.
 *
 * Status Code Categories:
 * - 2xx: Success responses
 * - 4xx: Client error responses
 * - 5xx: Server error responses
 *
 * These constants are used in controllers to send appropriate HTTP responses
 * based on the outcome of business operations.
 */

export const STATUS = {
  // Success Responses (2xx)
  OK: 200,                    // Standard success response
  CREATED: 201,              // Resource successfully created
  NO_CONTENT: 204,           // Successful request with no content to return

  // Client Error Responses (4xx)
  BAD_REQUEST: 400,          // Invalid request data or malformed syntax
  NOT_FOUND: 404,            // Requested resource not found
  CONFLICT: 409,             // Request conflicts with current state (e.g., duplicate code)

  // Server Error Responses (5xx)
  INTERNAL_SERVER_ERROR: 500, // Unexpected server error
};