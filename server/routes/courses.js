const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  getMyCourses,
  getFeaturedCourses,
  uploadThumbnail,
} = require('../controllers/courses/courseController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { uploadImage } = require('../middleware/upload');
const { getCategories } = require('../controllers/admin/adminController');

router.get('/categories', getCategories);

router
  .route('/')
  .get(getCourses)
  .post(
    protect,
    authorize('instructor', 'admin'),
    [
      body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
      body('description').trim().isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
      body('price').isNumeric().withMessage('Price is required'),
      body('category').isMongoId().withMessage('Valid category is required'),
    ],
    validate,
    createCourse
  );

router.get('/featured', getFeaturedCourses);
router.get('/my-courses', protect, authorize('instructor'), getMyCourses);
router.get('/:slug', getCourse);

router
  .route('/:id')
  .put(protect, authorize('instructor', 'admin'), updateCourse)
  .delete(protect, authorize('instructor', 'admin'), deleteCourse);

router.post('/:id/thumbnail', protect, authorize('instructor', 'admin'), uploadImage.single('thumbnail'), uploadThumbnail);

module.exports = router;
