/**
 * This class uploads lists of files somewhat like an array of {utils.file.FileList}
 */

module.exports = class FileBatch {

    /**
     * @param {utils.file.File[]} files an array of files
     */
    constructor(files) {
        this.files = files;
    }

    /**
     * Performs a rollback (delete) of uploaded files if an error occurs
     * @returns the rollbacks functions of the files
     */
    rollback() {
        return Object.keys(this.files)
            .map((file) => this.files[file].rollback());
    }

    /**
     * Performs file uploads
     * @returns the upload functions of the files
     */
    upload() {
        return Object.keys(this.files)
            .map((file) => this.files[file].upload());
    }
}