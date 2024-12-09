const UserReputation = require('../models/UserReputation');
const User = require('../models/User');

class ReputationController {
  async addReview(req, res) {
    try {
      const { revieweeId, rating, comment } = req.body;

      // Validate the reviewee exists
      const reviewee = await User.findById(revieweeId);
      if (!reviewee) return res.status(404).json({ message: 'User not found' });

      // Users should not review themselves
      if (revieweeId.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: 'You cannot review yourself' });
      }

      const review = new UserReputation({
        reviewer: req.user._id,
        reviewee: revieweeId,
        rating,
        comment
      });

      await review.save();

      res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }

  async getUserReviews(req, res) {
    try {
      const { userId } = req.params;

      const reviews = await UserReputation.find({ reviewee: userId }).populate('reviewer', 'username email');

      // Calculate average rating
      const averageRating = reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) 
        : 0;

      res.json({ reviews, averageRating });
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }
}

module.exports = new ReputationController();
