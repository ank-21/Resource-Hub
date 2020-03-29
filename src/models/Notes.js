const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema({
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
    profName:{
        type:String
    },
    userName:{
        type:String
    },
    downloadCount:{
        type:Number
    }
})

const Notes = mongoose.model('Notes',NotesSchema);

module.exports = Notes;