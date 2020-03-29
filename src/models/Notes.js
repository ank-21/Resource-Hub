const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema({
    name: {
        type:String
    },
    branch: {
        type:String
    },
    semester: {
        type: String
    },
    notesLoc:{
        type: String
    },
    notesCount:{
        type:Number
    },
    profName:{
        type:String
    },
    userName:{
        type:String
    }
})

const Notes = mongoose.model('Notes',NotesSchema);

module.exports = Notes;