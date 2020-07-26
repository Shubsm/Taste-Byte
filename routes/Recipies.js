

/* Older browser support - class added by modernizr */
var express = require("express");
var router  = express.Router();
var Recipie = require("../models/Recipie");
let { checkRecipieOwnership, isLoggedIn, isPaid } = require("../middleware");
router.use(isLoggedIn, isPaid);


//INDEX - show all Recipies
router.get("/", function(req, res){
    // Get all Recipies from DB
    if (req.query.paid) res.locals.success = 'Payment succeeded, welcome to Taste-Byte!';
    Recipie.find({}, function(err, allRecipies){
       if(err){
           console.log(err);
       } else {
          res.render("Recipies/index",{Recipies:allRecipies});
       }
    });
});

//CREATE - add new Recipie to DB
router.post("/",  function(req, res){
    // get data from form and add to Recipies array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newRecipie = {name: name, price: price, image: image, description: desc, author:author}
    // Create a new Recipie and save to DB
    Recipie.create(newRecipie, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to Recipies page
            console.log(newlyCreated);
            res.redirect("/Recipies");
        }
    });
});

//NEW - show form to create new Recipie
router.get("/new",  function(req, res){
   res.render("Recipies/new"); 
});

// SHOW - shows more info about one Recipie
router.get("/:id", function(req, res){
    //find the Recipie with provided ID
    Recipie.findById(req.params.id).populate("comments").exec(function(err, foundRecipie){
        if(err){
            console.log(err);
        } else {
            console.log(foundRecipie)
            //render show template with that Recipie
            res.render("Recipies/show", {Recipie: foundRecipie});
        }
    });
});

// EDIT RECIPIE ROUTE
router.get("/:id/edit", checkRecipieOwnership, function(req, res){
    Recipie.findById(req.params.id, function(err, foundRecipie){
        if(err){
            res.render("/Recipies");
        }else{ res.render("Recipies/edit", {Recipie: foundRecipie});}
        
       
    });
});

// UPDATE RECIPIE ROUTE
router.put("/:id",checkRecipieOwnership, function(req, res){
    // find and update the correct Recipie
    Recipie.findByIdAndUpdate(req.params.id, req.body.Recipie, function(err, updatedRecipie){
       if(err){
           res.redirect("/Recipies");
       } else {
           //redirect somewhere(show page)
           res.redirect("/Recipies/" + req.params.id);
       }
    });
});

// DESTROY RECIPIE ROUTE
router.delete("/:id",checkRecipieOwnership, function(req, res){
   Recipie.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/Recipies");
      } else {
          res.redirect("/Recipies");
      }
   });
});


module.exports = router;
