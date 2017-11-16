const {Service} = require('../index');
const {Logger} = require('../index');

describe('core.Service', () => {

    let service; // The test service

    before(() => {
        service = new Service({
            name : "TestService",
            port : 3004
        }, new Logger("Service Test") );
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