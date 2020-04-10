const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    email:{
        type: String,
        validator(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password:{
        type: String,
    },
    googleId:{
        type:String
    },
    facebookId:{
        type:String
    },
    linkedinId:{
        type:String
    },
    date:{
        type:Date,
        default: Date.now()
    },
    branch:{
        type:String
    },
    semester:{
        type:String
    },
    phnNo:{
        type:String
    },
    uploadsCount:{
        type:Number,
        default:0
    },
    downloadCountUser:{
        type:Number,
        default:0
    },
    avatar:{
        type:String
    },
    notesDownloadedByUsers:{
        type:Number,
        default:0
    },
    ratings: [{
        rating:{
            type:Number
        }
    }]
})

const User = mongoose.model('User',UserSchema);

module.exports = User;