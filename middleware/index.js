// all the middlewares goes here
var Campground = require('../models/campground');
var Comment = require('../models/comment'); 

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundcamp)=>{
            if(err || !foundcamp){
                // console.log(err);
                req.flash('error', 'not found');
                res.redirect('back');
            }else{
            //does he owns the campground
                if((foundcamp.author.id).equals(req.user._id))
                    next();
                else{
                    req.flash('error', 'u don\'t have permission');
                    res.redirect("back");
                }
            }
        });
        }else{
            req.flash('error', 'U need to be logged in');
            res.redirect("back");
        }
}
middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundcomment)=>{
            if(err){
                console.log(err);
                res.redirect('back');
            }else{
            //does he owns the comment
                if((foundcomment.author.id).equals(req.user._id))
                    next();
                else{
                    req.flash('error', "U don't have the permission");
                    res.redirect("back");
                }
            }
        });
        }else{
            res.redirect("back");
        }
}
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first!");
    res.redirect('/login');
}


module.exports = middlewareObj;