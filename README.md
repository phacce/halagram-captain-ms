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
        allowed : {
            modelName : modelObject //allowed models that will access this route or service
        }
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

## Message Queues
Message Queues are supported in captain-ms. Captain-ms uses [ZeroMQ](http://zeromq.org/) for its messages. The following types are supported:
- Request-Reply (req-rep)
- Publish-Subscribe (pub-sub)
- Push-Pull (push-pull)

Create a simple req-rep message broker like the sample below

```js
const {StartReqRepBroker} = require('@halagram/captain-ms').MessageQueue

StartReqRepBroker(
    {port : 3001, identity : `Central Requester`},
    {port : 3002, identity : `Central Responder`}
);
```

To create a pub-sub broker,
```js
const {StartPubSubBroker} = require('@halagram/captain-ms').MessageQueue

StartPubSubBroker(
    {port : 3003, identity : `Central Publisher`},
    {port : 3004, identity : `Central Subsciber`}
);
```

Then, you can create a requester and responder to connect to the req-rep broker and publisher and subscriber to connect to the pub-sub broker..

```js
const { Requester, Responder, xSubscriber, xPublisher } = require('@halagram/captain-ms').MessageQueue;

let requester = Requester({port : 3001, identity : `Requester`});
let responder = Responder({port : 3002, identity : `Responder`});
let publisher = xPublisher({port : 3003, identity : `Publisher`});
let subscriber = xSubscriber({port : 3004, identity : `Subscriber`});
```

**NOTE:** You can also create a direct connection between the subscriber and publisher by using
```js
const { Subscriber, Publisher } = require('@halagram/captain-ms').MessageQueue;
``` 

### Sending and replying messages
You send messages via a requester then, the responder acts on and replies the message. Example is given below
```js

let MSG_TYPE = 'TWO_ADDER';

requester.request({type: MSG_TYPE, number: 7}, (response) => {
    logger.debug(response); // prints '9' on the console
});

responder.$on(MSG_TYPE, (msg) => {
    let result = msg.number + 2;
    responder.reply(result); // sends the response back to the requester
});

...
```

## Middlewares
### File upload middlewares

File uploads are done by middlewares and throws errors if any occurs

```js
    captain.Validator.files({}, 'files'); // this uploads files to a 'files' base directory
```
Usage:
```js
    router.post('/upload', captain.Validator.files({avatar :{
        folder : 'media', // the folder to store the files
        required : true, // this file is not optional
        max: 3, // allow a maximum of 3 files
        len : 2, // allow only 2 files
        min : 1, // allow a minimum of 1 file
        exclude : null, // array of file types to reject
        include : ["video", "image"] // allow image/* and video/*
    }}, 'files'), (req, res, next) => {
        req.uploads.upload(); // to perform an upload
        req.uploads.rollback(); // to perform a rollback
        res.json(req.uploads.files);
    });
```

## Utilities
### Using the Crypto Utility class

This class can be used to generates hashes, compare them to raw texts, encrypt and decrypt data. Ex

```js
    // to perfprm a hash
    captain.Crypto.hash('text');

    // to compare a hash
    captain.Crypto.compare('text', 'hash-of-text');
```

The above methods return promises; where the `hash` method resolves a hash and the compare method resolves `true` if the hash matches the text

```js
    // to encrypt an object or string
    let encrypted = captain.Crypto.encrypt('encryption-key', 'password');

    // to decrypt an encrypted object or string
    let decrypted = captain.Crypto.decrypt('encryption-key', 'encrypted-value');
```

### Generating tokens

Use the JWT utility class to generate tokens and make sure you decrypt them by using the `jwt().decrypt` middleware

```js
    let token = captain.JWT.getToken({ name: 'captain', lang: 'nodejs' }, 'secret', 'encryption-key');
```

### Using the Logger
The Logger has a constructor which receives two arguments; the first is the log tag while the second is the environment which could be 'development' or 'production'. The development environment permits logging while the production does not, as console logging is done synchronously.

```js
    /** This logs some text on the console **/
    let logger = new captain.Logger('CaptainTag', 'development');
    logger.debug('log some debug text');

    /** This does NOT log any text on the console **/
    let logger = new captain.Logger('CaptainTag');
    logger.debug('log some debug text');
```

The Logger has five methods:
```js
    logger.debug('log some debug text');

    logger.success('connection accepted on port 8080');

    logger.warn('log some warning text', 'WarningTag'); // logs some value with the custom tag

    logger.error('log some error text');

    logger.trace('log some trace');
```

## Using the Validator Middlewares

```js
    // to perform a validation on the request body, use the body method while passing a JOI schema
    router.all('/', captain.Validator.body(schema), (req, res, next) => {
        res.send('Validation passed');
    });
```
