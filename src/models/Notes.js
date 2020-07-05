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
    userId:{
        type:String
    },
    downloadCount:{
        type:Number,
        default:0
    },
    ratings: [{                        //array of objects
        rating: {
            type:Number            
        }
    }],
    usersRated: [{
        userId:{
            type:String
        }
    }],
    noteType: {
        type:String
    },
    year:{
        type:Number
    },
    reports:{
        type:Number,
        default:0
    },
    timeStamp:{
        type:String,
        default:Date.now
    }
})

const Notes = mongoose.model('Notes',NotesSchema);

module.exports = Notes;