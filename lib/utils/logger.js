/**
 *  This class is the console implementation of the app logger
 */

module.exports = class Logger {

    /**
     * @param {*String} tag - the log identifier 
     */
    constructor(tag, env) {
        this.tag = tag;
        this.env = env;
    }

    /**
     * Creates a debug log
     * @param {Any} data - the data to log
     * @param {String} tag - the log tag 
     */
    debug(data, tag) {
        if (this.env != 'development') return;

        let logTag = (tag == undefined) ? this.tag : tag;
        console.log(`${logTag} [${new Date().toLocaleString()}]: ${data}`);
    }

    /**
     * Creates an app success log
     * @param {Any} data - the data to log 
     * @param {String} tag - the log tag
     */
    success(data, tag) {
        if (this.env != 'development') return;

        let logTag = (tag == undefined) ? this.tag : tag;
        let greenColor = "\x1b[32m%s\x1b[0m";
        console.warn(greenColor, `${logTag}`, `[${new Date().toLocaleString()}]: ${data}`);
    }

    /**
     * Creates an app warning log
     * @param {Any} data - the data to log 
     * @param {String} tag - the log tag
     */
    warn(data, tag) {
        if (this.env != 'development') return;

        let logTag = (tag == undefined) ? this.tag : tag;
        let yellowColor = "\x1b[33m%s\x1b[0m";
        console.warn(yellowColor, `${logTag}`, `[${new Date().toLocaleString()}]: ${data}`);
    }

    /**
     * Creates an app error log
     * @param {Any} data - the data to log 
     * @param {String} tag - the log tag
     */
    error(data, tag) {
        if (this.env != 'development') return;

        let logTag = (tag == undefined) ? this.tag : tag;
        let redColor = "\x1b[31m%s\x1b[0m";
        console.error(redColor, `${logTag}`, `[${new Date().toLocaleString()}]: ${data}`);
    }

    /**
    * Creates a trace log
    * @param {Any} data - the data to log
    * @param {String} tag - the log tag 
    */
    trace(data, tag) {
        if (this.env != 'development') return;
        
        let logTag = (tag == undefined) ? this.tag : tag;
        console.trace(`${logTag} [${new Date().toLocaleString()}]: ${data}`);
    }
};