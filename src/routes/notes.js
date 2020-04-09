const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../../config/auth');
const User = require('../models/User');
const Notes = require('../models/Notes');
const RequestNotes = require('../models/RequestNotes');
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

    const selectedNotesByBranchAndSemester = await Notes.find({branch:branchname,semester:semester});
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
        floorvalue
    })  
});

//for downloading notes
router.get('/branch/semester/notes/download',(req,res)=>{
    Notes.find({branch:req.query.branch,semester:req.query.semester,_id:req.query.noteId})
        .then(note => {
            const user = req.user;
            user.downloadCountUser = user.downloadCountUser + 1;
            user.save();
            
            note[0].downloadCount = note[0].downloadCount + 1;
            note[0].save()
                .then(note => {
                    console.log("note in then",note);
                    res.redirect(note.notesLoc);
                })
        }).catch(e => {
            res.redirect('/users/branch');
        })
});

router.post('/branch/semester/notes/request', (req,res)=> {
    console.log("req in body",req.body);
    const note = new RequestNotes(req.body);
    note.date = moment().format('MMMM Do YYYY');
    note.solved = "false";
    note.save()
        .then(data => {
            console.log(data);
            res.redirect(`/profile`);
        })
        .catch(err => {
            res.redirect('/users/branch/semester/notes')
            console.log("errror in request note save", err);
        })  
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

module.exports = router;