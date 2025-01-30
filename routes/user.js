const express=require("express");
const router= express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} =require("../middleware.js");

const userController=require("../controllers/user.js");


//   sign up form && sigup 
router.route("/signup")
.get(userController.rendersignupform)
.post( wrapAsync
     (userController.signup));


// loginform  && login 
router.route("/login")
.get(userController.renderLoginform)
.post(saveRedirectUrl,
    // console.log(saveRedirectUrl);
    passport.authenticate("local",
    {failureRedirect:"/login",
    failureFlash:true}),userController. login);

// //  sign up routee...............
// router.get("/signup",userController.rendersignupform);

// router.post("/signup", wrapAsync (userController.signup)
// );

//  login route

// router.get("/login",userController.renderLoginform);


// router.post("/login",saveRedirectUrl,
//     // console.log(saveRedirectUrl);
//     passport.authenticate("local",
//     {failureRedirect:"/login",
//     failureFlash:true}),userController. login);

//  logged Out route..............

router.get("/logout",userController.logout);

module.exports=router;