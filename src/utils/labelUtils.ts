
/**
 * Generates a formatted suffix based on a number and the specified limit
 * When the numeric limit is reached, it switches to alphanumeric format
 * 
 * @param count The current count number
 * @param limit The maximum digits for numeric suffixes
 * @returns Formatted suffix string
 */
export const generateSuffix = (count: number, limit: number): string => {
  // Calculate the maximum numeric value based on the limit
  const maxNumeric = Math.pow(10, limit) - 1;
  
  // If count is within numeric range, format with leading zeros
  if (count <= maxNumeric) {
    return count.toString().padStart(limit, '0');
  }
  
  // For values beyond the numeric range, use alphanumeric format
  // First, calculate how far beyond maxNumeric we are
  const beyondMax = count - maxNumeric;
  
  // Use base-26 (A-Z) for the first character beyond numeric
  const alphaBase = 26;
  const firstChar = String.fromCharCode(64 + (Math.floor((beyondMax - 1) / maxNumeric) % alphaBase) + 1);
  
  // Calculate the numeric part (will cycle through 1-maxNumeric)
  const numericPart = ((beyondMax - 1) % maxNumeric) + 1;
  
  // Format the numeric part with leading zeros
  return firstChar + numericPart.toString().padStart(limit - 1, '0');
};

/**
 * Parse a label suffix to get its numeric value
 * Used when loading existing labels to continue the sequence
 * 
 * @param suffix The label suffix (e.g., "0001" or "A001")
 * @param limit The digit limit for numeric suffixes
 * @returns The numeric count value
 */
export const parseSuffix = (suffix: string, limit: number): number => {
  // If it's a numeric suffix, simply parse it
  if (/^\d+$/.test(suffix)) {
    return parseInt(suffix);
  }
  
  // For alphanumeric suffix
  const alpha = suffix.charAt(0);
  const numeric = suffix.substring(1);
  
  // Calculate the base value from the alpha character
  const alphaValue = alpha.charCodeAt(0) - 64; // A=1, B=2, etc.
  
  // Calculate the max numeric value
  const maxNumeric = Math.pow(10, limit) - 1;
  
  // Return the combined value
  return maxNumeric + ((alphaValue - 1) * maxNumeric) + parseInt(numeric);
};

/**
 * Formats a label with prefix and suffix
 * 
 * @param prefix The label prefix
 * @param count The current count number
 * @param suffixLimit The digit limit for the suffix
 * @returns Formatted label string
 */
export const formatLabel = (prefix: string, count: number, suffixLimit: number): string => {
  const suffix = generateSuffix(count, suffixLimit);
  return `${prefix}${suffix}`;
};
