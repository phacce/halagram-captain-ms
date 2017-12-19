const assert = require('chai').assert;
const { safe } = require('../../index');

describe('utils.Safe', () => {

    describe('#array()', () => {
        
        it ('should return a non-empty array', () => {

            let data = ['c', 'a', 'p', 't', 'a', 'i', 'n'];
            let result = safe.array(data);
            assert.isArray(result);
            assert.isNotEmpty(result);
        });

        it ('should turn a string to an Array', () => {
            
            let data = 'Captain Nimitz';
            let result = safe.array(data, [], true);
            assert.isArray(result);
            assert.isNotEmpty(result);
        });

        it ('should return an empty array', () => {
            
            let data = 'some funny short stuff';
            let result = safe.array(data);
            assert.isArray(result);
            assert.isEmpty(result);
        });
     });

     describe('#object()', () => {
        
        it ('should return a non-empty array', () => {

            let data = ['c', 'a', 'p', 't', 'a', 'i', 'n'];
            let result = safe.array(data);
            assert.isArray(result);
            assert.isNotEmpty(result);
        });

        it ('should return a non-empty obect', () => {
            
            let data = {
                name: 'Captain',
                language: 'Javascript'
            };
            let result = safe.object(data);
            assert.isObject(result);
            assert.isNotEmpty(result);
        });

        it ('should return an empty object', () => {
            
            let data = 'another unfunny loooong stuff';
            let result = safe.object(data);
            assert.isObject(result);
            assert.isEmpty(result);
        });
     });

     describe('#toArray()', () => {

        it('should turn a string to an array', () => {

            let data = 'another unfunny loooong stuff';
            let result = safe.array(data);
            assert.isArray(result);
            assert.isEmpty(result); 
        });
     });
});