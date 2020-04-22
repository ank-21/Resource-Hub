const mongoose = require('mongoose');

const DeleteNoteSchema = new mongoose.Schema({
    branch: {
        type:String
    },
    semester: {
        type: String
    },
    subject:{
        type:String
    },
    notesLoc:{
        type: String
    },
    via:{
        type:String,
        default:'user'
    },
    userName:{
        type:String
    },
    userEmailId:{
        type:String
    }
});

const DeleteNote = mongoose.model('DeleteNote',DeleteNoteSchema);

module.exports = DeleteNote;