/**
*	A service blueprint from whch other service are created from. 
*	Each service is an instance of this class
*/

const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const app = express();

module.exports = class Service {

	/**
	* Initializes the port and service name
	* @param obj - { port : Number, name : String }
	* @param logger - the app logger
	*/
	constructor(obj, logger) {
		this.port = obj.port;
		this.name = obj.name;
		this.logger = logger;
		
		this.setupApp();
	}

	setupApp() {
		app.use(fileUpload());
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));
	}

	/**
	* Sets the app routes with middlewares
	* @param routes a route object => { '' : middleware, 'route' : routeMiddleware }
	*/
	setRoutes(routes) {
		for (let e in routes) {
			app.use(`/${e}`, routes[e]);
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
		app.set('port', process.env.PORT || port);
		this._port = port;
	}

	/**
	* Starts the Service on the specified port and then invokes the callback
	* if successful. Else, if the port is taken, it recursively increments until 
	* it finds a free port
	*
	* @param callback the method to invoke 
	*/
	start(callback){
		this.server = app.listen(this.port, () => {
			this.logger.debug(`${this.name} app started on port ${this.port}`);
			if (typeof callback === 'function') {
				callback();
			}
		}).on('error', () => {
			this.logger.error(`Port ${this.port} is in use`);
			this.port += 1;
			this.start(callback);
		});
	}

	/**
	* Stops the Service instance
	* @return promise
	*/
	stop(){
		this.server.close();
		return Promise.resolve();
	}
};