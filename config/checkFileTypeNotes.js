const path = require('path');

module.exports = {
    checkFileTypeNotes: function (file, cb) {
        //allowed ext
      
        const filetypes = /pdf|doc|docx|pptx|txt/;
      
        //check ext
      
        const extname  = filetypes.test(path.extname(file.originalname.toLowerCase()));
      
        //check mime type
      
        const mimetype = filetypes.test(file.mimetype);
      
        if(mimetype && extname){
          return cb(null,true)
        }else{
          return cb('error: Notes of pdf,doc,docx type only!');
        }
      }
}