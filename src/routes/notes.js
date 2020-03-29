const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Notes = require('../models/Notes');


// /notes is in app.use
//for getting branch page

router.get('/branch',(req,res)=>{
    res.render('branch');
});

router.get('/branch/semester',(req,res)=>{
    
})



module.exports = router;