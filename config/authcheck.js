const path = require('path');

exports.check = (req, res, next) => {
    if(req.user && req.user.isAdmin){
        //if logged in
        next();
    }else{
        //if user is not logged in 
        
        res.redirect('/');
    }  
   };