
/**
 * Simple sleep utility function for adding delays
 * @param ms - Time to sleep in milliseconds
 * @returns Promise that resolves after the specified time
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Generate a unique ID
 * @returns A unique string ID
 */
export const generateId = (): string => {
  return crypto.randomUUID();
};

/**
 * Truncate text to a specific length
 * @param text - The text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
