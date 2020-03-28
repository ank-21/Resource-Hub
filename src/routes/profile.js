const express = require('express');
const profile = express.Router();
const User = require('../models/User');
const uuid = require('uuid');
const multer = require('multer');
const path = require('path');
const {checkFileType} = require('../../config/checkFileType');
const async = require('async');
const { ensureAuthenticated } = require('../../config/auth');
const fs = require('fs');

//set disk storage
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
                user.avatar = '/img/avatar.png'  
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
                    req.flash('success_msg', 'Profile Updated!');
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
})




module.exports = profile;