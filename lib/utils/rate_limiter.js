/**
 * Utility class to exports a rate limiter object for use as a middleware
 */

const ExpressBrute = require('express-brute');
const RedisStore = require('express-brute-redis');

/**
 * 
 * @param {Object} config the configuration object for the limiter
 * format of config:
 * {
 *  environment: 'development' || 'production',
 *  host: eg '127.0.0.1',
 *  port: 6379,
 *  freeRetries: 10,
 *  minWait: 9000,
 *  maxWait: 20000,
 *  lifetime: 24*60*60
 * }
 * 
 * @returns a rate limiter object
 */
module.exports = (config) => {

    // The memory store to use
    let store;
    if (config.environment == 'development') {
        store = new ExpressBrute.MemoryStore();
    } else {
        store = new RedisStore({
            host: config.host,
            port: config.port
        });
    }

    return new ExpressBrute(store, {
        freeRetries: config.freeRetries || 1000, // number of requests before delay starts applying
        attachResetToRequest: true,
        refreshTimeoutOnRequest: false,
        minWait: config.minWait || (2 * 1000), // milliseconds
        maxWait: config.maxWait || (10 * 1000), // milliseconds
        lifetime: config.lifetime || (24 * 60 * 60) // (seconds not milliseconds)
    });
};