const express = require('express');
const profile = express.Router();
const User = require('../models/User');
const Notes = require('../models/Notes');
const uuid = require('uuid');
const multer = require('multer');
const path = require('path');
const {checkFileType} = require('../../config/checkFileType');
const {checkFileTypeNotes} = require('../../config/checkFileTypeNotes');
const async = require('async');
const {ensureAuthenticated } = require('../../config/auth');
const fs = require('fs');

//set disk storage of profile image
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        console.log("inside multer",req.user);
        var newDestination = `./public/uploads/${req.user._id}`;
        var stat = null;
        try {
            stat = fs.statSync(newDestination);
        } catch (err) {
            fs.mkdirSync(newDestination);
        }
        if (stat && !stat.isDirectory()) {
            throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"');
        }
        
        cb(null,newDestination);
    },
    filename: function(req,file,cb){
      cb(null,file.fieldname + '-' + uuid.v4()+ path.extname(file.originalname));
    }
  });

  const upload = multer({
    storage:storage,
    limits:{fileSize:1000000},
    fileFilter: function(req,file,cb){  //to enter only image 
      checkFileType(file,cb);
    }
  }).single('profileImage');



  //for notes section

  const notesStorage = multer.diskStorage({
    destination: function(req,file,cb){
        console.log("inside multer for notes",req.user);
        var newDestination = `./public/uploadsNotes/${req.user._id}`;
        var stat = null;
        try {
            stat = fs.statSync(newDestination);
        } catch (err) {
            fs.mkdirSync(newDestination);
        }
        if (stat && !stat.isDirectory()) {
            throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"');
        }
        
        cb(null,newDestination);
    },
    filename: function(req,file,cb){
      cb(null,file.fieldname + '-' + uuid.v4()+ path.extname(file.originalname));
    }
  });
  
  
  const uploadNotes = multer({
    storage:notesStorage,
    limits:{fileSize:15000000},   //limit of 15mb
    fileFilter: function(req,file,cb){  //to enter only pdf,docx,doc 
      checkFileTypeNotes(file,cb);
    }
  }).single('notesSelected');
  
//for uploading image
profile.post('/profile/:id',async function(req,res){
    console.log("details of branch",req.body);
    const id = req.params.id;
    console.log("id",id);
    let errors = [];
    var avatar;
    async.each(['abc'],(item,cb)=>{
        upload(req,res,(err)=>{
            if(err){
                errors.push({msg:err})
                console.log("err1",errors);
                avatar='';
                cb(avatar);
            } else{
                console.log("file in uploads",req.file);
                if(req.file== undefined){
                    errors.push({msg:'No file Selected'})
                    console.log("err2",errors);
                    avatar = undefined;
                    cb(avatar);
                }else{
                    avatar = `/uploads/${req.user._id}/${req.file.filename}`;
                    console.log("avatar",avatar);
                    cb(avatar);  
                }
            }
      }) 
    },(avatar)=>{
        User.findById({_id:id})
        .then(user => {
            if(!user){
                errors.push({msg:'No Records of user found at this moment'})
                res.render('signup',{
                    errors
                })
            }

            //for avatar
            if(avatar){
                user.avatar = `${avatar}`;
            }
            else{
                user.avatar = '/img/avatar.png'  //if no image is set then select this for user  
            }

            //for branch
            if(req.body.branch){
                user.branch = req.body.branch;
            }

            //for sem
            if(req.body.semester){
                user.semester = req.body.semester;
            }

            //for contact no.
            if(req.body.phnNo){
                user.phnNo = req.body.phnNo;
            }
            
            
            user.save()
                .then(user => {
                    console.log("fun",avatar);
                    req.flash('profile_msg', 'Profile Updated!');
                    res.redirect('/profile');
                })
                .catch(err =>{
                    console.log("profile not updated");
                    
                })
        })
        .catch(err => {
            console.log("error",err);   
        })
    })
});


//for uploading notes
profile.post('/notes/:id',async function(req,res){
    const id = req.params.id;
    console.log("id",id);
    let errors = [];
    var notes;
    async.each(['func'],(item,cb)=>{
        uploadNotes(req,res,(err)=>{
            if(err){
                errors.push({msg:err})
                console.log("err1",errors);
                notes='';
                cb(notes);
            } else{
                console.log("file in uploads",req.file);
                if(req.file== undefined){
                    errors.push({msg:'No file Selected'})
                    console.log("err2",errors);
                    notes = undefined;
                    cb(notes);
                }else{
                    notes = `/uploadsNotes/${req.user._id}/${req.file.filename}`;
                    console.log("notes",notes);
                    cb(notes);  
                }
            }
      }) 
    },(notes)=>{
        User.findOneAndUpdate({_id:id},{ $inc: { uploadsCount: 1 } })
            .then(user => {
                if(!user){
                    errors.push({msg:'No Records of user found at this moment'})
                    res.render('signup',{
                        errors
                    })
                }
                
                user.save()
                    .then(user => {
                        if(!notes){
                            req.flash('profile_msg', 'your Notes Couldnot be uploaded! Please Try again');
                            res.redirect('/profile');
                        }
                        
                        else{
                            console.log("about branch",req.body);
                            
                            const newNotes = new Notes({
                                userName:user.name,
                                branch:req.body.branch,
                                semester:req.body.semester,
                                profName:req.body.profName,
                                subject:req.body.subject,
                                notesLoc:`${notes}`,
                            })

                            newNotes.save()
                                .then(note=> {
                                    console.log("saved note",note);
                                    
                                    req.flash('profile_msg', 'Your notes is uploaded.You can check it at notes section!');
                                    res.redirect('/profile');
                                })
                                .catch(err => {
                                    console.log("error in uploading",err);
                                })    
                        }
                    })
                    .catch(err =>{
                        console.log("profile not updated",err);  
                    })
            })
            .catch(err => {
                console.log("error",err);   
            })
    })
})




module.exports = profile;