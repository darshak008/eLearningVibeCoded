const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  createQuiz,
  getQuiz,
  getLessonQuiz,
  submitAttempt,
  getAttempts,
} = require('../controllers/quizzes/quizController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('instructor'), createQuiz);
router.get('/lesson/:lessonId', protect, getLessonQuiz);
router.get('/:id', protect, getQuiz);
router.post('/:id/attempt', protect, authorize('student'), submitAttempt);
router.get('/:id/attempts', protect, getAttempts);

module.exports = router;
