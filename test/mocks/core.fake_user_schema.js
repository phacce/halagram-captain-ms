/**
 * For use in the mongoose_data_source test file
 */

const mongoose = require('mongoose');
mongoose.Promise = Promise;

module.exports = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
        default: "Nigeria"
    },
    friends: [{type: mongoose.Schema.Types.ObjectId, ref:'User'}],
    enemies : [{type: mongoose.Schema.Types.ObjectId, ref:'User'}],
    like :[{
        time : {'type': Date, 'default': Date.now},
        person : {type: mongoose.Schema.Types.ObjectId, ref:'User'}
    }]
});