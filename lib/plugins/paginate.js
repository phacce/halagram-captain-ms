/**
* Contains the populate wrapper for a mongoose model
*/
const safe = require('../../index').safe;

module.exports = (defaults) => {
    return (schema, options)=>{
        schema.query.paginate = function(arr){ // [skip, limit]
            arr = safe.array(arr, defaults);
            return this.skip(arr[0]).limit(arr[1]);
        }
    }
};