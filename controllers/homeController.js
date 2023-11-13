const path = require('path');
exports.getlogin = (req, res, next) => {
    if(req.user && req.user.isAdmin){
        //if logged in
        res.redirect('/admin/dashboard');
    }else{
        //if user is not logged in 
        
        res.sendFile(path.join(__dirname, '..', 'public','html', 'login.html')); 
    } 
       
   };