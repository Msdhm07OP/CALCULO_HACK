import { saveToCache, loadFromCache } from './localCache';

/**
 * Fetches data from an API with offline fallback.
 * Strategy: Network First -> Save to Cache.
 *           If Network Fails -> Load from Cache.
 * 
 * @template T
 * @param {string} cacheKey - Unique key for caching this specific response
 * @param {() => Promise<T>} apiCall - A function that returns a Promise (the actual API call)
 * @param {Object} options - Optional config
 * @param {boolean} options.returnCacheOnFailure - If true, returns cached data on error. Default: true.
 * @returns {Promise<T>} - The data from network or cache
 */
export async function fetchWithCache(cacheKey, apiCall, options = {}) {
    const { returnCacheOnFailure = true } = options;

    try {
        // 1. Try Network
        const data = await apiCall();

        // 2. If successful, update cache
        if (data) {
            saveToCache(cacheKey, data);
        }

        return data;
    } catch (error) {
        console.warn(`Network request failed for ${cacheKey}, checking cache...`);

        // 3. If Network fails, try Cache
        if (returnCacheOnFailure) {
            const cachedData = loadFromCache(cacheKey);
            if (cachedData) {
                // Optionally wrap in an object to indicate it's cached, 
                // but for transparency we return exact data shape.
                return cachedData;
            }
        }

        // 4. If neither works, throw original error
        throw error;
    }
}

/**
 * Loads cached data immediately (synchronous-like) if available.
 * Useful for initial render states before API call resolves.
 * @param {string} cacheKey 
 */
export function getInitialCache(cacheKey) {
    return loadFromCache(cacheKey);
}

export { saveToCache, loadFromCache, removeFromCache } from './localCache';
