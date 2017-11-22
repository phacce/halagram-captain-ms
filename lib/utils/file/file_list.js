/**
 * This class represents a list (or array) of files to be uploaded or rolled back (deleted)
 */

const fs = require('fs');
const File = require('./file')
const FileError = require('../../errors/file_error');

var baseDir = ''; // temp fix for hiding the base directory in the response

module.exports = class FileList {

    /**
     * @param {Object} fileList an array containing file objects
     * @param {String} baseDirectory the base directory for the uploads
     */
    constructor(fileList, baseDirectory) {
		this.error = [];
        this.name = fileList.name;
        this.files = Array.isArray(fileList.files) ? fileList.files : [ fileList.files ];
		this.files = this.files.map((file) => new File(file, '', baseDirectory));
        this.settings(fileList.settings);

        baseDir = baseDirectory;

        if(this.error.length > 0) throw new FileError(this.name, this.error);
	}

    /**
     * @returns the file default upload configurations
     */
	get defaults() {
		return {
			folder : '',
			required : false,
			min : null,
			max: null,
			len : null,
			exclude : null,
			include : null
		};
	}

    /**
     * Overrides the file's default settings
     * @param {Object} obj the settings to apply to the file
     */
	settings(obj) {
        let config = Object.assign(this.defaults, obj);	
        
		this.performFileChecks(config);
	}
 
    /**
     * @param config the configuration object
     * Checks the file meets the passed configurations
     */
    performFileChecks(config) {
        this.checkRequired(config.required);
		this.checkLimit(config);
		this.checkFilter(config);
    }

	checkRequired(required) {
        if (required && !this.files.length) 
            this.error.push(`${this.name} is required`);
    }

    /**
     * Checks the number of files in the list
     * @param {Object} configObj the configuration object
     */
	checkLimit(configObj) {
		if (configObj.min) this.limit.min(configObj.min);

		if (configObj.max) this.limit.max(configObj.max);
        
        if (configObj.len) this.limit.len(configObj.len);
    }
    
    /**
     * Checks if the file is of a supported (included) type or unsupported (excluded) type
     * @param {Object} configObj the configuration object
     */
	checkFilter(configObj) {
		if (configObj.include) this.filter.include(configObj.include);

		if (configObj.exclude) this.filter.exclude(configObj.exclude);
	}

	set folder(folder) {
        if (fs.existsSync(`${baseDir}/${folder}`))
            this._folder = folder;
        else 
            this.error.push(`${folder} does not exist in the base directory`);
	}

	get folder(){
		return this._folder;
	}

    /**
     * @returns the uploaded files function
     */
	upload() {
		return this.files.map(e => e.move());
	}

    /**
     * @returns the rolled back (deleted) files function
     */
	get rollback() {
		return () => this.files.forEach(e => e.delete());
	}

    /**
     * @returns an error if the File List does not contain less than,
     *          equal to, or more than the expected numnber of files
     */
	get limit(){
        let filesLen = this.files.length;
        let form = (filesLen > 1) ? 'files' : 'file';

		return {
			min: (number) => {
                
				if (filesLen < number && filesLen)
					this.error.push(`${this.name} expects atleast ${number} ${form}`);
			},
			max: (number) => {
                
				if (filesLen > number && filesLen)
					this.error.push(`${this.name} expects atmost ${number} ${form}`);
			},
			len: (number) => {
				if (filesLen !== number && filesLen)
					this.error.push(`${this.name} expects exactly ${number} ${form}`);
			}
		};
	}

    /**
     * @returns an error if the File List contains files not supported for the upload,
     * usually specified in the excluded property
     */
	get filter() {
		return {
			exclude: (array) => {
				array = Array.isArray(array)? array: [array];
				let filteredFiles = this.files.filter(file => !file.type.match(new RegExp(array.join('|'),'i')));
				if (this.files.length != filteredFiles.length)
					this.error.push(`${this.name} doesnt allow ${array.join(', ')} files`);
			},
			include: (array) => {
				array = Array.isArray(array)? array: [array];
		    	let filteredFiles = this.files.filter(file => file.type.match(new RegExp(array.join('|'),'i')));
				if(this.files.length != filteredFiles.length)
					this.error.push(`${this.name} only allows ${array.join(', ')} files`);
			}
		}
	}
}