const jwt = require('jsonwebtoken');

module.exports = class JWT {

    static getToken(obj, secret, encryptionKey) {
        let token = jwt.sign(obj, secret);
        token = require('../../index').Crypto.encrypt(encryptionKey, token);
        return Object.assign({}, obj._doc, { token: token });
    }
};