const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook')
const keys = require('../config/keys');
const User = require('../src/models/User');
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy; 
const {confirmUser} = require('../src/account/nodemailerLogin');


module.exports = function(passport) {
    passport.use(
        new localStrategy({usernameField: 'email'}, (email, password, done) => {
            //Match user
            User.findOne({ email })
                .then(user => {
                    if(!user){
                        return done(null, false , { message: 'Email is not registered' });
                    }
                    //so if user exists we have to match the password

                    bcrypt.compare(password, user.password, (err,isMatch) => {
                        if (err){
                            return done(null,false, {message: 'Try again!'});
                        }

                        if(isMatch){
                            if(user.verified == true && user.blocked === false){
                                return done(null,user);
                            }
                            else if(user.blocked === true){
                                return done(null,false,{message:'You are blocked by the admin'});
                            }
                            else{
                                return done(null,false, {message: 'Verify your Email first'});
                            }
                        }else{
                            return done(null,false, {message: 'Incorrect Password!'});
                        }
                    })

                })
                .catch(err => console.log(err));
        })
    );
    passport.use(
        new GoogleStrategy({
            //option for google strategy
            clientID: keys.google.clientID,
            clientSecret: keys.google.clientSecret,
            callbackURL: '/users/google/callback'
        }, (accessToken,refreshToken,profile,done )=> {
            //passport callback function
            console.log("profile in passport",profile);
            
            User.findOne({googleId:profile.id})
                .then(currentUser => {
                    if(currentUser){
                        //already have a user
                        console.log('user is', currentUser);
                        done(null,currentUser);
                        
                    }else{
                        //create user in the db
                        const user = new User({
                            name:profile.displayName,
                            googleId:profile.id,
                            email:profile.emails[0].value
                        })
                        user.save()
                            .then(newUser => {
                                console.log('new user created',newUser);    
                                done(null,newUser);
                                //from here it will go to serialize user
                            })
                            .catch("error from passport",err => console.log(err));
                    }
                })   
        })
    )


    passport.use(new FacebookStrategy({
        clientID: keys.facebook.clientID,
        clientSecret: keys.facebook.clientSecret,
        callbackURL: '/users/facebook/callback',
        profileFields: ["email","name"]
      },(accessToken, refreshToken, profile, done) => {
        console.log("profile",profile);
        
        User.findOne({facebookId:profile.id})
            .then(currentUser => {
                if(currentUser){
                    //already have a user
                    console.log('user is', currentUser);
                    done(null,currentUser);
                    
                }else{
                    //create user in the db
                    const user = new User({
                        name:`${profile._json.first_name} ${profile._json.last_name}`,
                        facebookId:profile.id,
                    })
                    user.save()
                        .then(newUser => {
                            console.log('new user created',newUser);    
                            done(null,newUser);
                            //from here it will go to serialize user
                        })
                        .catch(err => console.log(err));
                }
            })
      }
    ));


   passport.use(new LinkedInStrategy({
        clientID: keys.linkedin.clientID,
        clientSecret: keys.linkedin.clientSecret,
        callbackURL: "/users/linkedin/callback",
        scope: ['r_emailaddress', 'r_liteprofile'],
      }, function(accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
            console.log("profile",profile);
            
            
            User.findOne({linkedinId:profile.id})
            .then(currentUser => {
                if(currentUser){
                    //already have a user
                    console.log('user is', currentUser);
                    return done(null,currentUser);    
                }else{
                    //create user in the db
                    const user = new User({
                        name: profile.displayName,
                        linkedinId:profile.id,
                        email:profile.emails[0].value
                    })
                    user.save()
                        .then(newUser => {
                            console.log('new user created',newUser);    
                            return done(null,newUser);
                            //from here it will go to serialize user
                        })
                        .catch(err => console.log(err));
                }
            })
        })
      }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
    passport.deserializeUser((id, done) => {
            User.findById(id, (err, user)=> {
                done(err, user);
              });
        
    });
}

