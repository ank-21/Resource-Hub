const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Notes = require('../models/Notes');


// /notes is in app.use
//for getting branch page

router.get('/branch',(req,res)=>{
    res.render('branch');
});

router.get('/branch/semester', async(req,res)=>{
    const branchname = req.query.branch;
    console.log(branchname);
    const selectedNotesByBranch = await Notes.find({branch:branchname});
    console.log("all branch note",selectedNotesByBranch);
    //it will give an array of object
    const allSemDetails = [];
    for(let i=1;i<=8;i++){
        eachsemvariable = selectedNotesByBranch.filter(note => {
            return note.semester == `${i}`;
        });
        console.log("each sem details",eachsemvariable);
        
        if(eachsemvariable.length==0){
            allSemDetails.push('0');
        }else{
            allSemDetails.push(eachsemvariable);
        }
    }
    res.send(allSemDetails[1]);   //as an array so start with 0
    //allsemdetails has every details of a particular branch now
    res.render('semester');

})

router.get('/branch/semester/notes',(req,res)=>{
    
})

module.exports = router;