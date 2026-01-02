const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("../views/signup.ejs");
});

//saving the data. creating for the user
router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser, (err) => {
        //same login method like the logout ,method
        if (err) {
          return next(err);
        } else {
          req.flash("success", "registered successfully,  welcome at AIRDND");
          res.redirect("/listings");
        }
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

//login get and post
router.get("/login", (req, res) => {
  res.render("../views/login.ejs");
});
router.post(
  "/login", ///this authenticate function will automatically check and authenticate the user,
  passport.authenticate("local", {
    //{strategy=local, options}
    failureRedirect: "/login", //if fails
    failureFlash: true, //error maessage will be shown
  }),
  (req, res) => {
    req.flash("success", "welcome to AIRDND, you are logged in");
    res.redirect("/listings");
  }
);

//logout route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "you are logged out now");
    return res.redirect("/listings");
  });
});
module.exports = router;
