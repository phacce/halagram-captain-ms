const {assert} = require('chai');
const FileList = require('./file_list');
const File = require('./file');

describe('utils.file.FileList', () => {

    describe('#performFileChecks()', () => {

        describe('.required=true', () => {

            it('should require exactly one file to proceed', () => {
                
                let list = {
                    name: "logo",
                    files: [],
                    settings: {
                        folder : 'images',
                        required : true,
                        len : 1,
                        include : ['image']
                    }
                };
                
                try {
                    let fileList = new FileList(list, 'files');
                } catch(e) {
                    assert.isNotEmpty(e.error); // file is required error
                }
            });
    
            it('should require atleast 2 files to proceed', () => {
    
                let fileProps = {
                    name: "halagram.ico",
                    mimetype: 'image/ico'
                };
    
                let list = {
                    name: "media",
                    files: [
                        fileProps // file list constructs a new file using this properties
                    ],
                    settings: {
                        folder : 'media',
                        required : true,
                        min : 2,
                        include : ['image', 'video']
                    }
                };
                
                try {
                    let fileList = new FileList(list, 'files');
                } catch(e) {
                    assert.isNotEmpty(e.error); // second file is required error
                }
            });
    
            it('should require 2 or less files to proceed', () => {
                
                let fileProps = {
                    name: "halagram.ico",
                    mimetype: 'image/ico'
                };
    
                let list = {
                    name: "media",
                    files: [
                        fileProps // file list constructs a new file using this properties
                    ],
                    settings: {
                        folder : 'media',
                        required : true,
                        max : 2,
                        include : ['image', 'video']
                    }
                };
                
                try {
                    let fileList = new FileList(list, 'files');
                    assert.equal(1, fileList.files.length);
                } catch(e) {
                    assert.isEmpty(e.error);
                }
            });
        });

        describe('.limit', () => {
            describe('#len()', () => {
                
                it('should throw an error if more or less than 1 file is passed', () => {
                    
                    let list = {
                        name: "logo",
                        files: [],
                        settings: {
                            folder : 'images',
                            required : true,
                            len : 1,
                            include : ['image']
                        }
                    };
                    
                    try {
                        let fileList = new FileList(list, 'files');
                    } catch(e) {
                        assert.isNotEmpty(e.error); // file is required error
                    }
                });
        
                it('should upload if exactly one file is passed', () => {
        
                    let fileProps = {
                        name: "halagram.ico",
                        mimetype: 'image/ico'
                    };
        
                    let list = {
                        name: "media",
                        files: [
                            fileProps // file list constructs a new file using this properties
                        ],
                        settings: {
                            folder : 'media',
                            required : true,
                            len : 1,
                            include : ['image', 'video']
                        }
                    };
                    
                    try {
                        let fileList = new FileList(list, 'files');
                        assert.equal(1, fileList.files.length);
                    } catch(e) {
                        assert.isEmpty(e.error);
                    }
                });
        
                it('should pass if the file is not required and no file was passed', () => {
                        
                    let list = {
                        name: "media",
                        files: [],
                        settings: {
                            folder : 'media',
                            required : false,
                            len : 2,
                            include : ['image', 'video']
                        }
                    };
                    
                    try {
                        let fileList = new FileList(list, 'files');
                        assert.equal(0, fileList.files.length);
                    } catch(e) {
                        assert.isEmpty(e.error);
                    }
                });
            });
            
            describe('#min()', () => {
                
                it('should require atleast one file to proceed', () => {
                    
                    let fileProps = {
                        name: "halagram.ico",
                        mimetype: 'image/ico'
                    };

                    let list = {
                        name: "logo",
                        files: [
                            fileProps
                        ],
                        settings: {
                            folder : 'images',
                            required : true,
                            min : 1,
                            include : ['image']
                        }
                    };
                    
                    try {
                        let fileList = new FileList(list, 'files');
                        assert.equal(1, fileList.files.length);
                    } catch(e) {
                        assert.isEmpty(e.error);
                    }
                });
        
                it('should throw an error if not up to 2 files are passed', () => {
        
                    let fileProps = {
                        name: "halagram.ico",
                        mimetype: 'image/ico'
                    };
        
                    let list = {
                        name: "media",
                        files: [
                            fileProps // file list constructs a new file using this properties
                        ],
                        settings: {
                            folder : 'media',
                            required : true,
                            min : 2,
                            include : ['image', 'video']
                        }
                    };
                    
                    try {
                        let fileList = new FileList(list, 'files');
                    } catch(e) {
                        assert.isNotEmpty(e.error); // second file is required error
                    }
                });
        
                it('should pass if the file is not required and no file is passed', () => {
        
                    let list = {
                        name: "media",
                        files: [],
                        settings: {
                            folder : 'media',
                            required : false,
                            min : 2,
                            include : ['image', 'video']
                        }
                    };
                    
                    try {
                        let fileList = new FileList(list, 'files');
                        assert.equal(0, fileList.files.length);
                    } catch(e) {
                        assert.isEmpty(e.error);
                    }
                });
            });

            describe('#max()', () => {
                
                it('should throw an error if more than one file is sent', () => {
                    
                    let fileProps1 = {
                        name: "halagram.ico",
                        mimetype: 'image/ico'
                    };

                    let fileProps2 = {
                        name: "halagram intro.mp4",
                        mimetype: 'video/mp4'
                    };

                    let list = {
                        name: "media",
                        files: [
                            fileProps1,
                            fileProps2
                        ],
                        settings: {
                            folder : 'media',
                            required : true,
                            max : 1,
                            include : ['video', 'image']
                        }
                    };
                    
                    try {
                        let fileList = new FileList(list, 'files');
                    } catch(e) {
                        assert.isNotEmpty(e.error); // no second file is required error
                    }
                });
        
                it('should pass if no more than two file is sent', () => {
        
                    let fileProps1 = {
                        name: "halagram.ico",
                        mimetype: 'image/ico'
                    };

                    let fileProps2 = {
                        name: "halagram intro.mp4",
                        mimetype: 'video/mp4'
                    };
        
                    let list = {
                        name: "media",
                        files: [
                            fileProps1, // file list constructs a new file using this properties
                            fileProps2
                        ],
                        settings: {
                            folder : 'media',
                            required : true,
                            max : 2,
                            include : ['image', 'video']
                        }
                    };
                    
                    try {
                        let fileList = new FileList(list, 'files');
                        assert.equal(2, fileList.files.length);
                    } catch(e) {
                        assert.isEmpty(e.error);
                    }
                });
        
                it('should pass if the file is not required and no file is passed', () => {
        
                    let list = {
                        name: "media",
                        files: [],
                        settings: {
                            folder : 'media',
                            required : false,
                            max : 2,
                            include : ['image', 'video']
                        }
                    };
                    
                    try {
                        let fileList = new FileList(list, 'files');
                        assert.equal(0, fileList.files.length);
                    } catch(e) {
                        assert.isEmpty(e.error);
                    }
                });
            });
        });

        describe('.filter', () => {

            describe('#include()', () => {

                it('should throw an error if a non-included filetype is sent', () => {
                    
                    let fileProps = {
                        name: "halagram.ico",
                        mimetype: 'image/ico'
                    };
        
                    let list = {
                        name: "intro",
                        files: [
                            fileProps // file list constructs a new file using this properties
                        ],
                        settings: {
                            folder : 'videos',
                            required : true,
                            len : 1,
                            include : ['video']
                        }
                    };
                    
                    try {
                        let fileList = new FileList(list, 'files');
                    } catch(e) {
                        assert.isNotEmpty(e.error); // image/* is not included in filter
                    }
                });

                it('should allow different files in included types', () => {
                    
                    let fileProps1 = {
                        name: "halagram.ico",
                        mimetype: 'image/ico'
                    };

                    let fileProps2 = {
                        name: "halagram.mp4",
                        mimetype: 'video/mp4'
                    };
        
                    let list = {
                        name: "intro",
                        files: [
                            fileProps1, // file list constructs a new file using this properties
                            fileProps2
                        ],
                        settings: {
                            folder : 'videos',
                            required : true,
                            len : 2,
                            include : ['image', 'video']
                        }
                    };
                    
                    try {
                        let fileList = new FileList(list, 'files');
                        assert.equal(2, fileList.files.length);
                    } catch(e) {
                        assert.isEmpty(e.error);
                    }
                });
            });

            describe('#exclude()', () => {

                it('should allow every file type that has not been excluded', () => {

                    let fileProps1 = {
                        name: "halagram.ico",
                        mimetype: 'image/ico'
                    };

                    let fileProps2 = {
                        name: "halagram.mp4",
                        mimetype: 'video/mp4'
                    };

                    let fileProps3 = {
                        name: "halagram.pdf",
                        mimetype: 'text/pdf'
                    };
        
                    let list = {
                        name: "intro",
                        files: [
                            fileProps1, // file list constructs a new file using this properties
                            fileProps2,
                            fileProps3
                        ],
                        settings: {
                            folder : 'videos',
                            required : true,
                            len : 3,
                            exclude : ['text/docx', 'video/3gp']
                        }
                    };
                    
                    try {
                        let fileList = new FileList(list, 'files');
                        assert.equal(3, fileList.files.length);
                    } catch(e) {
                        assert.isEmpty(e.error);
                    }
                });

                it('should throw an error if an excluded filetype is sent', () => {
                    
                    let fileProps1 = {
                        name: "halagram.ico",
                        mimetype: 'image/ico'
                    };

                    let fileProps2 = {
                        name: "halagram.mp4",
                        mimetype: 'video/mp4'
                    };
        
                    let list = {
                        name: "intro",
                        files: [
                            fileProps1, // file list constructs a new file using this properties
                            fileProps2
                        ],
                        settings: {
                            folder : 'videos',
                            required : true,
                            len : 2,
                            exclude : ['text', 'video']
                        }
                    };
                    
                    try {
                        let fileList = new FileList(list, 'files');
                    } catch(e) {
                        assert.isNotEmpty(e.error); // video/* has been excluded
                    }
                });
            });
        });
    });
});