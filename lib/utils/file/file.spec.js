const {assert} = require('chai');
const File = require('./file');

describe('utils.file.File', () => {

    describe('#newName()', () => {

        it('should not be the same name as the uploaded file\'s name', () => {

            let fileProps = {
                name: "my_test_file.js",
                mimetype: 'text/js'
            };
            
            let file = new File(fileProps, '', 'files');
            
            assert.notEqual(fileProps.name, file._newName);
        });
    });

    describe('#fullpath()', () => {
        
        it('should store the file in the base directory', () => {

            let fileProps = {
                name: "k-means.py",
                mimetype: 'text/py'
            };

            let baseDir = 'files';
            let file = new File(fileProps, '', baseDir);
            
            assert.match(file.fullpath, new RegExp(`${baseDir}/${file._newName}`, 'i'));
        });

        it('should store the file in a specified folder inside the base directory', () => {
            
            let fileProps = {
                name: "halagram.ico",
                mimetype: 'image/ico'
            };

            let folder = 'images';
            let baseDir = 'files';
            let file = new File(fileProps, folder, baseDir);
            
            assert.match(file.fullpath, new RegExp(`${baseDir}/${folder}/${file._newName}`, 'i'));
        });
    });
});