const express = require('express');
const router = express.Router();
const {
  getStats,
  getUsers,
  updateUser,
  deleteUser,
  getAllCourses,
  getAllPayments,
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getReports,
} = require('../controllers/admin/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/courses', getAllCourses);

router.get('/payments', getAllPayments);

router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

router.get('/reports', getReports);

module.exports = router;
