/**
*	A warpper Class for mongoose models.
*
*	TODO:
*	since the client can populate and filter
*	model should have an array of paths to be populated and paths to populate by default
*	model should have an array of usuable filters which is strictly checked when used in filtering operations
*	both arrays should be asserted before use
*/

const mongoose = require('mongoose');

module.exports = class Model {

	/**
	 * @param {*String} name the model name
	 * @param {*String} schema the mongoose schema
	 * @param {*String} database the database name 
	 */
	constructor(name, schema, database){
		this.name = name;
		this.schema = schema;
		this.database = database;
	}

	/**
	* sets the model schema
	* @param schema the mongoose schema
	*/
	schema(schema){}
	
	/**
	* @return the mongoose model for the model instance
	*/
	model(){}
};