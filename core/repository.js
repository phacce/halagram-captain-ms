/**
 * This class is a base Repository class which contain common operations in a repository
 * such as CRUD
 */

module.exports = class Repository {

    /**
     * @param {Object} dataSource the dataSource to operate on
     */
    constructor(dataSource) {
        this.dataSource = dataSource;
    }

    /**
     * @param {Object} obj - the dataSource object
     * @returns a Promise with a resolve of user or a rejection error
     */
    add(obj) {
        return this.dataSource.create(obj);
    }

    /**
     * @param {Object} params - the filter parameters
     * @param {String} projection - fields to fetch
     * @returns a Promise with a resolve of user or a rejection error
     */
    getOne(params, projection) {
        return this.dataSource.findOne(params, projection);
    }

    /**
     * @param {Object} params - the filter parameters
     * @param {String} projection - fields to fetch
     * @returns a Promise with a resolve of users or a rejection error
     */
    getAll(params, projection) {
        return this.dataSource.find(params, projection);
    }

    /**
     * @param {Object} params - the filter parameters
     * @param {Object} newObj - the new object to update the old one
     * @returns a Promise with a resolve of user or a rejection error
     */
    edit(params, newObj) {
        return this.dataSource.update(params, newObj);
    }

    /**
     * @param {Object} params - the filter parameters
     * @returns a Promise with a resolve of user or a rejection error
     */
    delete(params) {
        return this.dataSource.remove(params);
    }
};