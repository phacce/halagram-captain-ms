/**
* A service blueprint from whch other service are created from.
* Each service is an instance of this class
*/

const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload'); // required for file uploads
const jwt = require('../middleware/jwt');
const rateLimiter = require('../lib/utils/rate_limiter');
const http = require('http');

module.exports = class Service {

	/**
	* Initializes the port and service name
	* @param {Object} obj - { port : Number, name : String }
	* @param {utils.Logger} logger - the app logger
	*/
	constructor(obj, logger) {
		this.port = obj.port;
		this.name = obj.name;
		this.logger = logger;
		this.httpServer =  http.createServer(app);
		this.app = express();
		this.setupApp();
	}

	loadModules(...modules){
		modules.forEach(mod => {
			this.app.use(mod);
		})
	}


	setupApp() {
		this.app.use(helmet());
		this.app.use(compression());
		this.app.use(fileUpload());
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: true }));
	}

	enableJWT(jwtObj) {
		this.app.use(jwt({ encryptionKey: jwtObj.encryptionKey}).decrypt);
		this.app.use(jwt({ secret: jwtObj.secret }).verifyToken);
		this.app.use(jwt({allowed: jwtObj.allowed}).verifyUser);
	}

	enableRateLimiter(limiterObj) {
		let limiter = rateLimiter({
			host: limiterObj.host,
			port: limiterObj.port,
			environment: limiterObj.environment,
			freeRetries: limiterObj.freeRetries,
			minWait: limiterObj.minWait,
			maxWait: limiterObj.maxWait,
			lifetime: limiterObj.lifetime
		});

		this.app.use(limiter.prevent);
	}

	/**
	* Sets the app routes with middlewares
	* @param {Object} routes a route object => { '' : middleware, 'route' : routeMiddleware }
	*/
	setRoutes(routes) {
		for (let e in routes) {
			this.app.use(`/${e}`, routes[e]);
		}
	}

	/**
	* @return the service port
	*/
	get port(){
		return this._port;
	}

	/**
	* Sets the service port
	* @param port the service port
	*/
	set port(port){
		this.app.set('port', process.env.PORT || port);
		this._port = port;
	}

	/**
	* Starts the Service on the specified port and then invokes the callback
	* if successful. Else, if the port is taken, it recursively increments until
	* it finds a free port
	*
	* @param {Function} callback the method to invoke
	*/
	start(callback){
		this.catch404();
		this.handleServerErrors();

		this.server = this.httpServer.listen(this.port, () => {
			this.logger.debug(`${this.name} app started on port ${this.port}`);
			if (typeof callback === 'function') callback();
			return;
		}).on('error', () => {
			this.logger.error(`Port ${this.port} is in use`);
			this.port += 1;
			this.start(callback);
		});
	}

	catch404() {
		this.app.use((req, res, next) => {
			res.status(404).json({error: `cannot ${req.method} ${req.originalUrl}`});
		});
	}

	handleServerErrors() {
		app.use((err, req, res, next) => {
			this.logger.error(err.stack);
			res.status(500).json({error: 'An error occurred while processing the request'});
		});
	}

	/**
	* Stops the Service instance
	* @return promise
	*/
	stop(){
		this.server.close();
		this.logger.warn(`${this.name} app stopped`);
		return Promise.resolve();
	}
};
