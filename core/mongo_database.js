/*
*	A class to create [MongoDB] database connections, safely handle 
*	connection parameters and perform database congifgurations
*	mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
*/

const mongoose = require('mongoose');
mongoose.promise = require("q").Promise
const {Logger} = require('../index');

module.exports = class MongoDatabase {

	/**
	* creates a connection to mongoDB
	* @param connectionObj { name : String, connection: ConnectionString or Object }
	*/
	constructor(connectionObj){
		this.database = connectionObj.database || 'Database';
		let connectionString = this.objectToString(connectionObj);
		this.connection = mongoose.createConnection(connectionString);
		this.logger = new Logger(this.database);
		this.connection.on('connected',  ()=> {
    		this.logger.debug(`Connection established to ${this.database} database`);
		});
		
		this.onError();
		this.onDisconnect();
		this.onExit();
	}

	/*
	* creates a mongoDB connection string from an object
	*/
	objectToString(object){
		let x = `mongodb://${object.password && encodeURIComponent(object.password)+'@' || ''}
		${object.host || '127.0.0.1'}:
		${object.port && object.port || 27017}/
		${object.database}`;
		return x.replace(/[\n\s+]/g, '');
	}

	onError(){
		this.connection.on('error', (err) => {
    		this.logger.debug(`${this.database} database connection error: ${err}`);
		});
	}

	onDisconnect(){
		this.connection.on('disconnected',  () => {
    		this.logger.debug(`${this.database} disconnected`);
		});
	}

	onExit(){
		process.on('SIGINT', () => {
    		this.connection.close( () => {
        		this.logger.debug(`${this.database} database disconnected through app termination`);
        		process.exit(0);
    		});
		});

	}
};