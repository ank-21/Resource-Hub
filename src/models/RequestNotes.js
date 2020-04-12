const mongoose = require('mongoose');

const RequestNotesSchema = new mongoose.Schema({
    branch: {
        type:String
    },
    semester: {
        type: String
    },
    subject:{
        type:String
    },
    profName:{
        type:String
    },
    userName:{
        type:String
    },
    userId:{
        type:String
    },
    date:{
        type:String
    },
    solved:{
        type:String
    },
    year:{
        type:Number
    },
    noteType: {
        type:String
    },
})

const RequestNotes = mongoose.model('RequestNotes',RequestNotesSchema);

module.exports = RequestNotes;