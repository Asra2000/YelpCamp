var express = require("express");
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware'); // index.js is a special name(like a )

//INDEX ROUTE
router.get("/", (req, res)=>{
    //get all the campgrounds from the db
    Campground.find({}, (err, allcampgrounds)=>{
            if (err)
            console.log("error");
            else{
                 res.render("./campgrounds/index", {campgrounds: allcampgrounds});
            }
    });
});

//new
router.get("/new", middleware.isLoggedIn , (req, res)=>{
    res.render("./campgrounds/new");
});

//create the new campground
router.post("/", middleware.isLoggedIn, (req, res)=>{
    //get data from form and add to array
    var name = req.body.name;
    var url = req.body.url;
    var des = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username : req.user.username
    }
    var newcampground = {name: name, image: url, description: des, author: author,price: price };
    Campground.create(newcampground, (err, newlyCreated)=>{
            if(err)
            console.log("can't add")
            else{
            req.flash('success', 'campground created!');
            res.redirect("/campgrounds");
            } //default is redirect to the get request
        });
});
// SHOW ROUTES to show more content about a particular id
router.get("/:id", (req, res)=>{
    //find the campgrounds with providede id
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec((err,foundcamp)=>{
        if(err || !foundcamp){
        req.flash('error', 'Campground not found');
        res.redirect('back');
        }
        else{
            //render show tempelate with that campground
            res.render("./campgrounds/show",{campground: foundcamp});
        }

    });
});

//edit campground routes
router.get('/:id/edit',middleware.checkCampgroundOwnership, (req, res)=>{
    Campground.findById(req.params.id,(err, foundcamp)=>{
            res.render('./campgrounds/edit', {campground: foundcamp});
    });
});

//update campgrounds routes
router.put("/:id",middleware.checkCampgroundOwnership , (req, res)=>{
    var data = req.body.campground;
    Campground.findByIdAndUpdate(req.params.id, data, (err, updatedCampground)=>{
        if(err){
            res.redirect("/campground");
        }else{
            req.flash('success', 'Updated the campground');
            res.redirect("/campgrounds/"+ req.params.id);
        }
    })
});

//destroy campground
router.delete('/:id',middleware.checkCampgroundOwnership, (req, res)=>{
    Campground.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            res.redirect("/campgrounds");
        }else{
            req.flash('success', 'campground destroyed');
            res.redirect("/campgrounds");
        }
    })
})

module.exports = router;

