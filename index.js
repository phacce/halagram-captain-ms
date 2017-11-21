/**
 * This file exports all necessary classes in this module for easy accessibility
 */

module.exports = {
    /**
     * The core files
     */
    Controller : require('./core/controller'),
    MongooseDataSource : require('./core/mongoose_data_source'),
    MongoDatabase : require('./core/mongo_database'),
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
    Validator : require('./middleware/validator')  
};