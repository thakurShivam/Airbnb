
 const Listing=require("../models/listing");
 const {listingSchema}=require("../schema.js");

//   goecoding access routes....

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({ accessToken: mapToken});


//   index route middleware.......................

module.exports.index =async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};


//  new route middleware...............

 module.exports.renderNewform=(req,res)=>{
    res.render("listings/new.ejs");
};


// middleware show routee.................

module.exports.showListing = async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({        //.populate("reviews")  using this method ....
        path:"reviews", 
        populate:{
            path:"author",
        }
    })
        .populate("owner");     
   
    if(!listing){
    req.flash("error","Listing you request for does not exist ");
    res.redirect("/listings");
   }
  // console.log(listing);                           // all listing print  ....
    res.render("listings/show.ejs",{listing});
};


//  create route   middleware.......................

 module.exports.createListing= async(req,res,next)=>{
     let response=await geocodingClient.forwardGeocode({
        query:req.body.listing.location,
        limit:1
    })
    .send();
    // console.log(response.body.features[0].geometry);
    // res.send("done!");

    let url=req.file.path;
    let filename=req.file.filename;
    // console.log(url ,"...", filename);
    const result=listingSchema.validate(req.body);
    // console.log(result);
    if(result.error){
        throw new ExpressError(404,result.error);
    };
       const newListing=new Listing(req.body.listing);
//          console.log(req.user);
        newListing.owner=req.user._id;
        newListing.image ={url,filename};
        //  gemetry 
        newListing.geometry=response.body.features[0].geometry;
        let savedListing=await newListing.save();
        // console.log(savedListing);

    req.flash ("sucess","New Listings Created");
    //  console.log(newListing);
     res.redirect("/listings");
};

//  edit route middleware.................

module.exports.renderEditform=async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "The listing you requested does not exist");
        return res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", { listing , originalImageUrl});
};

//  update middleware route 

module.exports.updateListing=async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(404,"send valid data for listing");
    }
    let { id } = req.params;
    // console.log(id);
    // let listing=await Listing.findById(id);
    // if(listing.owner.equals(res.locals.currUser._id)){
    //     req.flash("error","You don't have permission to edit");
    //     return  res.redirect(`/listings/${id}`);

    // }

     let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing });
     if (typeof req.file !=="undefine"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
     }
     req.flash("sucess","Updated Listing ");
    isLoggedInisLoggedIn
    res.redirect(`/listings/${id}`);
};


// delete middleware for listing

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
//    console.log(deleteListing);
   req.flash("sucess","Listing Deleted");
    res.redirect("/listings");
};