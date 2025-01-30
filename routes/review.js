
// const express=require("express");
// const router=express.Router({mergeParams:true});
// const wrapAsync=require("../utils/wrapAsync.js");
// const ExpressError=require("../utils/ExpressError.js");
// const {reviewSchema}=require("../schema.js");
// const Review=require("../models/review.js");
// const Listing=require("../models/listing.js");

// //  Validate Review.......................
// const validateReview=(req,res,next)=>{
//     let {error}=reviewSchema.validate(req.body);
//     if(error){
//         let errMsg=error.details.map((el)=>el.message).join("*");
//         throw new ExpressError(404,errMsg);
//     }else{
//         next();
//     }
// };


// //  Reviews  in the create post route ......................

// router.post("/", validateReview,
//     wrapAsync(async(req,res)=>{
//     let listing=await Listing.findById(req.params.id);
//     // console.log(req.params.id); 
//     let newReview=new Review(req.body.review);
//     console.log(req.body.review);

//     listing.reviews.push(newReview);

//     await newReview.save();
//     await  listing.save();

//     req.flash("sucess","Listing Deleted");
//     // console.log("new review saved");
//     // res.send("new review saved");

//     res.redirect(`/listings/${listing._id}`);
// }));


// //  Delete Review Route.....
// router.delete("/:reviewId",
//     wrapAsync(async(req,res)=>{
//         let {id, reviewId}=req.params;

//         await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//         await Review.findByIdAndDelete(reviewId);
//         req.flash("sucess","Review Deleted");


//         res.redirect(`/listings/${id}`);

//     })
// );

// module.exports=router;




// create chat Gpt code

const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
// const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");

// Validate Review


// Create Review
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);

// Delete Review
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;
