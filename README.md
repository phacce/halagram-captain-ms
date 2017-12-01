# A Simple Node.js Microservice Module
[![NPM Version](https://img.shields.io/npm/v/@halagram/captain-ms.svg?style=flat)](https://www.npmjs.org/package/commander)
[![NPM Downloads](https://img.shields.io/npm/dm/@halagram/captain-ms.svg?style=flat)](https://www.npmjs.org/package/commander)

Captain-MS which means Captain MicroService is a simple module which provides a basic setup for a microservice project.

## Installation
```
npm install @halagram/captain-ms --save
```
Optionally, you can also install the [CLI tool](https://www.npmjs.com/package/@halagram/captain-ms-cli) for setting up Services easily using
```
npm install -g @halagram/captain-ms-cli
```

## Creating a Service

```js
    const captain = require('@halagram/captain-ms'); // require the module
    
    // instantiate the service
    let service = new captain.Service({
        name: "App Service",
        port: 3000
    }, new captain.Logger('AppServiceTag') /** An app logger instance **/);

    // create a router
    let router = require('express').Router();
    router.all('/greet', (req, res) => {
        res.send('Hello Captain!');
    });

    // set the service routes. This is produces app.use('/key', value);
    service.setRoutes({
        '': router
    });

    // start the service
    service.start();
```
### You can also enable JWT for a router

```js
    service.enableJWT({
        encryptionKey: password,
        secret: secret,
        repository: repo // see more on creating a repository below
    });

    service.start();
```

### Also, you can limit requests from same IPs

```js
    service.enableRateLimiter({ 
        host: '127.0.0.1',
        port: 6379,
        environment: 'development',
        freeRetries: 2, // number of requests before delays
        minWait: 10 * 1000, // 10 seconds
    });

    service.start();
```

### File upload middlewares

File uploads are done as middlewares and throws errors if any occurs

```js
    router.post('/upload', captain.Validator.files({avatar :{
        folder : 'media', // the folder to store the files
        required : true, // this file is not optional
        max: 3, // allow a maximum of 3 files
        len : 2, // allow only 2 files
        min : 1, // allow a minimum of 1 file
        exclude : null, // array of file types to reject
        include : ["video", "image"] // allow image/* and video/*
    }}), (req, res, next) => {
        req.uploads.upload(); // to perform an upload
        req.uploads.rollback(); // to perform a rollback
        res.json(req.uploads.files);
    });
```

## Using the Repository

The repository abstracts the datasource implementation

```js
    // create a mongoose schema
    let schema = new mongoose.Schema({ 
        name: String,
        email: String
     });

    // Initialize a captain.Logger instance
    let logger = new captain.Logger('RepoLogger');

    // Create a new database and the logger to it
    let db = new captain.MongoDatabase({
        database: 'captain-test'
    }, logger);

    // create a new datasource; in this case, we use a Mongoose datasource
    let dataSource = new captain.MongooseDataSource('User', schema, db);

    // initialize your repository
    let repo = new captain.Repository(dataSource);

    // for returning only one item,
    repo.getOne({ name: 'captain' })
    .then((user) => {
        logger.debug(user);
    }, (err) => {
        logger.error(err);
    })
    .catch((err) => {
        logger.error(err);
    });
```

other methods include

```js
    repo.add(obj) // create a new item
 
    repo.getOne(paramsObj, projection) // return the first item matching the parameters
    
    repo.getAll(paramsObj, projection) // return all items matching the parameters
    
    repo.edit(paramsObj, newObj) // update the properties of the item matching the parameters
    
    repo.delete(paramsObj) // deletes an item matching the parameters
```

all the methods in the repository return promises that resolves or rejects with an error

## Utilities
### Using the Crypto Utility class

This class can be used to generates hashes, compare them to raw texts, encrypt and decrypt data. Ex

```js
    // to perfprm a hash
    captain.Crpypto.hash('text');

    // to compare a hash
    captain.Crypto.compare('text', 'hash-of-text');
```

The above methods return promises; where the `hash` method resolves a hash and the compare method rerurns a boolean if the hash matches the text

```js
    // to encrypt an object or string
    let encrypted = captain.Crpypto.encrypt('encryption-key', 'password');

    // to decrypt an encrypted object or string
    let decrypted = captain.Crpypto.decrypt('encryption-key', 'encrypted-value');
```

### Generating tokens

Use the JWT utility class to generate tokens and make sure you decrypt them by using the `jwt().decrypt` middleware

```js
    let token = captain.JWT.getToken({ name: 'captain', lang: 'nodejs' }, 'secret', 'encryption-key');
```

### Using the Logger
The Logger has a constructor which receives two arguments; the first is the log tag while the second is the environment which could be 'development' or 'production'. The development environment permits logging while the production does not, as logging is done synchronously.

```js
    /** This logs some text on the console **/
    let logger = new captain.Logger('CaptainTag', 'development');
    logger.debug('log some debug text');

    /** This does NOT log any text on the console **/
    let logger = new captain.Logger('CaptainTag');
    logger.debug('log some debug text');
```

The Logger has four methods:
```js
    logger.debug('log some debug text');

    logger.warn('log some warning text', 'WarningTag'); // logs some value with the custom tag

    logger.error('log some error text');

    logger.trace('log some trace');
```

## Using the Validator Middlewares

```js
    // to perform a validation on the request body, use the body method while passing a schema
    router.all('/', captain.Validator.body(schema), (req, res, next) => {
        res.send('Validation passed');
    });
```