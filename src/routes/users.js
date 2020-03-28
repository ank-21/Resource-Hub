const express = require('express');
const userRouter = express.Router();
const User = require('../models/User');
const passport = require('passport');
const bcrypt = require('bcryptjs');


//signup Route
userRouter.get('/signup',(req,res)=>{
    let flag= req.query.flag;
    res.render('signup'); 
})

userRouter.post('/signup',(req,res)=>{
    console.log("req.body ",req.body);
    const {name,email,password,password2} = req.body;  
    let errors = [];
    //error handling

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
        console.log("password", password);
        
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
                        password
                    });
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                          if (err) throw err;
                          newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                console.log("New user: ",user);
                                req.flash('success_msg', 'You are now registered and can log in');   
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
    passport.authenticate('google', { scope: ['profile'] })
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

userRouter.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/signup');
})


module.exports = userRouter;