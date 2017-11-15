const Assert = require('assert');
const {Service} = require('../index');

describe('Service', () => {

    let service; // The test service

    before(() => {
        service = new Service({
            name : "TestService",
            port : 3004
        }, null /* a logger is not given as it is an independent object */ );
    });

    describe('#start()', () => {
        
        it('should start the service', () => {
            service.start();
        });
    });

    describe('#stop()', () => {
        
        it('should stop the service', () => {
            service.stop();
        });
    });
});