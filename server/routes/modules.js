const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  createModule,
  getModules,
  updateModule,
  deleteModule,
  reorderModules,
} = require('../controllers/courses/moduleController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getModules)
  .post(protect, authorize('instructor', 'admin'), createModule);

router.put('/reorder', protect, authorize('instructor', 'admin'), reorderModules);

router
  .route('/:id')
  .put(protect, authorize('instructor', 'admin'), updateModule)
  .delete(protect, authorize('instructor', 'admin'), deleteModule);

module.exports = router;
