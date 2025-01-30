
require('dotenv').config();
// console.log(process.env.SECRET);

const express=require("express");
const app=express();
const path= require("path");
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");
// const review = require("./models/review.js")
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
//  passport 
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));     // show route create this res.params cret data
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));  // link sataics files ----> css ,js, etc.
  


 
//  mongo connection 
// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

//  connect atlas connection

const dbUrl=process.env.ATLASDB_URL;

main().then((req,res)=>{
    console.log("✅connect to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl)
};




//  Mongo session store (connect-mongo) use session 
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
      secret:process.env.SECRET,
    },
    touchAfter:24*3600,
  });

  store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
  });



//  express session
const sessionOption={
    store,                                // pss by mongo session 
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000 ,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};




// //  /---->route
// app.get("/",(req,res)=>{
//     res.send("Hii, I am  root ");
// });


//  flash ...
app.use(session(sessionOption));
app.use(flash());

//  implement passport....................

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 

//  create middleware .....
app.use((req,res,next)=>{
    res.locals.sucess=req.flash("sucess");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    // console.log(res.locals.sucess);
    next();
});

// // demo User.................
//     app.get("/demoUser",async(req,res)=>{
//         let fakeUser=new User({ 
//             email:"student@gmail.com",
//             username:"delta-student",
//         });
        
//         let registerUser=await User.register(fakeUser,"helloworld");
//         res.send(registerUser);
//     });  

    
//  for listing route............
const listingRouter=require("./routes/listing.js");
// for review route..........
const reviewRouter=require("./routes/review.js");
const { register } = require("module");
//  for user router.......
const userRouter=require("./routes/user.js");


//  create chat gpt code ............


// const dbUrl = process.env.ATLASDB_URL;

// async function main() {
//     try {
//         await mongoose.connect(dbUrl, { serverSelectionTimeoutMS: 30000 });
//         console.log("✅ Connected to MongoDB Atlas");
//     } catch (err) {
//         console.error("❌ MongoDB connection error:", err);
//         process.exit(1); // Exit the process if connection fails
//     }
// }

// // Start connection
// main();






// //  create function for validation (middleware).............

// const validateListing=(req,res,next)=>{
//     let {error}=listingSchema.validate(req.body);
//     if(error){
//         let errMsg=error.details.map((el)=>el.message).join("*");
//         throw new ExpressError(404,errMsg);
//     }else{
//         next();
//     }
// };

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


//  for listing route........................

app.use("/listings",listingRouter);

//  for reviews route................
app.use("/listings/:id/reviews",reviewRouter);
//  for usr route
app.use("/",userRouter);



// // //  create index route ...............

// //  before time run  this code
// // app.get("/listings",(req,res)=>{
// //     Listing.find({}).then((err)=>{
// //         console.log(err);
// //     });
// // });

// //  After thime run this code ..
// app.get("/listings", wrapAsync(async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs", { allListings });
// })
// );
  
//   //  New Route.....................

// app.get("/listings/new",(req,res)=>{
//     res.render("listings/new.ejs");
// });

// //    show route.......................
// app.get("/listings/:id",wrapAsync(async(req,res)=>{
//     let {id}=req.params;
//     const listing=await Listing.findById(id);      //.populate("reviews")  using this method ....
//     res.render("listings/show.ejs",{listing});
// })
// );

// //  Create route........................................

// app.post("/listings",wrapAsync(async(req,res)=>{
//     const result=listingSchema.validate(req.body);
//     console.log(result);
//     if(result.error){
//         throw new ExpressError(404,result.error);
//     };
//     const newListing=new Listing(req.body.listing);
//     await newListing.save();
//     //  console.log(newListing);
//      res.redirect("/listings");




//         //// let {title,description,image,price,location,country}=req.body;    // 1st Rule...
//  // // 2 rule ..............................................
//  // let listing=req.body.listing;
//  // console.log(listing);
// })
// );



// // Edit route.....................................

// app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
//     let {id}=req.params;
//     const listing=await Listing.findById(id);
//     res.render("listings/edit.ejs",{listing});
// })
// );

// //  update route ................................

// app.put("/listings/:id", wrapAsync(async (req, res) => {
//     if(!req.body.listing){
//         throw new ExpressError(404,"send valid data for listing");
//     }
//     let { id } = req.params;
//     // console.log(id);
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${id}`);
// })
// );

// //  Delete route..............

// app.delete("/listings/:id",wrapAsync(async(req,res)=>{
//     let {id}=req.params;
//     let deleteListing=await Listing.findByIdAndDelete(id);
//    console.log(deleteListing);
//     res.redirect("/listings");
// })
// );

// //  Reviews  in the create post route ......................

// app.post("/listings/:id/reviews", validateReview,
//     wrapAsync(async(req,res)=>{
//     let listing=await Listing.findById(req.params.id);
//     let newReview=new Review(req.body.review);
//     // console.log(req.body.review);

//     listing.reviews.push(newReview);

//     await newReview.save();
//     await  listing.save();

//     // console.log("new review saved");
//     // res.send("new review saved");

//     res.redirect(`/listings/${listing._id}`);
// }));


// //  Delete Review Route.....
// app.delete("/listings/:id/reviews/:reviewId",
//     wrapAsync(async(req,res)=>{
//         let {id, reviewId}=req.params;

//         await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//         await Review.findByIdAndDelete(reviewId);

//         res.redirect(`/listings/${id}`);

//     })
// );

//  create all route error handling agr user na kisi bhi random route prr req bhj dee too vo yha prr aa krr slv hogii
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!!"));
});

//  Error handling....................
app.use(( err , req , res , next)=>{
    let{statusCode=505,message="somethings went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
    //  res.status(statusCode).send(message);
});

//  server
app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});











//  create basic listing code in this lines....................

// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New villa",
//         description:"By the beach",
//         price:1200,
//         location:"calangute,Goa",
//         country:"India",
//     });
//      await sampleListing.save()
//         console.log("sample was saved");
//         res.send("sucessfull testing");
  
// });


