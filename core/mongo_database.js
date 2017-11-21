const mongoose = require('mongoose');
mongoose.promise = global.Promise

module.exports = class MongoDatabase {

	/**
	* @param {Object} connectionObj { database : String, port: Number, username: String, password: String, host: String }
	* @param {Object} logger the app logger
	*/
	constructor(connectionObj, logger){
		this.database = connectionObj.database || 'Database';
		this.logger = logger;
		this.connectionString = this.objectToString(connectionObj);
	}

	/**
	* Creates a mongoDB connection String from an object with connection parameters
	* @param {Object} object the connection object
	* @returns a connection String
	*/
	objectToString(object){
		let x = `mongodb://${object.username && encodeURIComponent(object.username)+':' || ''}
		${object.password && encodeURIComponent(object.password) + '@' || ''}
		${object.host || '127.0.0.1'}:
		${object.port && object.port || 27017}/
		${object.database}`;
		return x.replace(/[\n\s+]/g, '');
	}

	open() {
		this.connection = mongoose.createConnection(this.connectionString);
		this.initListeners();
		return this.connection;
	}

	/**
	 * Initializes the database event listeners
	 */
	initListeners() {
		this.onConnected();
		this.onError();
		this.onDisconnected();
		this.onExit();
	}

	onConnected() {
		this.connection.on('connected',  () => {
    		this.logger.debug(`Connection established to ${this.database} database`);
		});
	}

	onError(){
		this.connection.on('error', (err) => {
    		this.logger.error(`${this.database} database connection error: ${err}`);
		});
	}

	onDisconnected(){
		this.connection.on('disconnected',  () => {
    		this.logger.warn(`${this.database} disconnected`);
		});
	}

	onExit(){
		process.on('SIGINT', () => {
    		this.connection.close( () => {
        		this.logger.warn(`${this.database} database disconnected through app termination`);
        		process.exit(0);
    		});
		});

	}

	close() {
		this.connection.close((err) => {
			if (err) this.logger.error(`Failed to close database ${this.database}: ${err}`);
			else this.logger.warn(`Connection to ${this.database} database closed`);
		});
	}
};