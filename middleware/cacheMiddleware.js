const responseCache = {};
const productCache = {};
const CACHE_LIFETIME_MS = 60 * 1000;

const cacheMiddleware = (request, response, continueRequest) => {
    const cacheKey = request.originalUrl || request.url;
    const cacheEntry = responseCache[cacheKey];
    const currentTime = Date.now();

    if (cacheEntry && currentTime - cacheEntry.createdAt < CACHE_LIFETIME_MS) { // cache-hit
        response.set('X-Cache', 'HIT');
        return response.json(cacheEntry.data);
    }

    const sendJson = response.json.bind(response);
    response.json = (responseBody) => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
            responseCache[cacheKey] = {
                data: responseBody,
                createdAt: Date.now()
            };
        }
        response.set('X-Cache', 'MISS');
        return sendJson(responseBody);
    };

    continueRequest();
};

const itemCacheMiddleware = (request, response, continueRequest) => {
    const productId = request.params.id;
    const cacheEntry = productCache[productId];
    const currentTime = Date.now();

    if (cacheEntry && currentTime - cacheEntry.createdAt < CACHE_LIFETIME_MS) { // cache-hit
        response.set('X-Cache', 'HIT');
        return response.json(cacheEntry.data);
    }

    const sendJson = response.json.bind(response);
    response.json = (responseBody) => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
            productCache[productId] = {
                data: responseBody,
                createdAt: Date.now()
            };
        }
        response.set('X-Cache', 'MISS');
        return sendJson(responseBody);
    };

    continueRequest();
};

const clearCache = (productId) => {
    for (const cacheKey in responseCache) {
        delete responseCache[cacheKey];
    }
    if (productId !== undefined) {
        delete productCache[productId];
    } else {
        for (const cacheKey in productCache) {
            delete productCache[cacheKey];
        }
    }
};

module.exports = {
    cacheMiddleware,
    itemCacheMiddleware,
    clearCache
};
