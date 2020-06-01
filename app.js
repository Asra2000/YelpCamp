var express             = require("express"),
       app              = express(),
       bodyParser       = require("body-parser"),
         mongoose       = require("mongoose"),
         passport       = require('passport'),
         methodOverride = require('method-override'),
      LocalStrategy  = require('passport-local'),
        User            = require('./models/user'),
        flash           = require('connect-flash');


//requiring routes
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");
//////////////////////////////////////////////////////////////////////////////
// mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb+srv://Asra:asra@2000@cluster0-cqrao.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser : true, useUnifiedTopology: true });
var Campground = require('./models/campground');
var Comment = require('./models/comment'),
 seedDB = require('./seeds');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
// require('dotenv').config();
// seedDB();//seed the database

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: "Asra doesn't give damn",
    resave : false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//global middleware
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})


app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use('/campgrounds',campgroundRoutes);

app.listen(process.env.PORT||3000, ()=>{
    console.log("the server is executing");
});

