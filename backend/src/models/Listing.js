// src/models/Listing.js
const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true }, // e.g., dog, cat, bird, other
  breed: { type: String },
  age: { type: Number },
  gender: { type: String, enum: ['male', 'female'] },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  vaccinated: { type: Boolean, default: false },
  neutered: { type: Boolean, default: false },
  status: {
  type: String,
  enum: ['pending', 'approved', 'rejected'],
  default: 'pending'
  },
  images: [{ type: String }], // Array of image URLs
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // The user who created the listing
}, {
  timestamps: true
});

module.exports = mongoose.model('Listing', ListingSchema);
