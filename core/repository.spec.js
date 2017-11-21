const {assert} = require('chai');
const {Repository} = require('../index');
const FakeDataSource = require('../test/mocks/core.fake_data_source');

describe('core.Repository', () => {

    let repository;

    beforeEach(() => {
        repository = new Repository(new FakeDataSource('Test Fake Model'));
    });

    describe('#add()', () => {

        it('should return a newly stored item', () => {

            let obj = { id: 1, name: "Leo"};
            repository.add(obj)
            .then((item) => {
                assert.isNotNull(item);
            })
            .catch((err) => {
                assert.isNotOk(err, 'Promise error');
            });
        });

        it('should store a new item', () => {
            
            let obj = { id: 32, name: "Jane Doe"};

            // first, add an item
            repository.add(obj)
            .then((item) => {
                // then return the existing item
                return repository.getOne({ id: 32 });
            })
            .then((data) => {
                assert.isNotNull(data);
            }, (err) => {
                assert.isNotOk(err, 'Error finding item');
            })
            .catch((err) => {
                assert.isNotOk(err, 'Promise error');
            });
        });
    });

    describe('#getOne()', () => {

        it('should return one item', () => {

            let obj = { id: 32, name: "Jane Doe"};

            // first, add an item to the source
            repository.add(obj)
            .then((item) => {
                // retrieve the added item
                return repository.getOne({ id:32 });
            })
            .then((data) => {
                assert.isNotNull(data);
            }, (err) => {
                assert.isNotOk(err, 'Error getting item');
            })
            .catch((err) => {
                assert.isNotOk(err, 'Promise error');
            });
        });
    });

    describe('#getAll()', () => {

        it('should return all items that have a category of fruit', () => {
            
            let item1 = { id: 1, name: 'Apple', category: 'fruit' },
                item2 = { id: 2, name: 'HP', category: 'computing' },
                item3 = { id: 3, name: 'Guava', category: 'fruit' };

            // first, add some items to the source
            repository.add(item1) // #item1
            .then(res => {return repository.add(item2)}) // #item2
            .then(res => repository.add(item3)) // #item3
            // then, retrieve items by category
            .then(res => repository.getAll({ category: 'fruit' }, null))
            .then((items) => {
                assert.isNotNull(items);
            }, (err) => {
                assert.isNotOk('Promise error', err);
            })
            .catch((err) => {
                assert.isNotOk(err, 'Promise Error');
            });
        });
    });

    describe('#edit()', () => {
        
        it('should modify an exiting item name', () => {
            
            let item = { id: 10, name: 'Apple', category: 'fruit' };

            // first, add an item
            repository.add(item)
            // then, modify the added item
            .then(res => repository.edit({ id: 10 }, { name: 'Orange' }))
            .then((freshItem) => {
                assert.equal('Orange', freshItem.name);
            }, (err) => {
                assert.isNotOk('Promise error', err);
            })
            .catch((err) => {
                assert.isNotOk(err, 'Promise Error');
            });
        });
    });

    describe('#delete()', () => {
        
        it('should remove an existing item from the data source', () => {
            
            let item = { id: 15, name: 'Pear', category: 'fruit' };

            // add an item to be deleted
            repository.add(item)
            // delete the added item using the id
            .then(res => repository.delete({ id: res.id }))
            .then((removed) => {
                assert.isNotNull(removed);
            }, (err) => {
                assert.isNotOk('Promise error', err);
            })
            .catch((err) => {
                assert.isNotOk(err, 'Promise Error');
            });
        });
    });
});