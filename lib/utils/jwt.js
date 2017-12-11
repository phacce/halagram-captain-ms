const jwt = require('jsonwebtoken');

module.exports = class JWT {
//what if we want to sign more than just ID???

    static getToken(obj, secret, encryptionKey) {
        let token = jwt.sign({ id : obj.id }, secret);
        token = require('../../index').Crypto.encrypt(encryptionKey, token);
        return Object.assign({}, obj._doc, { token: token });
    }
};