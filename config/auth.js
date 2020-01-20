module.exports = {
    ensureAuthenticated:function(req, res, next) {
if(req.isAuthenticated()) {
    // res.render('dashboard');
    return next();
    // return "hello world";
   
}else{
    req.flash('error_msg', 'Please log In to view this resource');
    res.redirect('/users/login')
        }
}


};