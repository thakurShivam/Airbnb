 const express=require("express");
 const router=express.Router();
 const wrapAsync=require("../utils/wrapAsync.js");
//  const ExpressError=require("../utils/ExpressError.js");
//  const {listingSchema}=require("../schema.js");
 const Listing=require("../models/listing.js");
const { isLoggedIn ,isOwner,validateListing} = require("../middleware.js");
const listingController=require("../controllers/listing.js");

const multer  = require('multer')
const{storage}=require("../cloudConfig.js");
const upload = multer({ storage });

//  index route && create route  bothe are same path (use  router.route()) implement .......4

router.route("/")
.get( wrapAsync(
    listingController.index))
.post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
);


  //  New Route.....................

router.get("/new",isLoggedIn,
    listingController.renderNewform);


//  show route  && Update  delete route Route  both are same .....

router.route("/:id")
.get(wrapAsync( 
    listingController.showListing))
.put(isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing, 
    wrapAsync(listingController.updateListing)
)
.delete(isLoggedIn,isOwner,
    wrapAsync(listingController.destroyListing));
    

 //  create function for validation (middleware).........  to (middleware.js)....
 
 // //  create index route ............. ..

//  before time run  this code
// app.get("/listings",(req,res)=>{
//     Listing.find({}).then((err)=>{
//         console.log(err);
//     });
// });

//  After thime run this code ..
// router.get("/", wrapAsync(listingController.index));
  



//    show route.................................


// router.get("/:id",
//     wrapAsync(listingController.showListing));

//  Create route........................................

// router.post("/",isLoggedIn,validateListing,
//     wrapAsync(listingController.createListing)
// );



// Edit route.....................................

// router.get("/:id/edit",isLoggedIn,wrapAsync(async(req,res)=>{
//     let {id}=req.params;
//     const listing=await Listing.findById(id);
//     if(!listing){
//         req.flash("error","Listing you request for does not exist ");
//         res.redirect("/listings");
//        }
//     res.render("listings/edit.ejs",{listing});
// })
// );
router.get("/:id/edit", isLoggedIn,
    isOwner, wrapAsync(listingController.renderEditform));

// //  update route ................................

// router.put("/:id",isLoggedIn,isOwner,validateListing, 
//     wrapAsync(listingController.updateListing)
// );

//  Delete route..............

// router.delete("/:id",
// isLoggedIn,isOwner,
// wrapAsync(listingController.destroyListing));


module.exports=router;