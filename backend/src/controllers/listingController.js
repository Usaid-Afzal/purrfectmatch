// src/controllers/listingController.js
const Listing = require("../models/Listing");
const cloudinary = require("../config/cloudinary");
const Activity = require("../models/Activity");

class ListingController {
  async getListings(req, res) {
    try {
      const {
        type,
        location,
        minPrice,
        maxPrice,
        page = 1,
        limit = 10,
      } = req.query;

      // Build filter object
      
      const filter = { status: 'approved' };
      if (type) filter.type = type;
      if (location) filter.location = location;
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }

      // Execute query with pagination
      const listings = await Listing.find(filter)
        .populate("owner", "name email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

      // Get total count for pagination
      const total = await Listing.countDocuments(filter);

      res.json({
        listings,
        totalPages: Math.ceil(total / limit),
        currentPage: Number(page),
        total,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // In listingController.js, update getListing method:
  async getListing(req, res) {
    try {
      const listing = await Listing.findById(req.params.id)
        .populate('owner', 'username createdAt avatar');
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }
      res.json(listing);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createListing(req, res) {
    try {
      const {
        title,
        description,
        type,
        breed,
        age,
        gender,
        price,
        location,
        vaccinated,
        neutered,
      } = req.body;

      // Convert strings "true"/"false" to booleans, if needed
      const vaccinatedBool = vaccinated === "true";
      const neuteredBool = neutered === "true";

      // Upload images to Cloudinary if any
      let imageUrls = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const result = await new Promise((resolve, reject) => {
            const upload_stream = cloudinary.uploader.upload_stream(
              { folder: "listings" },
              (error, result) => {
                if (error) {
                  return reject(error);
                }
                resolve(result);
              }
            );
            upload_stream.end(file.buffer);
          });

          imageUrls.push(result.secure_url);
        }
      }

      // Create the listing
      const listing = new Listing({
        title,
        description,
        type,
        breed,
        age: age ? Number(age) : undefined,
        gender,
        price: Number(price),
        location,
        vaccinated: vaccinatedBool,
        neutered: neuteredBool,
        images: imageUrls,
        owner: req.user._id,
      });

      await listing.save();

      await Activity.create({
        type: "listing_created",
        details: `Listing ${listing._id} created by User ${req.user._id}`,
      });

      res.status(201).json({
        message: "Listing created successfully",
        listing,
      });
    } catch (error) {
      console.error("Listing creation error:", error.message);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
}

module.exports = new ListingController();
