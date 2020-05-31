var express = require("express");
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

/////////////////////////////////////////////////////
// pertaining to payment
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const paymentIntent = await stripe.paymentIntents.create({
    amount : 1099,//actual price * 100
    currency: 'usd',
    metadata: {integration_check: 'accept_a_payment'},
});

router.get("/", (req, res)=>{
    res.render("landing");
    });
    
    // ===============================================================================
    
    //AUTH ROUTES
    router.get('/register', (req, res)=>{
        res.render('register')
    });
    router.post('/register', (req, res)=>{
        // console.log(req.body.username);
        var newUser = new User({username: req.body.username});
       User.register(newUser, req.body.password, (err, user)=>{
           if(err){
               console.log(err);
                req.flash('error', err.message);
               return res.render("register");
           }
           passport.authenticate('local')(req, res, ()=>{
               req.flash('success', 'WELCOME '+user.username);
               res.redirect("/campgrounds");
           });
       });
    })
    
    //show login form
    router.get("/login", function(req, res){
        req.flash('error', 'Login first');
        res.render('login');
    })
    router.post('/login', passport.authenticate('local', {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
        }),      (req, res)=>{
    });
    
    //logout route
    router.get('/logout', (req, res)=>{
        req.logOut();
        req.flash('success', 'Logged U out!');
        res.redirect('/campgrounds');
    })

module.exports = router;