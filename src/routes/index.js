const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../../config/auth');

// router.get('/',(req,res)=>{
//     res.render('index');
// })

router.get('/profile',ensureAuthenticated,(req,res)=>{
    console.log(req);
    res.render('profile',{
        user:req.user
    });
})



module.exports = router;