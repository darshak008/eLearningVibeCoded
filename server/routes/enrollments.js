const express = require('express');
const router = express.Router();
const {
  enroll,
  getMyEnrollments,
  getEnrollment,
  updateProgress,
} = require('../controllers/enrollments/enrollmentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/my', protect, getMyEnrollments);
router.post('/:courseId', protect, authorize('student'), enroll);
router.get('/:id', protect, getEnrollment);
router.put('/:id/progress', protect, updateProgress);

module.exports = router;
