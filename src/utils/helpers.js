/**
 * Helper functions for the application
 */

/**
 * Returns a greeting based on the current time of day
 * @returns {string} - Greeting message
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 22) return "Good evening";
  return "Good night";
};

/**
 * Formats a number as currency
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};

/**
 * Capitalizes the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalize = (str) => {
  if (typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncates a string to a specified length
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @returns {string} - Truncated string
 */
export const truncate = (str, length = 100) => {
  if (!str) return "";
  if (str.length <= length) return str;
  return `${str.substring(0, length)}...`;
};

/**
 * Generates a random ID
 * @param {number} length - Length of the ID
 * @returns {string} - Random ID
 */
export const generateRandomId = (length = 6) => {
  return Math.random().toString(36).substring(2, 2 + length);
};
