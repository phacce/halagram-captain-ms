const {assert} = require('chai');
const {MongooseDataSource} = require('../index');
const FakeUserSchema = require('../test/mocks/core.fake_user_schema');
const MongoDatabase = require('./mongo_database');
const FakeLogger = require('../test/mocks/utils.fake_logger');

describe('core.MongooseDataSource', () => {

    let dataSource;
    let database;

    before(() => {
        database = new MongoDatabase({ database: "user-test" }, new FakeLogger("Mongo DS Test"));
        dataSource = new MongooseDataSource("FakeUser", FakeUserSchema, database);
    });

    after(() => {
        // clear the database to avoid data duplication
        dataSource.remove({}, true)
        .then((result) => {
            console.log("\t test database items deleted successfully");
            database.close();
        }, (err) => {
            console.log(`\t An error occurred deleting database items: ${err}`);
        })
        .catch((err) => {
            console.log(`\t Error deleting database items: ${err}`);
        });
    });


    describe('#create()', () => {
        it('should save a new user to the database', () => {
            dataSource.create({ name: "Leonard Aikay", city: "Umuahia" })
            .then((user) => {
                assert.isNotNull(user);
            }, (err) => {
                assert.isNotOk(err, 'Promise Rejection');
            })
            .catch((err) => {
                assert.isNotOk(err, 'Promise Error');
            });
        });
    });

    describe('#findOne()', () => {
        it('should create a user and also retrieve the details', () => {
            // add a user to the database first
            dataSource.create({ name: "someone", city: "Earth" })
            .then((user) => {
                // find and return the added user
                return dataSource.findOne({ name: user.name }, "");
            }, (err) => {
                assert.isNotOk(err, 'Promise Rejection');
            })
            .then((user) => {
                assert.equal(user.name, "someone");
            }, (err) => {
                assert.isNotOk(err, 'Promise Rejection');
            })
            .catch((err) => {
                assert.isNotOk(err, 'Promise Error');
            });
        });
    });

    describe('#find()', () => {
        it('should find and return all users in same city', (done) => {
            let users = [
                { name: "Leonard Aikay", city: "Lagos" },
                { name: "Oga-ifu Bestbrain", city: "Calabar" },
                { name: "Bill Gate", city: "Lagos" }
            ];

            // Add a user to the database first
            dataSource.create(users)
            .then((users) => {
                // find and return all users in the city of 'Lagos'
                return dataSource.find({ city: "Lagos" });
            }, (err) => {
                assert.isNotOk(err, 'Promise Rejection');
            })
            .then((users) => {
                done();
                // users in Lagos should not be less than 2
                assert.isAtLeast(users.length, 2, "Two users should be returned");
            }, (err) => {
                assert.isNotOk(err, 'Promise Rejection');
            })
            .catch((err) => {
                assert.isNotOk(err, 'Promise Error');
            });
        });
    });

    describe('#update()', () => {
        it('should create a user and change the city', (done) => {
            let user = { name: "Grace H", city: "Lagos" };

            // Add a user to the database first
            dataSource.create(user)
            .then((user) => {
                // change the user's city to Kenya
                return dataSource.update({ name: user.name }, { city: "Kenya" }, false);
            }, (err) => {
                assert.isNotOk(err, 'Promise Rejection');
            })
            .then((user) => {
                done();
                assert.equal("Kenya", user.city);
            }, (err) => {
                assert.isNotOk(err, 'Promise Rejection');
            })
            .catch((err) => {
                assert.isNotOk(err, 'Promise Error');
            });
        });

        it('should create multiple users and change their city', (done) => {
            let users = [
                { name: "aaAda L", city: "Lagos" },
                { name: "aaAdanna Tee", city: "Ogun" }
            ];

            // Add a user to the database first
            dataSource.create(users)
            .then((users) => {
                // change the users' city to Abuja
                return dataSource.update({ name: { $regex: /^aaAda/, $options: 'i'} }, { city: "Abuja" }, true);
            }, (err) => {
                assert.isNotOk(err, 'Promise Rejection');
            })
            .then((users) => {
                done();
                // Ensure all users now belong in Abuja
                users.forEach((user) => {
                    if (user.name.match(/a/)) {
                        assert.equal('Abuja', user.city);
                    }
                });
            }, (err) => {
                assert.isNotOk(err, 'Promise Rejection');
            })
            .catch((err) => {
                assert.isNotOk(err, 'Promise Error');
            });
        });
    });

    describe('#remove()', () => {
        it('should create a user and remove the same user', (done) => {
            let user = { name: "Jane Doe", city: "Unknown" };

            // first add the user to the database
            dataSource.create(user)
            .then((u) => {
                // now remove the user from the database
                return dataSource.remove(user, false);
            }, (err) => {
                assert.isNotOk(err, 'Promise Rejection');
            })
            .then((u) => {
                // try retrieving the user
                return dataSource.findOne(u);
            }, (err) => {
                assert.isNotOk(err, 'Promise Rejection');
            })
            .then((u) => {
                done();
                // not found
                assert.isNull(u);
            }, (err) => {
                assert.isNotOk(err, 'Promise Rejection');
            })
            .catch((err) => {
                assert.isNotOk(err, 'Promise Error');
            });
        });

        it('should create multiple users and remove them', (done) => {
            let users = [
                { name: "Jane Doe", city: "mouau" },
                { name: "John Doe", city: "mouau" }
            ];

            // first of all, add the user to the database
            dataSource.create(users)
            .then((u) => {
                // now remove the users from the database
                return dataSource.remove({ city: "mouau" }, true);
            }, (err) => {
                assert.isNotOk(err, 'Promise Rejection');
            })
            .then((u) => {
                // try fetching the users
                return dataSource.find({ city: "mouau" });
            }, (err) => {
                assert.isNotOk(err, 'Promise Rejection');
            })
            .then((u) => {
                done();
                // empty array of users
                assert.isEmpty(u);
            }, (err) => {
                assert.isNotOk(err, 'Promise Rejection');
            })
            .catch((err) => {
                assert.isNotOk(err, 'Promise Error');
            });
        });
    });
});