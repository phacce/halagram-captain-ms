const {assert} = require('chai');
const {Service} = require('../index');
const FakeLogger = require('../test/mocks/utils.fake_logger');

describe('core.Service', () => {

    let service; // The test service

    before(function () {
        service = new Service({
            name : "TestService",
            port : 3004
        }, new FakeLogger("Service Test"));
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