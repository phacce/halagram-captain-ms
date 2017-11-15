/**
 * Wrapper class for performing hashes and encryptions
 * Uses the `bcrypt` node_module just yet
 */

const bcrypt = require('bcrypt');

module.exports = class Crypto {

    /**
     * Performs a hash on a text and returns the hashed text
     * @param {*String} text the text to hash
     * @param {*Number} salt the salt rounds 
     * @returns the hashed text if successful or an error (Promise)
     */
    static hash(text, salt) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(text, salt, (err, hash) => {
                if (err) reject(err);
                else resolve(hash);
            });
        });
    }

    /**
     * Compares a text to a hash value
     * @param {*String} raw the raw, unhashed text
     * @param {*String} hashed the hashed text
     * @returns if no errors, returns true if they match, else false.
     */
    static compare(raw, hashed) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(raw, hashed, (err, same) => {
                if (err) reject(err);
                else resolve(same);
            });
        });
    }
};