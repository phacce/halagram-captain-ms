const Assert = require('assert');
const {Service} = require('../index');
const {Logger} = require('../index');

describe('Service', () => {

    let service; // The test service

    before(() => {
        service = new Service({
            name : "TestService",
            port : 3004,
            logger : new Logger("Test Service")
        });
    });

    it('should start the service', () => {
        service.start(() => {
            Assert.equal(true);
        });
    });

    it('should stop the service', () => {
        service.stop();
    });
});