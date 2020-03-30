const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../../config/auth');
const User = require('../models/User');
const Notes = require('../models/Notes');


// /notes is in app.use
//for getting branch page

router.get('/branch',ensureAuthenticated,(req,res)=>{
    res.render('branch');
});


router.get('/branch/semester',ensureAuthenticated, async(req,res)=>{
    const branchname = req.query.branch;
    console.log(branchname);
    const selectedNotesByBranch = await Notes.find({branch:branchname});
    // console.log("all branch note",selectedNotesByBranch);
    //it will give an array of object
    const allSemDetails = [];
    for(let i=1;i<=8;i++){
        eachsemvariable = selectedNotesByBranch.filter(note => {
            return note.semester == `${i}`;
        });
        
        if(eachsemvariable.length==0){
            allSemDetails.push('0');
        }else{
            allSemDetails.push(eachsemvariable);
        }
    }
    //allsemdetails has every details of a particular branch now
    // console.log("all sem detail",allSemDetails);
    
    res.render('semester',{
        notes:allSemDetails,
        branchname
    });
});

router.get('/branch/semester/notes', ensureAuthenticated ,async(req,res)=>{
    console.log(req.query);
    const branchname = req.query.branch;
    const semester = req.query.semester;
    // const notesCount = req.query.count;

    const selectedNotesByBranchAndSemester = await Notes.find({branch:branchname,semester:semester});
    console.log("filtered notes in notes route",selectedNotesByBranchAndSemester);
    res.render('notes',{
        notes:selectedNotesByBranchAndSemester
    })
    
})

module.exports = router;