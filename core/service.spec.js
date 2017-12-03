const {assert} = require('chai');
const {Service} = require('../index');
const {Logger} = require('../index');

describe('core.Service', () => {

    let service; // The test service

    before(function () {
        service = new Service({
            name : "TestService",
            port : 3004
        }, new Logger("Service Test"));
    });

    describe('#start()', () => {
        
        it('should start the service', function (done) {
            
            service.start(() => {
                assert.isTrue(true);
                done();
            });
        });
    });

    describe('#stop()', () => {
        
        it('should stop the service', () => {
            service.stop()
            .then(() => assert.isTrue(true));
        });
    });
});