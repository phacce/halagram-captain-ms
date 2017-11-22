const crypto = require('crypto');
const fs  = require('fs');

var baseDir = ''; // temp fix for hiding the base directory in the response

module.exports = class File{

    /**
     * @param {Object} file the file to be uploaded
     * @param {String} folder the folder in the base directory for the uploads
     * @param {String} baseDirectory the base directory for the uploads
     */
	constructor(file, folder = '', baseDirectory) {
		this.name = file.name;
		this.type = file.mimetype;
        this.mv  = file.mv;
        this.folder = folder;
        
        baseDir = baseDirectory;
	}

    /**
     * @returns a key for hashing the file names
     */
    get secret() {
		return 'kfhKSKNM73298-T28JSHJS820R8283R01923R';
	}

    /**
     * @returns the file's full upload path
     */
	get fullpath() {
		return `${baseDir}/${this.folder ? this.folder + '/' : ''}${this.newName}`;
	}

    /**
     * @returns a new random unique name for the file
     */
	get newName() {
        if (!this._newName) {
            let ext = this.name.slice(this.name.lastIndexOf('.'));
            let random = new Date().toISOString() + Math.round(Math.random() * 99999999);
            let newname = (random).replace(/[\.T:-]/ig, '');
            let hash = crypto.createHmac('sha256', this.secret)
                .update(newname)
                .digest('hex');
            this._newName =  hash + ext;
        }
        return this._newName;
	}

    /**
     * @returns the uploaded file
     */
    move() {
		return this.mv(this.fullpath).then(() => {
			//success
		}).catch((e) => {
			//failure
		});
	}

    /**
     * @returns the deleted file function
     */
	delete() {
		return fs.unlink(this.fullpath, (e)=>{
			//do something for success
		},(e) => {
			//do something for failure
		});	
	}
}