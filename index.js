/**
 * This file exports all necessary classes in this module for easy accessibility
 */

module.exports = {
    /**
     * The core files
     */
    Controller : require('./core/controller'),
    Model : require('./core/model'),
    MongoDatabase : require('./core/mongo_database'),
    Service : require('./core/service'),
    
    /**
     * The library files
     */
    Crypto : require('./lib/utils/crypto'),
    Logger : require('./lib/utils/logger'),

    /**
     * The middleware files
     */
    Cor : require('./middleware/cor'),
    JoiValidator : require('./middleware/joi_validator')  
};