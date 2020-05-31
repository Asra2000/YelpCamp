var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require("../models/comment");
var middleware = require('../middleware');

// comment routes

/// comments new
router.get('/new', middleware.isLoggedIn , (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
    if(err){
        console.log("error while adding comment");
    }else{
        res.render("./comments/new", {campground : campground});
    }
});
});

//creating new comment
router.post('/', middleware.isLoggedIn , (req, res)=>{
// lookup campground using id
Campground.findById(req.params.id, (err, campgrounds)=>{
    if(err){
        // console.log(err);
        res.redirect('/campgrounds');
    }else{

// create a new Comment
Comment.create(req.body.comment, (err, comment)=>{
    if(err){
        req.flash('error', 'Something went wrong');
        console.log(err);
    }else{
        //add username and id to comment
        comment.author.id = req.user._id;
        comment.author.username  = req.user.username;
        //save comment
        comment.save();
        campgrounds.comments.push(comment);
        campgrounds.save();
        req.flash('success', 'Successfully added comment');
        res.redirect('/campgrounds/' + campgrounds._id);
    }
})
// connect new comment to the campground
// redirect campground showpage
    }
});

});
//edit route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res)=>{
    Campground.findById(req.params.id, (err, foundCamp)=>{
        if(err || !foundCamp){
            req.flash("error", "Campground not found");
            res.redirect('back');
        }
        Comment.findById(req.params.comment_id, (err, comment)=>{
            if(err || comment == null){
                req.flash("error", "Comment not found");
                res.redirect('back');
            }else{
                res.render("comments/edit", {campground_id : req.params.id, comment: comment});
            }
        })
    });
});

//updating the comment
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment , (err, updatedComment)=>{
        if(err){
            res.redirect('back');
        }else{
            res.redirect('/campgrounds/'+req.params.id);
        }
    })
});

//destroy comment without method override
router.delete('/:comment_id',middleware.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndDelete(req.params.comment_id, (err)=>{
        if(err){
            res.redirect('back');
        }else{
            req.flash('success', 'Comment destroyed');
            res.redirect('/campgrounds/'+req.params.id);
        }
    })
})

module.exports = router;