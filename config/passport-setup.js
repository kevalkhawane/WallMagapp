 const passport = require('passport');
 const GoogleStrategy =  require('passport-google-oauth20');
 const User = require('../models/user-model');

 passport.serializeUser((user,done)=>{
    done(null,user.id);
 });

 passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        done(null,user);
    });    
 });
 passport.use(new GoogleStrategy({
    //options for the google strategy
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
 },(accessToken,refreshToken,profile,done) => {
    //check user already exists
    //console.log(profile);
    User.findOne({googleId:profile.id}).then((currentUser) => {
        if(currentUser){
            //already have the user
           // console.log('user is: '+ currentUser);
            done(null,currentUser);
        }else{
            //if already not the user
            //add user
            new User({
            username:profile.displayName,
            googleId:profile.id,
            thumbnail: profile._json.picture,
            isAdmin: false            
            }).save().then((newUser) => {
           // console.log('new user created '+newUser)
            done(null,newUser);
            });  
        }
    });
    }
    )
 );
