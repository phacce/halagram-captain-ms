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