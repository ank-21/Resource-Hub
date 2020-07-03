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
const RequestNotes = require('../models/RequestNotes');
//var progress = require('progress-stream');






//set disk storage of profile image
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        //console.log("inside multer",req.user);
        // var newDestination = `./public/uploads/${req.user._id}`;
        
            var newDestination = __dirname + `/../../Public/uploads/${req.user._id}`;
            console.log("new d",newDestination);
            
            
        
        var stat = null;
        try {
            stat = fs.statSync(newDestination);
        } catch (err) {
            fs.mkdir(newDestination,{recursive:true},err =>{
                console.log("error in making directory",err);
                
            });
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
        //console.log("inside multer for notes",req.user);
        var newDestination = __dirname + `/../../Public/uploadsNotes/${req.user._id}`;
        

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
    limits:{fileSize:50000000},   //limit of 50mb
    fileFilter: function(req,file,cb){  //to enter only pdf,docx,doc 
      checkFileTypeNotes(file,cb);
    }
  }).single('notesSelected');
  
//post request for uploading image
profile.post('/profile/:id',async function(req,res){
    const id = req.params.id;
    let errors = [];
    var avatar;
    async.each(['abc'],(item,cb)=>{
        upload(req,res,(err)=>{
            if(err){
                errors.push({msg:err})
                req.flash('profile_msg',err.message? err.message : err );
                console.log("err1",errors);
                avatar='';
                cb(avatar);
            } else{
                //console.log("file in uploads",req.file);
                if(req.file== undefined){
                    errors.push({msg:'No Image Selected'})
                    req.flash('profile_msg','No Image Selected' );
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
            //for chaning name
            if(req.body.name){
                user.name = req.body.name;
            }
            
            user.save()
                .then(user => {
                    console.log("avatar value",avatar);
                    if(errors.length==0)
                        req.flash('profile_msg', ' Profile Updated!');
                    
                    res.redirect('/profile');
                })
                .catch(err =>{
                    req.flash('profile_msg', 'Profile not Updated!');
                    console.log("profile not updated");
                    res.redirect('/profile');
                    
                })
        })
        .catch(err => {
            req.flash('profile_msg', 'Profile not Updated!');
            console.log("error",err); 
            res.redirect('/profile');  
        })
    })
});


//post request for uploading notes
profile.post('/notes/:id',async function(req,res){
    const id = req.params.id;
    //console.log("id",id);
    let errors = [];
    var notes;
    async.each(['func'],(item,cb)=>{
        uploadNotes(req,res,(err)=>{
            if(err){
                errors.push({msg:err})
                req.flash('profile_msg',err.message? err.message : err );
                console.log("err1",errors);
                notes='';
                cb(notes);
            } else{
                console.log("file in uploads",req.file);
                if(req.file== undefined){
                    errors.push({msg:'No file Selected'});
                    req.flash('profile_msg','No File Selected' );
                    console.log("err2",errors);
                    notes = undefined;
                    cb(notes);
                }else{
                    notes = `/uploadsNotes/${req.user._id}/${req.file.filename}`;
                    originalName = `${req.file.originalname}`
                    console.log("notes",notes);
                    cb(notes);  
                }
            }
      }) 
    },(notes)=>{
        User.findById({_id:id})
            .then(user => {
                if(!user){
                    errors.push({msg:'No Records of user found at this moment'})
                    res.render('signup',{
                        errors
                    })
                }
                console.log("error",errors);
                //console.log("req.body",req.body)
                if(errors.length==0){
                    user.uploadsCount = user.uploadsCount + 1;                
                    user.save()
                        .then(user => {                        
                                const newNotes = new Notes({
                                    userName:user.name,
                                    userId:user._id,
                                    branch:req.body.branch,
                                    semester:req.body.semester,
                                    profName:req.body.profName,
                                    subject:req.body.subject,
                                    notesLoc:`${notes}`,
                                    noteType:req.body.noteType,
                                    year:req.body.year
                                })
                                //for checking whether req notes is same add as added note
                                RequestNotes.find({
                                    branch:req.body.branch,
                                    semester:req.body.semester,
                                    profName:req.body.profName,
                                    subject:req.body.subject,
                                    year:req.body.year,
                                    noteType:req.body.noteType
                                }).then(data => {
                                    //console.log("data got from req note",data);
                                    if(data.length!=0){
                                        data[0].solved="true"
                                        data[0].save();
                                    }
                                }).catch(err=> console.log(err));
                                //console.log("data is here in",newNotes);
                                
                                newNotes.save()
                                    .then(note=> {    
                                        if(errors.length==0)
                                            req.flash('profile_msg', `Notes uploaded.You can check it at notes section!`);
                                                                       
                                            
                                        res.redirect('/profile');
                                    })
                                    .catch(err => {
                                        console.log("error in uploading",err);
                                        user.uploadsCount = user.uploadsCount - 1;
                                        user.save();
                                        req.flash('profile_msg', `your Notes Couldnot be uploaded! Please Try again`);
                                        res.redirect('/profile');
                                    })    
                            
                        })
                        .catch(err =>{
                            console.log("profile not updated",err); 
                            req.flash('profile_msg', `your Notes Couldnot be uploaded! Please Try again`);
                            res.redirect('/profile'); 
                        })
                }else{
                    res.redirect('/profile');    
                }                   
            })
            .catch(err => {
                console.log("error",err); 
                req.flash('profile_msg', `your Notes Couldnot be uploaded! Please Try again`);
                res.redirect('/profile');  
            })
    })
});





module.exports = profile;