const {assert} = require('chai');
const {Crypto} = require('../index');

describe('Crypto', () => {
    
    describe('#hash()', () => {
        
        it('should hash a text',  () => {
            Crypto.hash("hello", 10)
            .then((hash) => {
                assert.match(hash, /^\$2/, 'regex match');
            })
            .catch((err) => {
                assert.isNotOk(err, "Promise error");
            });
        });
    });

    describe('#compare()', () => {

        it('compares a text to a hash', () => {
            // Hash the text first
            Crypto.hash("password", 10)
            .then((hash) => {
                // Use the computed hash for comparism
                return Crypto.compare("password", hash);
            })
            .then((same) => {
                assert.isTrue(same);
            })
            .catch((err) => {
                assert.isNotOk(err, "Promise error");
            });
        });
    });
});