const {expect} = require('chai');
const {Logger} = require('../index');
require('mocha-sinon');

describe('utils.Logger', () => {
    
    let logger; // the console logger
    const tag = "Test Logger"; // the log tag

    describe('#debug()', () => {

        let debugText = 'some long debug text';

        beforeEach(function () {
            logger = new Logger(tag);
            logger.debug = this.sinon.spy(); // to supress console log
        });

        it('should log a debug value', () => {
            logger.debug(debugText, "some tag");
            expect(logger.debug.calledOnce).to.be.true;
            expect(logger.debug.calledWith(debugText)).to.be.true;
        });

        it('should use the default tag', () => {
            logger.debug(debugText);
            expect(logger.debug.calledOnce).to.be.true;
            expect(logger.debug.calledWithExactly(debugText)).to.be.true;
        });

        it('should use a custom tag name', () => {
            logger.debug(debugText, "Custom debug tag");
            expect(logger.debug.calledOnce).to.be.true;
            expect(logger.debug.calledWith(debugText, 'Custom debug tag')).to.be.true;
        });
    });

    describe('#warn()', () => {

        let warnText = 'some long warning text';

        beforeEach(function () {
            logger = new Logger(tag);
            logger.warn = this.sinon.spy(); // to supress console log
        });

        it('should log a warning text', () => {
            logger.warn(warnText);
            expect(logger.warn.calledOnce).to.be.true;
            expect(logger.warn.calledWith(warnText)).to.be.true;
        });

        it('should use the default tag', () => {
            logger.warn(warnText);
            expect(logger.warn.calledOnce).to.be.true;
            expect(logger.warn.calledWithExactly(warnText)).to.be.true;
        });

        it('should use a custom tag name', () => {
            logger.warn(warnText, "Custom warning tag");
            expect(logger.warn.calledOnce).to.be.true;
            expect(logger.warn.calledWith(warnText, 'Custom warning tag')).to.be.true;
        });
    });

    describe('#error()', () => {
        
        let errorText = 'some long error text';

        beforeEach(function () {
            logger = new Logger(tag);
            logger.error = this.sinon.spy(); // to supress console log
        });

        it('should log an error message', () => {
            logger.error(errorText);
            expect(logger.error.calledOnce).to.be.true;
            expect(logger.error.calledWith(errorText)).to.be.true;
        });

        it('should use the default tag', () => {
            logger.error(errorText);
            expect(logger.error.calledOnce).to.be.true;
            expect(logger.error.calledWithExactly(errorText)).to.be.true;
        });

        it('should use a custom tag name', () => {
            logger.error(errorText, "Custom error tag");
            expect(logger.error.calledOnce).to.be.true;
            expect(logger.error.calledWith(errorText, 'Custom error tag')).to.be.true;
        });
    });

    describe('#trace()', () => {
        
        let traceText = 'some long text to trace';

        beforeEach(function () {
            logger = new Logger(tag);
            logger.trace = this.sinon.spy(); // to supress console log
        });

        it('should log some trace', () => {
            logger.trace(traceText);
            expect(logger.trace.calledOnce).to.be.true;
            expect(logger.trace.calledWith(traceText)).to.be.true;
        });

        it('should use the default tag', () => {
            logger.trace(traceText);
            expect(logger.trace.calledOnce).to.be.true;
            expect(logger.trace.calledWithExactly(traceText)).to.be.true;
        });

        it('should use a custom tag name', () => {
            let traceTag = 'Custom trace tag';
            logger.trace(traceText, traceTag);
            expect(logger.trace.calledOnce).to.be.true;
            expect(logger.trace.calledWith(traceText, traceTag)).to.be.true;
        });
    });
});