const express = require('express');
const profile = express.Router();
const User = require('../models/User');

profile.post('/profile/:id',(req,res)=>{
    console.log("details of branch",req.body);
    const id = req.params.id;
    console.log("id",id);
    
    User.findById({_id:id})
        .then(user => {
            if(!user){
                res.send("No database found at this moment");
            }
            user.branch = req.body.branch;
            user.semester = req.body.semester;
            user.phnNo = req.body.phnNo;
            user.save()
                .then(user => {
                    res.render('profile',{
                        user
                    })
                })
                .catch(err =>{
                    console.log("profile not updated");
                    
                })
        })
        .catch(err => {
            console.log("error",err);   
        })
})

module.exports = profile;