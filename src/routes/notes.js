const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../../config/auth');
const User = require('../models/User');
const Notes = require('../models/Notes');
const RequestNotes = require('../models/RequestNotes');
const DeleteNote = require('../models/DeleteNote');
const moment = require('moment');

// /notes is in app.use
//for getting branch page

router.get('/branch',ensureAuthenticated,(req,res)=>{
    res.render('branch');
});

//for semester page
router.get('/branch/semester',ensureAuthenticated, async(req,res)=>{
    const branchname = req.query.branch;
    const selectedNotesByBranch = await Notes.find({branch:branchname});
    // console.log("all branch note",selectedNotesByBranch);
    //it will give an array of object
    const allSemDetails = [];
    const totalDownloadPerSem = [];
    const ratingsPerSem = [];
    var result=0;
    for(let i=1;i<=8;i++){
        var sum =0;
        var count =0;
        eachsemvariable = selectedNotesByBranch.filter(note => {
            return note.semester == `${i}`;
        });
        
        if(eachsemvariable.length==0){
            allSemDetails.push('0');
            totalDownloadPerSem.push(0);
            ratingsPerSem.push(0);
        }else{
            allSemDetails.push(eachsemvariable);
            eachsemvariable.forEach(semNote => {
                result = result + semNote.downloadCount;
                if(semNote.ratings.length!=0){
                    semNote.ratings.forEach(rate=> {
                        sum = sum + rate.rating;
                        count++;
                    });
                }
                        
            });
            if(count==0){
                ratingsPerSem.push(0);
            }else{
                ratingsPerSem.push(sum/count);
            }
           
            totalDownloadPerSem.push(result);
        }

    }
    console.log("ratings",ratingsPerSem);

    const ratingsPerSemFloored = ratingsPerSem.map((val) => {
        if(val%1==0){
            return val;
        }
        return val.toFixed(2);
    })
    
    //allsemdetails has every details of a particular branch now
    // console.log("all sem detail",allSemDetails);
    
    res.render('semester',{
        notes:allSemDetails,
        branchname,
        downloadCount:totalDownloadPerSem,
        ratingsPerSemFloored
    });
});

//for getting notes page
router.get('/branch/semester/notes', ensureAuthenticated ,async(req,res)=>{
    //console.log(req.query);
    const branchname = req.query.branch;
    const semester = req.query.semester;    
    var rating =0;
    var passingvalue = [];
    if(req.query.starvalue)
        rating = req.query.starvalue;
    console.log(rating);
    
    //now i have to average the total rating
    // const notesCount = req.query.count;

    const selectedNotesByBranchAndSemester = await Notes.find({branch:branchname,semester:semester,noteType:'note'});
    // console.log("filtered notes in notes route",selectedNotesByBranchAndSemester);

    //for getting star rating
    selectedNotesByBranchAndSemester.forEach((note)=>{
        var sum =0;
        if(note.ratings.length==0){
            passingvalue.push(0);
        }else{
            note.ratings.forEach((rate)=> {
                sum += rate.rating;
            })
            passingvalue.push(sum/note.ratings.length);
        }

    })
    console.log(passingvalue);
    const floorvalue = passingvalue.map((val) => {
        if(val%1==0){
            return val;
        }
        return val.toFixed(2);
    })
    //for floor value
    console.log(floorvalue);
    

    
    res.render('notes',{
        notes:selectedNotesByBranchAndSemester,
        floorvalue,
        branchname,
        semester,
        data:'Notes'   //this is for showing on bar
    })  
});



//for getting question page
router.get('/branch/semester/question', ensureAuthenticated ,async(req,res)=>{
    //console.log(req.query);
    const branchname = req.query.branch;
    const semester = req.query.semester;    
    var rating =0;
    var passingvalue = [];
    if(req.query.starvalue)
        rating = req.query.starvalue;
    console.log(rating);
    
    //now i have to average the total rating
    // const notesCount = req.query.count;

    const selectedNotesByBranchAndSemester = await Notes.find({branch:branchname,semester:semester,noteType:'question'});
    // console.log("filtered notes in notes route",selectedNotesByBranchAndSemester);

    //for getting star rating
    selectedNotesByBranchAndSemester.forEach((note)=>{
        var sum =0;
        if(note.ratings.length==0){
            passingvalue.push(0);
        }else{
            note.ratings.forEach((rate)=> {
                sum += rate.rating;
            })
            passingvalue.push(sum/note.ratings.length);
        }

    })
    console.log(passingvalue);
    const floorvalue = passingvalue.map((val) => {
        if(val%1==0){
            return val;
        }
        return val.toFixed(2);
    })
    //for floor value
    console.log(floorvalue);
    

    
    res.render('notes',{
        notes:selectedNotesByBranchAndSemester,
        floorvalue,
        branchname,
        semester,
        data: 'Questions'
    })  
});



//for downloading notes
router.get('/branch/semester/notes/download',(req,res)=>{
    Notes.find({branch:req.query.branch,semester:req.query.semester,_id:req.query.noteId})
        .then(note => {            
            //for notes downloaded by other user
            const userId = note[0].userId;
            const user = req.user;
            console.log(userId,user._id);
            
            if(userId != user._id){
                User.findById(userId)
                    .then(user =>{
                        user.notesDownloadedByUsers = user.notesDownloadedByUsers+ 1;
                        user.save();
                    }).catch((e)=>{
                        console.log("Error",e);                    
                    });
                    
                user.downloadCountUser = user.downloadCountUser + 1;
                user.save();
                
                note[0].downloadCount = note[0].downloadCount + 1;
                note[0].save()
                    .then(note => {
                        console.log("note in then",note);
                        res.redirect(note.notesLoc);
                    })
            }
            else{                
                res.redirect(note[0].notesLoc);
            }    
        }).catch(e => {
            res.redirect('/users/branch');
        })
});

//request page
router.post('/branch/semester/notes/request',ensureAuthenticated,async(req,res)=> {
    var data = req.query.data;
    if(data == 'Notes')
        data= 'note';
    else if(data == 'Questions')
        data = 'question';
    console.log(data);
    
    const requestmade = await RequestNotes.find({
        branch:req.body.branch,
        semester:req.body.semester,
        year:req.body.year,
        subject:req.body.subject,
        profName:req.body.profName,
        noteType:data,
        solved:"false"
    })
        
        if(requestmade.length>0){
            console.log("hii");
            
            req.flash('notes_msg', `${data} has already been requested`);
            res.redirect(`/users/branch/semester/notes?branch=${req.body.branch}&semester=${req.body.semester}`)
        }
        else{
            const note = new RequestNotes(req.body);
            note.date = moment().format('MMMM Do YYYY');
            note.solved = "false";
            note.noteType = data;
            note.save()
            .then(data => {
                req.flash('notes_msg', 'Request Submitted');
                res.redirect(`/users/branch/semester/notes?branch=${req.body.branch}&semester=${req.body.semester}`)
            })
            .catch(err => {
                res.redirect(`/users/branch/semester/notes?branch=${req.body.branch}&semester=${req.body.semester}`)
                console.log("errror in request note save", err);
            })
        }
    })  


//for rating page

router.post('/branch/semester/notes/star_rating/:id', (req,res)=> {
    var alreadyRated = false;
    var alreadyRatedfornote = false;
    const id = req.params.id;
    const userloggedinId = req.user._id;
    const rating = req.body.star;
    Notes.findById({_id:id})
        .then(note => {
            console.log(note);
            User.findById({_id:note.userId})
                .then(user => {
                   
                    if(String(user._id) == String(req.user._id))
                    {
                        req.flash('notes_msg', 'You can not rate your own note!');                        
                    }else{
                        //somebody else is rating this
                        //check if note is already rated by the req.user or not
                        note.usersRated.forEach(person => {
                            if(String(person.userId) == String(req.user._id))
                                alreadyRated = true
                        })
                        if(alreadyRated == false)
                        {
                            note.ratings = note.ratings.concat({rating});
                            user.ratings = user.ratings.concat({rating});
                            note.usersRated = note.usersRated.concat({userId:userloggedinId});
                            req.flash('notes_msg', 'Rated Successfully...');
                            user.save();

                            note.save()
                            .then(data=>{
                                console.log("data0",data);
                                res.redirect(`/users/branch/semester/notes?branch=${note.branch}&semester=${note.semester}&starvalue=${rating}`);
                            })
                            .catch(err => {
                                console.log(err);
                                res.redirect(`/users/branch/semester/notes?branch=${note.branch}&semester=${note.semester}`);
                            })
                        }
                        else{
                            console.log("already rated",alreadyRated);
                            req.flash('notes_msg', 'You can not rate the same note more than once!');
                        }
                    }
                    res.redirect(`/users/branch/semester/notes?branch=${note.branch}&semester=${note.semester}`);
                    
                })
                .catch(err => {
                    console.log(err);
                    res.redirect(`/users/branch/semester/notes?branch=${note.branch}&semester=${note.semester}`);
                })
        })
        .catch(err => {
            console.log(err);
            res.redirect(`/users/branch/semester/notes?branch=${note.branch}&semester=${note.semester}`);
        })
   
});

//deleting a note
router.get('/note/delete/:id',async(req,res)=> {

    const note = await Notes.findById(req.params.id);
    const newdeleteNote = new DeleteNote({
        branch:note.branch,
        subject:note.subject,
        semester:note.semester,
        notesLoc:note.notesLoc
    })
    await newdeleteNote.save()
    await User.findByIdAndUpdate(req.user._id,{$inc : {uploadsCount:-1}});
    await Notes.findByIdAndDelete(req.params.id);
    req.flash('profile_msg', ' Note deleted!');
    res.redirect('/profile');  
})

module.exports = router;