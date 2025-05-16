const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//index
module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index", { allListing });
};

//newRender
module.exports.newrender = (req, res) => {
  res.render("listings/new.ejs");
};

//ShowRoute
module.exports.showroute = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "listing you required for does not exist!");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

//CreateRoute
module.exports.createroute = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  console.log("Uploaded File: ", req.file);
  let url = req.file.path;
  let filename = req.file.filename;

  const newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.image = { url, filename };
  newlisting.geometry = response.body.features[0].geometry;

  let savelisting = await newlisting.save();
  console.log(savelisting);
  req.flash("success", "New listing Created!");
  res.redirect("/listings");
};

//EditRoute
module.exports.editroute = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "listing you required for does not exist!");
    res.redirect("/listings");
  }

  let OriginalImageurl = listing.image.url;
  OriginalImageurl = OriginalImageurl.replace("/upload", "/upload/w_250");
  res.render("listings/edit", { listing, OriginalImageurl });
};

//UpdateRoute
module.exports.updateroute = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "listing Updated!");
  res.redirect(`/listings/${id}`);
};

//DeleteRoute
module.exports.deleteroute = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
