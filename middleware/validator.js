/**
* Configures the joi validator and parses its errors to desired 
* format each method returns a middleware
*/
const joi = require('joi');
const FileBatch = require('../lib/utils/file/file_batch');
const FileList = require('../lib/utils/file/file_list');

module.exports = class Validator {

	static joi_options() {
		return {
			abortEarly : false,
			stripUnknown: true,
		};
	}

	static body(schema) {
		return this.middleware('body', schema, (req, res, err) => {
			res.status(400).json(this.handleError(err));
		});
	}

	static header(schema) {

	}

	static query(schema) {

	}

	static params(schema) {

	}

	/**
	 * @param {Object} schema the upload object config schema
	 * @param {String} baseDir the base directory for the uploaded files
	 */
	static files(schema, baseDir) {
		return (req, res, next) => {
			req.uploads = {};
			let err = {};
			Object.keys(schema).forEach((param) => {
				try {
					req.uploads[param] = new FileList({
						name : param,
						files : req.files ? req.files[param] || [] : [],
						settings : schema[param]
					}, baseDir);
				} catch(e) {
					err[e.name] = e;
				}
			});

			if (Object.keys(err).length) {
				res.status(400).json(err);
			} else {
				req.uploads = new FileBatch(req.uploads);
				next();
			}
		};
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
		};
	}

	static handleError(err){
		let error = {};
		err.details.forEach(er => {
			error[er.path[0]] = er.message.replace(/[\"]/g,'');
		})
		return error;
	}
};