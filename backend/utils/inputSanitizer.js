import mongoose from 'mongoose';

/**
 * Sanitizes user input to prevent NoSQL injection attacks
 * @param {any} input - The input to sanitize
 * @returns {any} - The sanitized input
 */
export function sanitizeInput(input) {
  if (input === null || input === undefined) {
    return input;
  }

  // If it's a string, check for potential NoSQL injection patterns
  if (typeof input === 'string') {
    // Remove potential MongoDB operators and JavaScript code
    return input.replace(/^\$/, '').replace(/^function\s*\(/, '').trim();
  }

  // If it's an object, recursively sanitize all properties
  if (typeof input === 'object' && !Array.isArray(input)) {
    const sanitized = {};
    for (const [key, value] of Object.entries(input)) {
      // Prevent MongoDB operator keys
      if (key.startsWith('$')) {
        continue; // Skip dangerous keys
      }
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }

  // If it's an array, sanitize each element
  if (Array.isArray(input)) {
    return input.map(item => sanitizeInput(item));
  }

  // For primitives (number, boolean), return as-is
  return input;
}

/**
 * Validates and sanitizes MongoDB ObjectId
 * @param {string} id - The ID to validate
 * @returns {string} - The validated ID
 * @throws {Error} - If the ID is invalid
 */
export function validateObjectId(id) {
  if (!id) {
    throw new Error('ID is required');
  }

  // Sanitize the input first
  const sanitizedId = sanitizeInput(id);
  
  if (typeof sanitizedId !== 'string') {
    throw new Error('ID must be a string');
  }

  // Check if it's a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(sanitizedId)) {
    throw new Error('Invalid ID format');
  }

  return sanitizedId;
}

/**
 * Sanitizes search query input to prevent regex injection
 * @param {string} searchQuery - The search query to sanitize
 * @returns {string} - The sanitized search query
 */
export function sanitizeSearchQuery(searchQuery) {
  if (!searchQuery || typeof searchQuery !== 'string') {
    return '';
  }

  // Remove potentially dangerous regex characters and MongoDB operators
  return searchQuery
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape regex special characters
    .replace(/^\$/, '') // Remove leading $ operators
    .trim()
    .substring(0, 100); // Limit length to prevent DoS
}

/**
 * Creates a safe MongoDB filter object
 * @param {Object} filters - The filter object to sanitize
 * @returns {Object} - The sanitized filter object
 */
export function createSafeFilter(filters = {}) {
  const safeFilter = {};
  
  for (const [key, value] of Object.entries(filters)) {
    // Skip potentially dangerous keys
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    
    // Sanitize the value
    safeFilter[key] = sanitizeInput(value);
  }
  
  return safeFilter;
}

/**
 * Creates a safe search filter for text fields
 * @param {string} searchTerm - The search term
 * @param {string[]} fields - The fields to search in
 * @returns {Object} - MongoDB $or query object
 */
export function createSafeSearchFilter(searchTerm, fields = []) {
  if (!searchTerm || !fields.length) {
    return {};
  }

  const sanitizedSearch = sanitizeSearchQuery(searchTerm);
  if (!sanitizedSearch) {
    return {};
  }

  // Create safe regex search
  const searchRegex = new RegExp(sanitizedSearch, 'i');
  
  return {
    $or: fields.map(field => ({
      [field]: { $regex: searchRegex }
    }))
  };
}

/**
 * Validates and sanitizes email input
 * @param {string} email - The email to validate
 * @returns {string} - The sanitized email
 * @throws {Error} - If the email is invalid
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    throw new Error('Email is required and must be a string');
  }

  const sanitizedEmail = sanitizeInput(email).toLowerCase().trim();
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitizedEmail)) {
    throw new Error('Invalid email format');
  }

  // Prevent extremely long emails (DoS protection)
  if (sanitizedEmail.length > 254) {
    throw new Error('Email is too long');
  }

  return sanitizedEmail;
}
