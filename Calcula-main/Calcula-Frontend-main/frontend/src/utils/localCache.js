/**
 * Utility functions for managing LocalStorage safely.
 * Handles storage of any JSON-serializable data.
 */

// Prefix to avoid collisions with other apps on localhost
const CACHE_PREFIX = 'sensee_cache_';

/**
 * Save data to LocalStorage
 * @param {string} key - Unique key for the data
 * @param {any} value - Data to store (will be JSON stringified)
 */
export function saveToCache(key, value) {
  try {
    if (typeof window === 'undefined') return;
    const serialized = JSON.stringify(value);
    localStorage.setItem(CACHE_PREFIX + key, serialized);
  } catch (error) {
    console.warn('Error saving to cache:', error);
    // QuotaExceededError handling could go here
  }
}

/**
 * Load data from LocalStorage
 * @template T
 * @param {string} key - Unique key to retrieve
 * @returns {T | null} - Parsed data or null if not found/error
 */
export function loadFromCache(key) {
  try {
    if (typeof window === 'undefined') return null;
    const serialized = localStorage.getItem(CACHE_PREFIX + key);
    if (!serialized) return null;
    return JSON.parse(serialized);
  } catch (error) {
    console.warn('Error loading from cache:', error);
    return null;
  }
}

/**
 * Remove data from LocalStorage
 * @param {string} key - Unique key to remove
 */
export function removeFromCache(key) {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CACHE_PREFIX + key);
  } catch (error) {
    console.warn('Error removing from cache:', error);
  }
}
