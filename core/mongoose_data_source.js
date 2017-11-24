/**
 * Wrapper class for a mongodb data source. Uses mongoose module basically for data access
 */

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = class MongoDataSource {

	/**
	 * @param {String} name the model name
	 * @param {mongoose.Schema} schema the mongoose schema
     * @param {core.Database} database the database to use
	 */
	constructor(name, schema, database){
        this.database = database.open(); // db connection instance
        this.model = this.database.model(name, schema);
	}

    /**
     * @param {Object} obj the object to insert to the db
     * @returns a new Promise
     */
    create(obj) {
        return new Promise((resolve, reject) => {
            this.model.create(obj, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    /**
     * Retrieves ONLY the first document matching the filter
     * @param {Object} params the filter object
     * @param {String} projection the fields to fetch or not
     * @returns a new Promise
     */
    findOne(params, projection) {
        return new Promise((resolve, reject) => {
            this.model.findOne(params)
            .select(projection)
            .exec((err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    /**
     * Retrieves more than one document if it is available
     * @param {Object} params the filter object
     * @param {String} projection the fields to fetch or not
     * @returns a new Promise
     */
    find(params, projection) {
        return new Promise((resolve, reject) => {
            this.model.find(params)
            .select(projection)
            .exec((err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    /**
     * Wrapper method to update documents
     * @param {Object} params the filter parameters in an object
     * @param {Object} newObj the updated data in an object
     * @param {Boolean} multiple true to update more than one field, else false
     * @returns a new Promise
     */
	update(params, newObj, multiple) {
        if (multiple) return this.updateMultiple(params, newObj);
        else return this.updateOne(params, newObj);
    }
    
    /**
     * Updates more than one document matching the filter
     * @param {Object} params the filter object
     * @param {Object} newObj the updated data in an object
     * @returns a new Promise 
     */
    updateMultiple(params, newObj) {
        return new Promise((resolve, reject) => {
            this.model.update(params, newObj, { multi: true }, (err, oldObj) => {
                if (err) reject(err);
                // get the updated documents
                this.find(params)
                .then((result) => {
                    resolve(result);
                }, (err) => {
                    reject(err);
                })
                .catch((err) => {
                    reject(err);
                });
            });
        });
    }

    /**
     * Updates ONLY the first document matching the filter
     * @param {Object} params the filter object
     * @param {Object} newObj the updated data in an object
     * @returns a new Promise 
     */
    updateOne(params, newObj) {
        return new Promise((resolve, reject) => {
            this.model.findOneAndUpdate(params, newObj, (err, oldObj) => {
                if (err) reject(err);
                // get the updated documents
                this.findOne(params)
                .then((result) => {
                    resolve(result);
                }, (err) => {
                    reject(err);
                })
                .catch((err) => {
                    reject(err);
                });
            });
        });
    }

    /**
     * Wrapper method to remove documents
     * @param {Object} params the filter object
     * @param {Boolean} multiple true to remove more than one document, else false
     * @returns a new Promise 
     */
    remove(params, multiple) {
        if (multiple) return this.removeMultiple(params);
        else return this.removeOne(params);
    }

    /**
     * Removes more than one document matching the filter
     * @param {Object} params the filter object
     * @returns a new Promise 
     */
    removeMultiple(params) {
        return new Promise((resolve, reject) => {
            this.model.remove(params, (err) => {
                if (err) reject(err);
                else resolve(true);
            });
        });
    }

    /**
     * Removes ONLY the first document matching the filter
     * @param {Object} params the filter object
     * @returns a new Promise 
     */
    removeOne(params) {
        return new Promise((resolve, reject) => {
            this.model.findOneAndRemove(params, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
};