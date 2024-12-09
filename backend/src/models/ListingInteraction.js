// src/models/ListingInteraction.js
const mongoose = require('mongoose');

const ListingInteractionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  favorite: { type: Boolean, default: false },
  // You can add more fields like 'viewed', 'inquired', etc. as needed
}, {
  timestamps: true
});

module.exports = mongoose.model('ListingInteraction', ListingInteractionSchema);
