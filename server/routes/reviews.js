const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getCourseReviews,
  createReview,
  updateReview,
  deleteReview,
  toggleLike,
  instructorReply,
} = require('../controllers/reviews/reviewController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getCourseReviews)
  .post(protect, authorize('student'), createReview);

router
  .route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

router.post('/:id/like', protect, toggleLike);
router.post('/:id/reply', protect, authorize('instructor'), instructorReply);

module.exports = router;
