const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validatelisting } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

router
  .route("/")
  //Index Route
  .get(wrapAsync(listingController.index))
  //create route
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validatelisting,
    wrapAsync(listingController.createroute)
  );

//new route
router.get("/new", isLoggedIn, listingController.newrender);

router
  .route("/:id")
  //Show Route
  .get(wrapAsync(listingController.showroute))
  // update route
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validatelisting,
    wrapAsync(listingController.updateroute)
  )
  //delete route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteroute));

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editroute)
);

module.exports = router;
