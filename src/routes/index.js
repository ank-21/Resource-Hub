const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../../config/auth');
const User = require('../models/User');
const Notes = require('../models/Notes');
const Report = require('../models/Report');
const RequestNotes = require('../models/RequestNotes');
const DeleteNote = require('../models/DeleteNote');
const path = require('path');
const {contactUs,contactAdmin, sendCorrectionMail } = require('../account/nodemailer');
const {confirmUser} = require('../account/nodemailerLogin');
const uuid = require('uuid');
const multer = require('multer');
const async = require('async');
const fs = require('fs');
const {checkFileType} = require('../../config/checkFileType');
const { popularNotesList, recentUploads, mostDownloadedNotes, popularProfiles } = require('../../config/footerInfo');

router.get('/', async(req,res)=>{
    if(req.user){
        var flag =1;
        if(req.query.message=='true'){
            var msg = `${req.user.name}, your request is sent! Check Your Email...`;
        }
        else if(req.query.message=='false'){
            var msg2 = req.query.err;
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
    if(msg2 != undefined){
        msg = msg + " " + msg2;
    }
    // console.log(User)
    const mostDownloaded = await mostDownloadedNotes();
    const user = await User.find();
    const popularProfile = await popularProfiles();
    const recentNotes = await recentUploads();
    const popularNotes = await popularNotesList();

    res.render('index',{
    user:req.user,
    message:msg,
    flag,
    users:user,
    mostDownloaded,
    popularProfile,
    recentNotes,
    popularNotes
    });
});

//getting developers page

router.get('/developers',ensureAuthenticated,async (req,res)=>{
    const mostDownloaded = await mostDownloadedNotes();
    const popularProfile = await popularProfiles();
    const recentNotes = await recentUploads();
    const popularNotes = await popularNotesList();
    res.render('team',{
        mostDownloaded,
        popularProfile,
        recentNotes,
        popularNotes
    });
});



//for editing notes in the profile page

router.post('/users/editNote/profile/:id',ensureAuthenticated,async(req,res)=>{
    const id = req.params.id;
    const note = await Notes.findById(id);
    note.branch = req.body.branch;
    note.semester = req.body.semester;
    note.subject = req.body.subject;
    note.year = req.body.year;
    note.profName = req.body.profName;
    note.noteType = req.body.noteType;
    await note.save();
    req.flash('profile_msg','your note is edited.You can check it in your notes list!');
    res.redirect('/profile');
        
})




//getting profile page

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
    //console.log("revdwd",RequestAll);
    
    const lenghtofRequests = RequestAll.length;
    var requests = [];
    var last2,startIndex,endIndex;
    if(!limit2){
       limit2 = 2;
       pageRequest = 1; 
    }
    const reqNoteOnly = await RequestNotes.find({solved:"false"});  //4
    const doneNoteOnly = await RequestNotes.find({solved:"true"});   //1
    if(reqNoteOnly.length>doneNoteOnly.length){
        last2 = reqNoteOnly.length/limit2;
    }else{
        last2 = doneNoteOnly.length/limit2;
    }
    
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
    
    //for report of notes decrementing user rating
    if(req.user.reports>=5 && ratingValue != 0){
        ratingValue = ratingValue - req.user.reports/5;
    }
    //console.log("rationg value",ratingValue);
    

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
    //console.log("length",notes.length);
    
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
    
    //for report of notes decrementing user rating
    if(searchUser.reports>=5&&ratingValue!=0){
        ratingValue = ratingValue - searchUser.reports/5;
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



//contact us form in index.js
//Now file upload is also to be added

// old version
// router.post('/contactus',(req,res)=>{
//     console.log("req.body in post route",req.body);
//     const data = req.body;
//     contactUs({ data });
//     const report = new Report(req.body);
//     console.log("report",report);
//     report.save()
//         .then(data => {
//             console.log("data her",data);
            
//             res.redirect('/?message=true');
//         })
//         .catch(err => {
//             res.redirect('/?message=false')
//         })
// });


//set disk storage of profile image
const storage = multer.diskStorage({
    destination: function(req,file,cb){
            var newDestination = __dirname + `/../../Public/issue/${req.user._id}`;
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
  }).array('issue',3);


//post request for issue
router.post('/contactus',async function(req,res){
    let errors = [];
    var avatar = [];
    async.each(['abc'],(item,cb)=>{
        upload(req,res,(err)=>{            
            if(err){
                errors.push({msg:err})
                //req.flash('profile_msg',err.message? err.message : err );
                console.log("err1",errors);
                avatar=[];
                cb(avatar);
            } else{
                console.log("file in uploads",req.files);
                if(req.files.length== 0){
                    errors.push({msg:'No Image Selected'})
                    console.log("err2",errors);
                    avatar = ['admin'];
                    cb(avatar);
                }
                else{
                    for(var i=0;i<req.files.length;i++){
                        avatar[i] = `/issue/${req.user._id}/${req.files[i].filename}`;
                    }
                    console.log("avatar",avatar);
                    cb(avatar);  
                }
            }
      }) 
    },(avatar)=>{
        if(avatar.length == 0)
        {
            res.redirect('/?message=false&err= and only upto 3 images of total maximum size 1 MB each');
        }else{
            contactUs({
                email:req.body.email,
                name:req.body.name,
                subject:req.body.subject,
                message:req.body.message
            })

            const report = new Report({
                email:req.body.email,
                name:req.body.name,
                subject:req.body.subject,
                message:req.body.message
            })
            if(avatar[0]!='admin')
            {
                var loc = '';
                for(var i=0;i<avatar.length;i++){
                    loc += `${avatar[i]}------`;
                }
                report.issueImageLoc = loc;              
            }
            
            contactAdmin({
                email:report.email,
                name:report.name,
                subject:report.subject,
                message:report.message,
                isImg:report.issueImageLoc?'yes':'No'
            })
            report.save()
            .then(data=> {
                console.log("check",data);
                res.redirect('/?message=true')
            }).catch(err => {
                res.redirect('/?message=false')
            })
        } 
        })
    });


//admin requests
router.get('/hub/admin/21',ensureAuthenticated,async(req,res)=>{
    const admins_id = ['5e95c02f6a12672fe41ba35e','5e95ab7d684e942e865c884d','5e94dd539d2c72236dbe41cc','5e9ae832f5e826571041ee7e'];
    const auth = admins_id.indexOf(String(req.user._id));
    if(auth==-1){
        res.render('error');
    }else{
        let data = req.query.model;
        var arr = [];
        if(data==undefined ||data=='User'){
            var dataDetails = await User.find();
        }else if(data=='Notes'){
            var dataDetails = await Notes.find();
            
        }else if(data=='Report'){
            var dataDetails = await Report.find();
        }else if(data=='RequestNotes'){
            var dataDetails = await RequestNotes.find();
        }else if(data=='DeleteNote'){
            var dataDetails = await DeleteNote.find();
        }
        
        if(data == undefined)
            data = 'User';
         
        res.render('admin',{
            name:req.user.name,
            // name:"ujjawal",
            dataDetails,
            data
        })
    }
});

// Delete a particular user by admin
router.get('/hub/admin/21/delete/:id',ensureAuthenticated,async (req,res)=>{
    const admins_id = ['5e95c02f6a12672fe41ba35e','5e95ab7d684e942e865c884d','5e94dd539d2c72236dbe41cc','5e9ae832f5e826571041ee7e'];
    const auth = admins_id.indexOf(String(req.user._id));
    if(auth==-1){
        res.render('error');
    }else{
        try {
            const user = await User.findById(req.params.id);
            user.blocked = true;
            await user.save();
            res.redirect('/hub/admin/21');
        } catch (err) {
            console.error(err);
            res.redirect('/hub/admin/21');
        }
    }
});

// Send mail to a particular user by admin
router.get('/hub/admin/21/mail/:id',ensureAuthenticated,async (req,res)=>{
    const admins_id = ['5e95c02f6a12672fe41ba35e','5e95ab7d684e942e865c884d','5e94dd539d2c72236dbe41cc','5e9ae832f5e826571041ee7e'];
    const auth = admins_id.indexOf(String(req.user._id));
    if(auth==-1){
        res.render('error');
    }else{
        try {
            const user = await User.findOne({_id:req.params.id});
            if(!user){
                res.redirect('/hub/admin/21');
            }
            else{
                if(user.blocked === false){
                    sendCorrectionMail({
                        name:user.name,
                        id: user._id,
                        email:user.email
                    });
                }
                res.redirect('/hub/admin/21');
            }
        } catch (err) {
            console.error(err);
            res.redirect('/hub/admin/21');
        }
    }
})

//verify email
router.get('/users/signup/:token',(req,res)=>{
    const token = req.params.token;
    const id = req.query.data;
    //console.log(token,id);
    
    User.find({_id:id,token})
        .then(user => {
            //console.log("user",user);
            
            const timeNow = Date.now();
            //console.log(timeNow,user[0].date);
            
            if(timeNow - user[0].date<12*60*60*1000){
                //console.log("Successful");
                
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