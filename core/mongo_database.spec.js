const {assert} = require('chai');
const {MongoDatabase} = require('../index');
const FakeLogger = require('../test/mocks/utils.fake_logger');

describe('core.MongoDatabase', () => {

    let database;

    beforeEach(() => {
        database = new MongoDatabase(
            { database: 'test-db' },
            new FakeLogger("MongoDB Test")
        );
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
            assert.match(connectionString, /^mongodb:\/\/username:password@example.com:27017\/testdb$/);
        });

        it('should return a localhost connection string', () => {

            let connectionString = database.objectToString({
                database: "testdb2",
                host: '127.0.0.1',
                port: 27017
            });
            assert.match(connectionString, /^mongodb:\/\/127\.0\.0\.1:27017\/testdb2$/);
        });
    });
});