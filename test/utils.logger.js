const {assert} = require('chai');
const {Logger} = require('../index');

describe('utils.Logger', () => {

    let logger; // the console logger
    const tag = "Test Logger"; // the log tag

    beforeEach(() => {
        logger = new Logger(tag);
    });

    /**
     * @param {*Function} f the function to call to monitor log
     * @param {*String} message the message to log
     * @returns true if the specified message is contained in the log
     */
    function isMessageLogged(f, message) {
        let defaultLogger = console.log;
        let result;
        console.log = (msg) => {
            result = msg.match(message);
        };
        f();
        console.log = defaultLogger;
        return result;
    }

    describe('#debug()', () => {
        it('should log a value', () => {
            let testValue = "debug text";
            let result = isMessageLogged(() => {
                logger.debug(testValue);
            }, testValue);
            assert.isNotNull(result);
        });

        it('should use the default tag', () => {
            let testValue = "debug text";
            let result = isMessageLogged(() => {
                logger.debug(testValue);
            }, tag);
            assert.isNotNull(result);
        });

        it('should use a custom tag name', () => {
            let testValue = "debug text with custom tag";
            let customTag = "Custom Debug Tag";
            let result = isMessageLogged(() => {
                logger.debug(testValue, customTag);
            }, customTag);
            assert.isNotNull(result);
        });
    });

    describe('#warn()', () => {
        it('should log a value', () => {
            let testValue = "warn text";
            let result = isMessageLogged(() => {
                logger.warn(testValue);
            }, testValue);
            assert.isNotNull(result);
        });

        it('should use the default tag', () => {
            let testValue = "warn text";
            let result = isMessageLogged(() => {
                logger.warn(testValue);
            }, tag);
            assert.isNotNull(result);
        });

        it('should use a custom tag name', () => {
            let testValue = "warn text with custom tag";
            let customTag = "Custom Warn Tag";
            let result = isMessageLogged(() => {
                logger.warn(testValue, customTag);
            }, customTag);
            assert.isNotNull(result);
        });
    });

    describe('#error()', () => {
        it('should log a value', () => {
            let testValue = "error text";
            let result = isMessageLogged(() => {
                logger.error(testValue);
            }, testValue);
            assert.isNotNull(result);
        });

        it('should use the default tag', () => {
            let testValue = "error text";
            let result = isMessageLogged(() => {
                logger.error(testValue);
            }, tag);
            assert.isNotNull(result);
        });

        it('should use a custom tag name', () => {
            let testValue = "error text with custom tag";
            let customTag = "Custom Error Tag";
            let result = isMessageLogged(() => {
                logger.error(testValue, customTag);
            }, customTag);
            assert.isNotNull(result);
        });
    });

    describe('#trace()', () => {
        it('should log a value', () => {
            let testValue = "trace text";
            let result = isMessageLogged(() => {
                logger.trace(testValue);
            }, testValue);
            assert.isNotNull(result);
        });

        it('should use the default tag', () => {
            let testValue = "trace text";
            let result = isMessageLogged(() => {
                logger.trace(testValue);
            }, tag);
            assert.isNotNull(result);
        });

        it('should use a custom tag name', () => {
            let testValue = "trace text with custom tag";
            let customTag = "Custom Trace Tag";
            let result = isMessageLogged(() => {
                logger.trace(testValue, customTag);
            }, customTag);
            assert.isNotNull(result);
        });
    });
});