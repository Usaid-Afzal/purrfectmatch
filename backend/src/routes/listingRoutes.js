// src/routes/listingRoutes.js
const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/multerMiddleware');

router.post('/', authMiddleware, upload.array('images'), listingController.createListing);

// Get all listings with optional filters
router.get('/', listingController.getListings);

// Get single listing by ID
router.get('/:id', listingController.getListing);

module.exports = router;
