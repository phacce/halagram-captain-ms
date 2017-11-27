const {assert} = require('chai');
const {Crypto} = require('../../index');

describe('utils.Crypto', () => {
    
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

    describe('#encrypt()', () => {

        it('should encrypt a text', () => {

            let text = 'hello captain';
            let encrypted = Crypto.encrypt('my-0-long-key78276', text);
            assert.notEqual(text, encrypted);
            assert.notEqual(text.length, encrypted.length);
        });
    });

    describe('#encrypt()', () => {
        
        it('should encrypt and decrypt an object', () => {

            let obj = {
                name: 'captain',
                city: 'earth :-)'
            };
            let key = 'my-0-long-key78276-another';
            let encrypted = Crypto.encrypt(key, obj);
            let decrypted = Crypto.decrypt(key, encrypted);
            assert.deepEqual(obj, decrypted);
        });
    });
});