/**
 * Just for testing yet
 */

const app = require('express')();
const {Logger} = require('./index');

logger = new Logger("Captain init");

app.listen(process.env.PORT || 3004, (err) => {
    if (err) return console.log(err);
    
    logger.debug('-------------------');
    logger.debug("Server is listening");
    logger.debug('-------------------');
});