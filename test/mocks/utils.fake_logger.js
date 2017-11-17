/**
 * This is meant to simulate logging but does no actual logging.
 * It is used for testing to avoid console logs 'clogging' the terminal
 */

const {Logger} = require('../../index');

module.exports = class FakeLogger extends Logger {

    /**
     * Creates a debug log
     * @param {*Any} data - the data to log
     * @param {*String} tag - the log tag 
     */
    debug(data, tag) {}

    /**
     * Creates an app warning log
     * @param {*Any} data - the data to log 
     * @param {*String} tag - the log tag
     */
    warn(data, tag) {}

    /**
     * Creates an app error log
     * @param {*Any} data - the data to log 
     * @param {*String} tag - the log tag
     */
    error(data, tag) {}

    /**
    * Creates a trace log
    * @param {*Any} data - the data to log
    * @param {*String} tag - the log tag 
    */
    trace(data, tag) {}
};