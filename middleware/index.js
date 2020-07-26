var Recipie = require("../models/Recipie");
var Comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkRecipieOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Recipie.findById(req.params.id, function(err, foundRecipie){
           if(err){
               req.flash("error", "Recipie not found");
               res.redirect("back");
           }  else {
               // does user own the Recipie?
            if(foundRecipie.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}
 middlewareObj.checkUserRecipie= function(req, res, next){
    Recipie.findById(req.params.id, function(err, foundRecipie){
      if(err || !foundRecipie){
          console.log(err);
          req.flash('error', 'Sorry, that Recipie does not exist!');
          res.redirect('/Recipies');
      } else if(foundRecipie.author.id.equals(req.user._id) || req.user.isAdmin){
          req.Recipie = foundRecipie;
          next();
      } else {
          req.flash('error', 'You don\'t have permission to do that!');
          res.redirect('/Recipies/' + req.params.id);
      }
    });
  }
middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middlewareObj.isPaid = function(req, res, next){
    if (req.user.isPaid) return next();
    req.flash("error", "Please pay registration fee before continuing");
    res.redirect("/checkout");
}
module.exports = middlewareObj;
