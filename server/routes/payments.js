const express = require('express');
const router = express.Router();
const {
  createCheckoutSession,
  webhook,
  getPaymentHistory,
  getInstructorEarnings,
} = require('../controllers/payments/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/create-checkout', protect, authorize('student'), createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), webhook);
router.get('/history', protect, getPaymentHistory);
router.get('/earnings', protect, authorize('instructor'), getInstructorEarnings);

module.exports = router;
