///TODO: this binding for the reusable stuff
const zmq = require('zmq');
const Logger = require('../lib/utils/logger'); //try to get the logger from the index.js file instead

const environment = process.env.NODE_ENV || 'development';

module.exports = (mq) = {

    /**
     * This returns a zeromq Push object
     */
    Pusher : (port, host = "127.0.0.1") => {
        return zmq.socket('push').bindSync(`tcp://${host}:${port}`);
    },

    /**
     * This returns a zeromq Pull object
     */
    Puller : (port, host = "127.0.0.1") => {
        return zmq.socket('pull').connect(`tcp://${host}:${port}`);
    },

    /**
     * This returns a zeromq Router object. This router together with the dealer,
     * acts as a broker between the requesters and responders.
     */
    Router : ({port, identity, host = "127.0.0.1"}) => {
        mq.checkParams(port, identity);
        let router =  zmq.socket('router').bindSync(`tcp://${host}:${port}`);
        router.identity = identity;
        mq.addListeners(router);
        return router;
    },

    /**
     * This returns a zeromq Dealer object. This dealer together with the router,
     * acts as a broker between the requesters and responders.
     */
    Dealer : ({port, identity, host = "127.0.0.1"}) => {
        mq.checkParams(port, identity);
        let dealer =  Object.create(zmq.socket('dealer').bindSync(`tcp://${host}:${port}`))
        dealer.identity = identity;
        mq.addListeners(dealer);
        return dealer;
    },

    /**
     * Starts the Request-Response Broker
     */
    StartReqRepBroker: ({ router, dealer }) => {

        let Router = mq.Router(router);
        let Dealer = mq.Dealer(dealer);
        let log  = new Logger("", environment);

        Router.on('message', function() {
            log.debug('router recieved a message', router.identity);
            // get the argument passed
            let args = Array.apply(null, arguments);
            Dealer.send(args);
        });

        Dealer.on('message', function() {
            log.debug('dealer recieved a message', dealer.identity);
            // get the argument passed
            let args = Array.apply(null, arguments);
            Router.send(args);
        });
    },

    /**
     * This returns a zeromq Requester object. It connects to the Router to
     * receive messages.
     */
    Requester : ({port, identity, host="127.0.0.1", bind=false}) => {
        mq.checkParams(port, identity);
        let req =  Object.create(zmq.socket('req')[bind ? "bindSync" : "connect"](`tcp://${host}:${port}`));
        req.identity = identity;
        mq.addListeners(req);
        req.EventListeners = {};

        req.addEventListener = (event, callback) => {
            if(typeof callback != 'function'){
                throw new Error("callback supplied must be a valid function");
            }
            if(!req.EventListeners[event]){
                req.EventListeners[event]  = [callback];
            } else {
                req.EventListeners[event].push(callback);
            }
        };

        let callback = () => {};
        req.request =  (msg, cb) => {
            req.send(JSON.stringify(msg));
            callback = cb;
        }

        req.on('message', (res) => {
            let result;
            try {
                result = JSON.parse(res);
            } catch(e) {
                result = res;
            }
            callback(result);
        });
        return req;
    },

    /**
     * This returns a zeromq Responder object. It connects to the Dealer to receive
     * messages. Also, receives messages based on event types.
     */
    Responder : ({port, identity ,host="127.0.0.1", bind=false, $on = true})=> {
        mq.checkParams(port, identity)
        let rep = Object.create(zmq.socket('rep')[bind ? "bindSync" : "connect"](`tcp://${host}:${port}`));
        
        rep.identity  = identity;
        if($on){
            rep.EventListeners = {};
            rep.$on =  rep.addEventListener = (event, callback)=>{
                if(typeof callback != 'function'){
                    throw new Error("callback supplied must be a valid function");
                }
                if(!rep.EventListeners[event]){
                    rep.EventListeners[event]  = [callback];
                }else{
                    rep.EventListeners[event].push(callback);
                }
            };
    
            rep.on('message', (msg)=>{
                msg = JSON.parse(msg);
                if(rep.EventListeners[msg.type] && Array.isArray(rep.EventListeners[msg.type])){
                    rep.reply = (msg) => {
                        rep.send(JSON.stringify(msg));
                    };
                    rep.EventListeners[msg.type].forEach(element => {
                        if(typeof element == 'function'){
                            element(msg, rep.reply);
                        }
                    });
                }
            });
        }

        mq.addListeners(rep);
        return rep;
    },

    /**
     * This returns a zeromq Publisher object.
     */
    Publisher : ({port, identity ,host = "127.0.0.1", bind=false}) => {
        mq.checkParams(port, identity);
        let pub =  Object.create(zmq.socket('pub')[bind ? "bindSync" : "connect"](`tcp://${host}:${port}`));
        pub.identity = identity;
        pub.publish = msg=> pub.send(JSON.stringify(msg));
        mq.addListeners(pub);
        return pub;
    },

    /**
     * Returns a zeromq xPublisher
     */
    xPublisher : ({port, identity, host="127.0.0.1"}) => {
        mq.checkParams(port, identity);
        let pub =  zmq.socket('xpub').bindSync(`tcp://${host}:${port}`);
        pub.setsockopt(zmq.ZMQ_XPUB_VERBOSE, 1)
        pub.identity = identity;
        mq.addListeners(pub);
        return pub;
    },

    /**
     * Returns a zeromq xSubscriber
     */
    xSubscriber : ({port, identity, host="127.0.0.1"})=>{
        mq.checkParams(port, identity);
        let sub =  zmq.socket('xsub').bindSync(`tcp://${host}:${port}`);
        sub.identity = identity;
        mq.addListeners(sub);
        return sub;
    },

    Subscriber : ({port, identity, host = "127.0.0.1", topic = "", $on = true}) => {
        mq.checkParams(port, identity);
        let sub =  Object.create(zmq.socket('sub').connect(`tcp://${host}:${port}`));
        sub.identity  = identity;
        sub.subscribe(topic);
        if($on){
            sub.EventListeners = {};
            sub.$on = sub.addEventListener = (event, callback)=>{
                if(typeof callback != 'function'){
                    throw new Error("callback supplied must be a valid function");
                }
                if(!sub.EventListeners[event]){
                    sub.EventListeners[event]  = [callback];
                }else{
                    sub.EventListeners[event].push(callback)
                }
            };

            sub.on('message', msg => {
                msg = JSON.parse(msg.toString());
                if(sub.EventListeners[msg.type] && Array.isArray(sub.EventListeners[msg.type])){
                    sub.EventListeners[msg.type].forEach(element => {
                    if(typeof element == 'function'){
                        element(msg);
                    }
                    });
                }
            });
        }
        
        mq.addListeners(sub);

        return sub;
    },

    /**
     * This starts a broker for zeromq Publishers and Subscribers
     */
    StartPubSubBroker : (xpubArgs, xsubArgs)=>{
        let xpub = mq.xPublisher(xpubArgs);
        let xsub = mq.xSubscriber(xsubArgs);
        zmq.proxy(xpub, xsub, null);
    },

    /**
     * This performs a validation check on the port and socket 'identity' parameters passed
     * and throws an error if they do not pass the check.
     */
    checkParams : (port, identity)=> {
        if(isNaN(port) || !identity){
            throw new Error("Invalid Argument supplied, make sure port is a number and identity is a valid string");
        }
    },

    /**
     * This adds listeners to the zeromq socket objects.
     */
    addListeners : (socket) => {
        let log  = new Logger(socket.identity, environment);
        // fd => number; ed => endpoint
        socket.on('connect', (fd, ep) => {log.success(`connected to ${ep} `) });
        socket.on('connect_delay', (fd, ep)  => {log.warn(`connection delay with ${ep}`);});
        socket.on('connect_retry', (fd, ep) => {log.warn(`attempting to reconnect with ${ep}`);});
        socket.on('listen', (fd, ep) => {log.debug(`now listening on ${ep}`);});
        socket.on('bind_error', (fd, ep)  => {log.error(`bind error with ${ep}`);});
        socket.on('accept', (fd, ep) => {log.success(`connection accepted at ${ep}`);});
        socket.on('close', (fd, ep)=> {log.warn(`connection closed at ${ep}`);});
        socket.on('accept_error', (fd, ep) => {log.error(`acceptance failed at ${ep}`)});
        socket.on('close_error', (fd, ep)=> {log.error(`failed to close connection at ${ep}`);});
        socket.on('disconnect', (fd, ep)=> {log.error(`disconnected from ${ep}`);});

        // Handle monitor error
        socket.on('monitor_error', (err) => {
            console.log('Error in monitoring: %s, will restart monitoring in 5 seconds', err);
            setTimeout(function() { socket.monitor(500, 0); }, 5000);
        });

        log.debug('Now monitoring...');
        socket.monitor(500, 0);
    }
};