const path = require('path');

module.exports = {
    checkFileType: function (file, cb) {
        //allowed ext
      
        const filetypes = /jpeg|jpg|png|gif/;
      
        //check ext
      
        const extname  = filetypes.test(path.extname(file.originalname.toLowerCase()));
      
        //check mime type
      
        const mimetype = filetypes.test(file.mimetype);
      
        if(mimetype && extname){
          return cb(null,true)
        }else{
          return cb('error: Images only!');
        }
      }
}