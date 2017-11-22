/**
 * Utility class to handle file upload errors
 */

module.exports = class FileError {

	constructor(name, errors){
		this.name = name;
		this.error = errors;
	}

	get toObject() {
		return {
			[this.name] : this.error
		};
	}
}