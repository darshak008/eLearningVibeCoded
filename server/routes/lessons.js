const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  createLesson,
  getLessons,
  getLesson,
  updateLesson,
  deleteLesson,
  uploadVideo,
} = require('../controllers/courses/lessonController');
const { protect, authorize } = require('../middleware/auth');
const { uploadVideo: uploadVideoMiddleware } = require('../middleware/upload');

router
  .route('/')
  .get(getLessons)
  .post(protect, authorize('instructor', 'admin'), createLesson);

router
  .route('/:id')
  .get(getLesson)
  .put(protect, authorize('instructor', 'admin'), updateLesson)
  .delete(protect, authorize('instructor', 'admin'), deleteLesson);

router.post('/:id/video', protect, authorize('instructor', 'admin'), uploadVideoMiddleware.single('video'), uploadVideo);

module.exports = router;
