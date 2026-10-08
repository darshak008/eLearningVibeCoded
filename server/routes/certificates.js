const express = require('express');
const router = express.Router();
const {
  generateCertificate,
  getMyCertificates,
  verifyCertificate,
} = require('../controllers/certificates/certificateController');
const { protect, authorize } = require('../middleware/auth');

router.get('/my', protect, getMyCertificates);
router.post('/:enrollmentId', protect, authorize('student'), generateCertificate);
router.get('/verify/:id', verifyCertificate);

module.exports = router;
