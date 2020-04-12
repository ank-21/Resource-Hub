const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../../config/auth');
const Notes = require('../models/Notes');
const Report = require('../models/Report');
const RequestNotes = require('../models/RequestNotes');
const path = require('path');
const {contactUs} = require('../account/nodemailer');


router.get('/',(req,res)=>{
    if(req.user){
        var flag =1;
        if(req.query.message=='true'){
            var msg = `${req.user.name}, your request is sent! Check Your Email...`;
        }
        else if(req.query.message=='false'){
            var msg = `${req.user.name}, your request could not be sent! Please Try again`;
        }
        else{
            var msg = '';
        }
    }else{
        var flag = 0;
        if(req.query.message=='true'){
            var msg = 'Your request is sent! Check Your Email...';
        }
        else if(req.query.message=='false'){
            var msg = `Your request could not be sent! Please Try again`;
        }
        else{
            var msg = '';
        }
    }
    
        res.render('index',{
        user:req.user,
        message:msg,
        flag
        });
});

router.get('/developers',ensureAuthenticated,(req,res)=>{
    res.render('team');
})

router.get('/profile',ensureAuthenticated, async(req,res)=>{
    var ratingValue = 0;
    var passingvalue = [];
    //for listing of notes
    const notes = await Notes.find({userId:req.user._id}).sort({_id:-1}); //we have to add limit
    //console.log("notes for listing from index.js",notes);
    //for notes rate
    notes.forEach((note)=>{
        var sumofnote =0;
        if(note.ratings.length==0){
            passingvalue.push(0);
        }else{
            note.ratings.forEach((rate)=> {
                sumofnote += rate.rating;
            })
            passingvalue.push(sumofnote/note.ratings.length);
        }

    })
    //console.log("passing value",passingvalue);
    const floorvalue = passingvalue.map((val) => {
        if(val%1==0){
            return val;
        }
        return val.toFixed(2);
    })
    console.log("floor value",floorvalue)



    //for request notes details
    const reqNote = await RequestNotes.find({solved:"false"});
    const doneNote = await RequestNotes.find({solved:"true"});
    //console.log("req note in indexjs for uploaded notes",doneNote);
    //console.log("reqNote in index.js",reqNote);


    //for rating of user
    if(req.user.ratings.length != 0){
        req.user.ratings.forEach(rate => {
            ratingValue += rate.rating;
        });
        ratingValue = ratingValue/req.user.ratings.length;
    }
    else{
        ratingValue = 0;
    }
    

    if(ratingValue%1!=0){
        ratingValue = ratingValue.toFixed(1);
    }
    //console.log("rating value", ratingValue);

    res.render('profile',{
        user:req.user,
        notes,
        reqNote,
        doneNote,
        ratingValue,
        floorvalue
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
            
            res.redirect('/?message=true');
        })
        .catch(err => {
            res.redirect('/?message=false')
        })
});






module.exports = router;