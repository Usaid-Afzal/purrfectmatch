// src/controllers/interactionController.js
const ListingInteraction = require('../models/ListingInteraction');
const Listing = require('../models/Listing');
const Activity = require('../models/Activity');

class InteractionController {
  async addFavorite(req, res) {
    try {
      const { listingId } = req.params;

      // Check if listing exists
      const listing = await Listing.findById(listingId);
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }

      let interaction = await ListingInteraction.findOne({ user: req.user._id, listing: listingId });
      if (!interaction) {
        interaction = new ListingInteraction({
          user: req.user._id,
          listing: listingId,
          favorite: true
        });
      } else {
        interaction.favorite = true;
      }

      await interaction.save();

      await Activity.create({
        type: 'favorite_added',
        details: `User ${req.user._id} added Listing ${listing._id} to favorites`
      });


      res.json({
        message: 'Listing added to favorites',
        interaction
      });
    } catch (error) {
      console.error('Error adding favorite:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }

  async getFavorites(req, res) {
    try {
      const interactions = await ListingInteraction.find({
        user: req.user._id,
        favorite: true
      }).populate('listing');

       // Log activity
       await Activity.create({
        type: 'favorites_retrieved',
        details: `User ${req.user._id} retrieved their favorite listings`
      });


      res.json({ favorites: interactions });
    } catch (error) {
      console.error('Error fetching favorites:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }
}

module.exports = new InteractionController();
