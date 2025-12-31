const express=require("express");
const router=express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");


//MW= joi , server site validation apply, made a function an dapply in the api call
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(4040, error.details[0].message);
  } else {
    next();
  }
};
//all listing routes

//index route . showing all the properties
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let listings = await Listing.find({});
    // console.log(listings)
    res.render("all.ejs", { listings });
  })
)
//creating the form for new add
router.get("/new", (req, res) => {
  res.render("new.ejs");
});

//creating route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let listing = req.body.listing;
    let newListing = new Listing(listing); //making an instance
    await newListing.save();
    req.flash("success", "new listing created");
    res.redirect("/listings");
  })
);

//Show routes of perticular listings by his id
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
if(!listing)
{
  req.flash("error", "listing you requested, not exist");
       return  res.redirect("/listings")
}
    res.render("details.ejs", { listing });
  })
);

//edit route to open the form for the edit
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    console.log(listing);
    res.render("edit.ejs", { listing });
  })
);

//to update /edit the listings
router.patch(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    let listing = req.body.listing;

    // clean text (good practice)
    listing.title = listing.title.trim();
    listing.description = listing.description.trim();

    listing.image = {
      filename: "listingimage",
      url: listing.image,
    };

    await Listing.findByIdAndUpdate(id, listing, {
      runValidators: true,
      new: true,
    });
    req.flash("success", "eddited successfully");
    res.redirect(`/listings/${id}`);
  })
);

//delete destroy route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted successfully");
    res.redirect("/listings");
  })
);


module.exports=router;
