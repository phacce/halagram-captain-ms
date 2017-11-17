const {assert} = require('chai');
const {MongoDatabase} = require('../index');
const FakeLogger = require('./mocks/utils.fake_logger');

describe('core.MongoDatabase', () => {

    let database;

    before(() => {
        database = new MongoDatabase(
            { database: 'test-db' },
            new FakeLogger("MongoDB Test")
        );
    });

    after(() => {
        database.close();
    });

    describe('#objectToString()', () => {

        it('should return a mongodb connection string', () => {

            let connectionString = database.objectToString({
                username: "username",
                password: "password",
                host: "example.com",
                port: 27017,
                database: "testdb"
            });
            assert.match(connectionString, /mongodb:\/\/username:password@example.com:27017\/testdb/);
        });
    });
});