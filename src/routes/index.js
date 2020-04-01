const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../../config/auth');
const Notes = require('../models/Notes');
const {contactUs} = require('../account/nodemailer');


router.get('/',(req,res)=>{
    if(req.user){
        res.redirect('/users/home');
    }
    else{
        res.sendFile(path.join(__dirname+'..public/index.html'));
    }
    
})

router.get('/profile',ensureAuthenticated, async(req,res)=>{
    console.log("user detail in profie route",req.user);
    const notes = await Notes.find({userId:req.user._id}).sort({_id:-1}).limit(5);
    console.log(notes);
    res.render('profile',{
        user:req.user,
        notes
    });
});

router.post('/contactus',(req,res)=>{
    console.log("req.body in post route",req.body);
    const data = req.body;
    contactUs({ data });
    res.redirect('/users/home?message=true');
})



module.exports = router;