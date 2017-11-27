# A Simple Node.js Microservice Module

Captain-MS which means Captain MicroService is a simple module which provides a basic setup for a microservice project.

installing

        npm install @halagram/captain-ms

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
        folder : 'files', // the folder to store the files
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
    let schema = new monggose.Schema({ 
        name: String,
        email: String
     });

    let logger = new captain.Logger('RepoLogger');

    let db = new captain.MongoDatabase({
        database: 'captain-test'
    }, logger);

    let dataSource = new captain.MongooseDataSource('User', schema, db);

    let repo = new captain.Repository(dataSource);

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

## Utilities
### Using the Crypto Utility class

This class can be used to generates hashes, compare them, encrypt and decrypt data. Ex

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

## Using the Validator Middlewares

```js
    router.all('/', captain.Validator.body(schema), (req, res, next) => {
        res.send('Validation passed');
    });
```