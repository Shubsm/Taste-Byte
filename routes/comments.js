var express = require("express");
var router  = express.Router({mergeParams: true});
var Recipie = require("../models/Recipie");
var Comment = require("../models/comment");
let { checkCommentOwnership, isLoggedIn, isPaid } = require("../middleware");
router.use(isLoggedIn, isPaid);
//Comments New
router.get("/new", function(req, res){
    // find Recipie by id
    console.log(req.params.id);
    Recipie.findById(req.params.id, function(err, Recipie){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {Recipie: Recipie});
        }
    })
});

//Comments Create
router.post("/",function(req, res){
   //lookup Recipie using ID
   Recipie.findById(req.params.id, function(err, Recipie){
       if(err){
           console.log(err);
           res.redirect("/Recipies");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error", "Something went wrong");
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               Recipie.comments.push(comment);
               Recipie.save();
               console.log(comment);
               req.flash("success", "Successfully added comment");
               res.redirect('/Recipies/' + Recipie._id);
           }
        });
       }
   });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {Recipie_id: req.params.id, comment: foundComment});
      }
   });
});

// COMMENT UPDATE
router.put("/:comment_id", checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/Recipies/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/Recipies/" + req.params.id);
       }
    });
});

module.exports = router;
