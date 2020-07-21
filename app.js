var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Recipie  = require("./models/Recipie"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")
    
//requiring routes
var commentRoutes    = require("./routes/comments"),
    RecipieRoutes = require("./routes/Recipies"),
    indexRoutes      = require("./routes/index")
 
//var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v12";
var url = process.env.DATABASEURL || "mongodb+srv://shubh:25061998@tastebyte.jkrbp.mongodb.net/<dbname>?retryWrites=true&w=majority";
mongoose.connect(url);

//mongodb+srv://shubh:25061998@tastebyte.jkrbp.mongodb.net/<dbname>?retryWrites=true&w=majority
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "My Kitchen is mine!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/Recipies", RecipieRoutes);
app.use("/Recipies/:id/comments", commentRoutes);

var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
app.listen(server_port, process.env.IP, function(){
   console.log("The Kitchen Server Has Started!");
});
