/**
* Contains the populate wrapper for a mongoose model
*/
const safe = require('../../index').safe;

module.exports = (defaults) => {
    return (schema, options) => {
        schema.query.doPopulate = function(arr) {
            arr =  safe.array(arr, defaults);
            return this.populate(arr);
        };
    };
};