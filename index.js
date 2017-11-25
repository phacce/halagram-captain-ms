/**
 * This file exports all necessary classes in this module for easy accessibility
 */

module.exports = {
    /**
     * The core files
     */
    MongoDatabase : require('./core/mongo_database'),
    MongooseDataSource : require('./core/mongoose_data_source'),
    Repository: require('./core/repository'),
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
    JWT: require('./middleware/jwt'),
    Validator : require('./middleware/validator')
};