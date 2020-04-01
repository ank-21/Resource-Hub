const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../../config/auth');
const Notes = require('../models/Notes');

// router.get('/',(req,res)=>{
//     res.render('index');
// })

router.get('/profile',ensureAuthenticated, async(req,res)=>{
    console.log(req.user);
    const notes = await Notes.find({userId:req.user._id}).sort({_id:-1}).limit(5);
    console.log(notes);
    res.render('profile',{
        user:req.user,
        notes
    });
})



module.exports = router;