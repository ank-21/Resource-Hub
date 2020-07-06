const express = require('express');
const userRouter = express.Router();
const User = require('../models/User');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { ensureAuthenticated } = require('../../config/auth');
const {confirmUser, sendForgotPasswordMail} = require('../account/nodemailerLogin');
const jwt = require('jsonwebtoken')
const Secret = require('../../config/keys');

//signup Route
userRouter.get('/signup',(req,res)=>{
    let flag= req.query.flag;
    res.render('signup'); 
});

userRouter.get('/forgotPassword',(req,res)=>{
    res.render('forgotPassword');
})

userRouter.post('/forgotPassword',async (req,res)=>{
    errors = [];
    const user = await User.findOne({ email:req.body.email});
    if(!user){
        errors.push( { msg: "Email Address doesn't exist"});
        res.render('forgotPassword',{
            errors
        });
    }
    if(user.blocked === true){
        errors.push( { msg: "Email Address blocked by admin"});
        res.render('forgotPassword',{
            errors
        });
    }
    const token = jwt.sign( { _id: user._id.toString() } , Secret.Secret.key)
    console.log(token);
    sendForgotPasswordMail({
        name:user.name,
        email:user.email,
        id:user._id,
        token:token
    })
    req.flash('success_msg','A link has been sent to you email address');
    res.redirect('/users/signup');
})

userRouter.get('/forgotPassword/:token',async (req,res)=>{
    const id = req.query.data;
    const user = await User.find({_id:id});
    if(!user){
        req.flash('error_msg','User not found, try resetting again');
        res.redirect('/users/forgotPassword');
    }
    if(user.blocked === true){
        req.flash('error_msg','Email address blocked by admin');
        res.redirect('/users/signup');
    }
    else{
        res.render('updatePassword',{
            email:user[0].email
        });
    }
});
userRouter.post('/forgotPassword/updatePassword',async(req,res)=>{
    const errors = [];
    const { password, confirmPassword, email } = req.body;
    if(password !== confirmPassword){
        errors.push({msg:'Password and confirm password must be same'})
    }
    if(password.toLowerCase() === "password" || password.length<6){
        errors.push({ msg: "Try some strong password"})
    }
    if(errors.length>0){
        res.render('updatePassword',{
            errors,
            email,
            password,
            confirmPassword
        })
    }
    else{
        let newPassword;
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) throw err;
                newPassword = hash;
                const user = await User.findOne({email});
                if(!user){
                    req.flash('error_msg','User does not exist');
                    res.redirect('/users/signup');
                }
                user.password = newPassword;
                await user.save();
                req.flash('success_msg','Password reset successful. You can now login');
                res.redirect('/users/signup');
                })
        })
    }
})

userRouter.post('/signup',(req,res)=>{
    console.log("req.body ",req.body);
    const {name,email,password,password2,terms} = req.body;  
    let errors = [];
    //error handling
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(email)){
        errors.push({msg:"Email address invalid"})
    }
    if(terms!='yes'){
        errors.push({msg : "Please check the terms & Conditions box." })
    }

    if(password !== password2){
        errors.push({msg : "Password and Confirm Password Should be same." })
    }

    if(password.toLowerCase() === "password" || password.length<6){
        errors.push({ msg: "Try some strong password"})
    }

    if(errors.length>0){
        res.render('signup',{
            errors,
            name,
            email,
            password,
            password2
        })
        // console.log("password", password);
        
        console.log("errors: ",errors);
        
    }else{
        //validation Passed
        User.findOne({ email: email })
            .then(user => {
                if(user) {
                    //user exists
                    errors.push( { msg: "Email Address Already exists."})
                    res.render('signup',{
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })  
                }else{
                    //save the new user in the database
                    const newUser = new User({
                        name,
                        email,
                        password,
                        date:Date.now(),
                    });
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                          if (err) throw err;
                          newUser.password = hash;
                          const token = newUser.generateAuthToken();
                            newUser.save()
                                .then(user => {
                                console.log("New user: ",user);
                                confirmUser({
                                    name:user.name,
                                    email:user.email,
                                    id:user._id,
                                    token:user.token
                                })
                                req.flash('success_msg','Successfuly registered, verify your account at email');
                                //req.flash('success_msg', 'You are now registered and can log in');   
                                //to display the flash message we will use messages.ejs in partials
                                
                                //redirect to login page
                                res.redirect('/users/signup?flag=1');
                                })
                                .catch(err => console.log(err));                    
                        });
                    })
                }
            })
            .catch(err => console.log(err));
    }   
});

userRouter.post('/login', (req,res,next)=> {
    passport.authenticate('local', {
        successRedirect: '/profile',
        failureRedirect: '/users/signup',
        failureFlash : true
    })(req,res,next);
});

//for jwt

// userRouter.post('/login',(req,res)=>{
//     const user = User.findOne({email:req.body.email})
//         .then(user => {
//             if(!user){
//                 req.flash('error_msg', 'Email is not registered');
//             }else{}
//         })
//         .catch(err => console.log(err));
// })


//for google

userRouter.get('/google',
    passport.authenticate('google',
        { 
            scope: [
                'profile',
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
            ] 
        }
    )
);

userRouter.get('/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('/profile');
});

//facebook login

userRouter.get('/facebook',
    passport.authenticate('facebook')
);

userRouter.get('/facebook/callback', passport.authenticate("facebook", {
    successRedirect: "/profile",
    failureRedirect: "/users/signup"
  }));


  userRouter.get('/linkedin',
  passport.authenticate('linkedin')
);

userRouter.get('/linkedin/callback', passport.authenticate("linkedin", {
  successRedirect: "/profile",
  failureRedirect: "/users/signup"
}));

//Logout handle

userRouter.get('/logout', ensureAuthenticated,(req,res)=>{
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/signup');
});


module.exports = userRouter;