const jwt = require('jsonwebtoken');

/**
 * Handles operations relating to the JWYT middleware
 * @param {Object} jwtObj an object containing data to be used by the middleware - ex 
 *      { encryptionKey: 'snfjhuoen38nvuir',  secret: 'auh4h9h43n', repository: core.Repository}
 */
module.exports = (jwtObj) => {

    function sendInvalidToken(response) {
        return response.status(401).json({error: "Invalid token"});
    }

    return {

        /**
         * Middleware that decrypts the token in the request header and 
         * adds a decrypted token to the request header
         */
        decrypt: (req, res, next) => {
            if (!req.headers._token || !jwtObj.encryptionKey) {
                res.status(401).json({ error: 'Token is required' });
            } else {
                try{
                    let Crypto = require('../index').Crypto;
                    let decryptedToken = Crypto.decrypt(jwtObj.encryptionKey, req.headers._token);
                    if (!decryptedToken) {
                        return sendInvalidToken(res);
                    }
                    req.captain = {};
                    req.captain._decryptedToken = decryptedToken;
                    next();
                } catch(e) {
                    return sendInvalidToken(res);
                }
            }
        },

        /**
         * Middleware that verifys that the decrypted token is authentic
         */
        verifyToken: (req, res, next) => {
            if (!req.captain._decryptedToken || !jwtObj.secret) {
                res.status(401).json({ error: 'Token is required' });
            } else {
                try{
                    let user = jwt.verify(req.captain._decryptedToken, jwtObj.secret);
                    if (typeof(user) == "object" && user !== null) {
                        if ('id' in user) {
                            req.auth = user;
                            next();
                        } else {
                            return sendInvalidToken(res);
                        }
                    } else {
                        return sendInvalidToken(res);
                    }
                } catch(e) {
                    return sendInvalidToken(res);
                }
            }
        },

        /**
         * Middleware that verifies that the User actually exists
         */
        verifyUser: (req, res, next) => {
            if (!jwtObj.repository) {
                return sendInvalidToken(res);
            }
            jwtObj.repository.getOne({ _id: req.auth.id }, '')
            .then((user) => {
                if (typeof(user) == "object" && user !== null) {
                    if ('id' in user) {
                        req.user = user;
                        next();
                    } else {
                        return sendInvalidToken(res);
                    }
                } else {
                    return sendInvalidToken(res);
                }
            }, (err) => {
                return sendInvalidToken(res);
            })
            .catch((err) => {
                return sendInvalidToken(res);
            });
        }
    };
};