const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const reputationController = require('../controllers/reputationController');

router.use(authMiddleware);

router.post('/', reputationController.addReview); // POST /api/reviews { revieweeId, rating, comment }
router.get('/:userId', reputationController.getUserReviews); // GET /api/reviews/:userId

module.exports = router;
