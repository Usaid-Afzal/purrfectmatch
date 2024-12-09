const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware, roleMiddleware('admin'));

// User Management
router.get('/users', adminController.getUsers);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Listing Moderation
router.get('/listings/moderation', adminController.getModerationListings);
router.put('/listings/:id/approve', adminController.approveListing);
router.delete('/listings/:id/reject', adminController.rejectListing);

// Settings
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

// Financial Oversight
router.get('/financial-data', adminController.getFinancialData);

// System Monitoring
router.get('/activities', adminController.getActivities);

module.exports = router;
