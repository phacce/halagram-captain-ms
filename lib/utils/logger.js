/**
 *  This class is the console implementation of the app logger
 */

module.exports = class Logger {

    /**
     * @param {*String} tag - the log identifier 
     */
    constructor(tag) {
        this.tag = tag;
        this.yellow = "\x1b[33m%s\x1b[0m";
        this.red = "\x1b[31m%s\x1b[0m";
    }

    /**
     * Creates a debug log
     * @param {*Any} data - the data to log
     * @param {*String} tag - the log tag 
     */
    debug(data, tag) {
        let logTag = (tag == undefined) ? this.tag : tag;
        console.log(`${logTag} [${new Date().toLocaleString()}]: ${data}`);
    }

    /**
     * Creates an app warning log
     * @param {*Any} data - the data to log 
     * @param {*String} tag - the log tag
     */
    warn(data, tag) {
        let logTag = (tag == undefined) ? this.tag : tag;
        console.log(this.yellow, `${logTag} [${new Date().toLocaleString()}]: ${data}`);
    }

    /**
     * Creates an app error log
     * @param {*Any} data - the data to log 
     * @param {*String} tag - the log tag
     */
    error(data, tag) {
        let logTag = (tag == undefined) ? this.tag : tag;
        console.log(this.red, `${logTag} [${new Date().toLocaleString()}]: ${data}`);
    }

    /**
    * Creates a trace log
    * @param {*Any} data - the data to log
    * @param {*String} tag - the log tag 
    */
    trace(data, tag) {
        let logTag = (tag == undefined) ? this.tag : tag;
        console.log(`${logTag} [${new Date().toLocaleString()}]: ${data}`);
    }
};