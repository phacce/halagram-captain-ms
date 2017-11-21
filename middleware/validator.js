/**
* Configures the joi validator and parses its errors to desired format each method returns a middleware
*/
const joi = require('joi');

module.exports = class Validator{

	static joi_options(){
		return {
			abortEarly : false,
			stripUnknown: true,
		};
	}

	static body(schema){
		return this.middleware('body',schema,(req,res,err)=>{
			res.status(400).json(this.handleError(err));
		});
	}

	static header(schema){

	}

	static query(schema){

	}

	static params(schema){

	}

	static files(schema){

	}

	static middleware(document, schema, errCallback){
		return (req, res, next) => {
			joi.validate(req[document], schema, this.joi_options(), (err,value) => {
				if (err) {
					errCallback(req,res,err);
				} else {
					next();
				}
			});
		}
	}

	static handleError(err){
		let error = {};
		err.details.forEach(er => {
			error[er.path[0]] = er.message.replace(/[\"]/g,'');
		})
		return error;
	}
};