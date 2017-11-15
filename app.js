const app = require('express')();
const {Logger} = require('./index');
const {Crypto} = require('./index');

logger = new Logger("Captain init");

app.listen(process.env.PORT || 3004, (err) => {
    if (err) return console.log(err);
    
    logger.debug('-------------------');
    logger.debug("Server is listening");
    logger.debug('-------------------');

    testCryptoHasher();

    testCryptoCompare();
});

function testCryptoHasher() {
    Crypto.hash("Hello", 10)
    .then((hash) => {
        logger.debug(hash, "Crypto Hash");
    }, (err) => {
        logger.error(err, "Crypto Hash");
    })
    .catch((err) => {
        logger.error(err, "Crypto Hash");
    });
}

function testCryptoCompare() {
    Crypto.compare("Hello", "$2a$10$6oXOU5YkY5724PYnNa4/eOu3oadk7ooacrOd91iKE6ebkUuWhG0mS")
    .then((same) => {
        logger.debug(`Text match is ${same}`, "Crypto Compare");
    }, (err) => {
        logger.error(err, "Crypto Compare");
    })
    .catch((err) => {
        logger.error(err, "Crypto Compare");
    });
}