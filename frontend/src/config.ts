/**
 * Indicates whether the frontend is currently built in production.
 */
export const isProductionEnabled = process.env.NODE_ENV === "production";

/**
 * The base url to a tilt backend.
 */
export const apiBaseUrl = process.env.API_BASE_URL as string;