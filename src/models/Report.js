const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    subject:{
        type:String
    },
    message:{
        type:String
    },
    issueImageLoc:{
        type:String
    }
})

const Report = mongoose.model('Report',ReportSchema);

module.exports = Report;