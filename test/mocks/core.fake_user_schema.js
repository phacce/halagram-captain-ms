/**
 * For use in the mongoose_data_source test file
 */

const {Schema} = require('mongoose');

module.exports = new Schema({

    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
        default: "Nigeria"
    }
});