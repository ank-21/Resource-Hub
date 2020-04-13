const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../../config/auth');
const User = require('../models/User');
const Notes = require('../models/Notes');
const Report = require('../models/Report');
const RequestNotes = require('../models/RequestNotes');
const DeleteNote = require('../models/DeleteNote');
const path = require('path');
const {contactUs} = require('../account/nodemailer');


router.get('/', async(req,res)=>{
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
        const user = await User.find();        
    
        res.render('index',{
        user:req.user,
        message:msg,
        flag,
        users:user
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
    const reqNote = await RequestNotes.find({solved:"false"}).sort({_id:-1});;
    const doneNote = await RequestNotes.find({solved:"true"}).sort({_id:-1});;
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


//public profile page

router.get('/users/publicProfile/:id',ensureAuthenticated,async(req,res)=>{
    const id = req.params.id;
    const searchUser = await User.findById(id);
    if(String(req.user._id) == String(searchUser._id)){
        res.redirect('/profile');
    }else{
        searchUser.profileViewCount = searchUser.profileViewCount + 1;
    searchUser.save();
    var ratingValue = 0;
    var passingvalue = [];
    //for listing of notes
    const notes = await Notes.find({userId:id}).sort({_id:-1}); //we have to add limit
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
    const reqNote = await RequestNotes.find({solved:"false"}).sort({_id:-1});;
    const doneNote = await RequestNotes.find({solved:"true"}).sort({_id:-1});;
    //console.log("req note in indexjs for uploaded notes",doneNote);
    //console.log("reqNote in index.js",reqNote);


    //for rating of user
    if(searchUser.ratings.length != 0){
        searchUser.ratings.forEach(rate => {
            ratingValue += rate.rating;
        });
        ratingValue = ratingValue/searchUser.ratings.length;
    }
    else{
        ratingValue = 0;
    }
    

    if(ratingValue%1!=0){
        ratingValue = ratingValue.toFixed(1);
    }
    //console.log("rating value", ratingValue);

    res.render('publicprofile',{
        user:searchUser,
        notes,
        reqNote,
        doneNote,
        ratingValue,
        floorvalue
    });
    }
    
            
})

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

router.get('/hub/admin/21',async(req,res)=>{
    const admins_id = ['5e8f94ee8500c35ebc9a11c9','5e936a7f2350706f9a0c5542','5e9325bd2350706f9a0c5541'];
    const auth = admins_id.indexOf(String(req.user._id));
    if(auth==-1){
        res.render('error');
    }else{
        const users = await User.find();
        const notes = await Notes.find();
        const reports = await Report.find();
        const requestNotes = await RequestNotes.find();
        const deleteNote = await DeleteNote.find(); 

        res.render('admin',{
            name:req.user.name,
            users,
            notes,
            reports,
            requestNotes,
            deleteNote
        })
    }
})



module.exports = router;