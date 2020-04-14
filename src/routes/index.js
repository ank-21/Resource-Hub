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
const {confirmUser} = require('../account/nodemailerLogin');
const uuid = require('uuid');


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
    var page = parseInt(req.query.page)
    var limit = parseInt(req.query.limit)   //will always be 5
    const notesAll = await Notes.find({userId:req.user._id});
    const lenghtofNotes = notesAll.length;
    var notes = [];
    var last,startIndex,endIndex;
    if(!limit){
       limit = 3;
       page = 1; 
    }
    last = lenghtofNotes/limit;
    const lastExact = Math.ceil(last); 
    
    if(page > lastExact || page < 1)
    {
        page = 1;
    }
    startIndex = (page - 1) * limit;
    endIndex = page * limit;
    //for listing of notes
    notes = await Notes.find({userId:req.user._id}).sort({_id:-1}).limit(limit).skip(startIndex);     

    var ratingValue = 0;
    var passingvalue = [];
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

    var pageRequest = parseInt(req.query.pageRequest)
    var limit2 = parseInt(req.query.limit2)/2   //will always be 2
    const RequestAll = await RequestNotes.find();
    const lenghtofRequests = RequestAll.length;
    var requests = [];
    var last2,startIndex,endIndex;
    if(!limit2){
       limit2 = 2;
       pageRequest = 1; 
    }
    last2 = lenghtofRequests/(limit2*2);
    const lastExactRequest = Math.ceil(last2); 
    if(pageRequest > lastExactRequest || pageRequest < 1)
    {
        pageRequest = 1;
    }

    startIndex2 = (pageRequest - 1) * limit2;
    endIndex2 = pageRequest * limit2;

    //for request notes details
    const reqNote = await RequestNotes.find({solved:"false"}).sort({_id:-1}).limit(limit2).skip(startIndex2);
    const doneNote = await RequestNotes.find({solved:"true"}).sort({_id:-1}).limit(limit2).skip(startIndex2); 
    
    
    console.log("req note in indexjs for uploaded notes",doneNote);
    console.log("reqNote in index.js",reqNote);


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

    res.render('profile',{
        user:req.user,
        notes,
        reqNote,
        doneNote,
        ratingValue,
        floorvalue,
        lastExact,
        lastExactRequest,
        page,
        pageRequest
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

    var page = parseInt(req.query.page)
    var limit = parseInt(req.query.limit)   //will always be 5
    const notesAll = await Notes.find({userId:id});
    const lenghtofNotes = notesAll.length;
    var notes = [];
    var last,startIndex,endIndex;
    if(!limit){
       limit = 3;
       page = 1; 
    }
    last = lenghtofNotes/limit;
    const lastExact = Math.ceil(last); 
    
    if(page > lastExact || page < 1)
    {
        page = 1;
    }
    startIndex = (page - 1) * limit;
    endIndex = page * limit;
    //for listing of notes
    notes = await Notes.find({userId:id}).sort({_id:-1}).limit(limit).skip(startIndex); 
    console.log("length",notes.length);
    
    //for listing of notes
    //const notes = await Notes.find({userId:id}).sort({_id:-1}); //we have to add limit
    //console.log("notes for listing from index.js",notes);
    //for notes rate
    var ratingValue = 0;
    var passingvalue = [];
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

    res.render('publicprofile',{
        user:searchUser,
        notes,
        ratingValue,
        floorvalue,
        page,
        lastExact
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

//admin requests
router.get('/hub/admin/21',ensureAuthenticated,async(req,res)=>{
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
});

//verify email
router.get('/users/signup/:token',(req,res)=>{

    const token = req.params.token;
    const id = req.query.data;
    console.log(token,id);
    
    User.find({_id:id,token})
        .then(user => {
            console.log("user",user);
            
            const timeNow = Date.now();
            console.log(timeNow,user[0].date);
            
            if(timeNow - user[0].date<12*60*60*1000){
                console.log("Successful");
                
                user[0].verified = true;
                user[0].save()
                req.flash('success_msg', 'Verified Successfully,can login by clicking on login link');
                res.redirect('/users/signup');
            }
            else{                
                user[0].date = Date.now();
                user[0].token = user[0].token + uuid.v4();
                user[0].save()
                .then(()=>{
                    confirmUser({
                        name:user[0].name,
                        email:user[0].email,
                        id:user[0]._id,
                        token:user[0].token
                    })
                    req.flash('error_msg', 'Token Expired, Click on the new link within 12hrs');
                    res.redirect('/users/signup');
                }).catch(e=>{
                    console.log(e);
                    req.flash('error_msg', 'Token Expired, Click on the new link within 12hrs');
                    res.redirect('/users/signup');
                })    
            }
            
        })
        .catch(e => {
            console.log(e);
            
            req.flash('error_msg','Please signup again!');
            res.redirect('/users/signup')
        })
})



module.exports = router;