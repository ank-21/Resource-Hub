const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../../config/auth');
const Notes = require('../models/Notes');
const Report = require('../models/Report');
const RequestNotes = require('../models/RequestNotes');
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
    //for listing of notes
    const notes = await Notes.find({userId:req.user._id}).sort({_id:-1}).limit(5);
    console.log("notes for listing from index.js",notes);
    //for request notes details
    const reqNote = await RequestNotes.find({solved:"false"});
    const doneNote = await RequestNotes.find({solved:"true"});
    console.log("req note in indexjs for uploaded notes",doneNote);
    
    console.log("reqNote in index.js",reqNote);
    
    res.render('profile',{
        user:req.user,
        notes,
        reqNote,
        doneNote
    });
});

//form in index.js
router.post('/contactus',(req,res)=>{
    console.log("req.body in post route",req.body);
    const data = req.body;
    contactUs({ data });
    const report = new Report(req.body);
    console.log("report",report);
    
    report.save()
        .then(data => {
            console.log("data her",data);
            
            res.redirect('/users/home?message=true');
        })
        .catch(err => {
            res.redirect('/users/home?message=false')
        })
})



module.exports = router;