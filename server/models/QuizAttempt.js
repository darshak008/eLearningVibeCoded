const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: [true, 'Quiz is required'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    answers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId },
        answer: String,
        isCorrect: Boolean,
        pointsEarned: Number,
      },
    ],
    score: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },
    attemptNumber: { type: Number, default: 1 },
    startedAt: { type: Date },
    completedAt: { type: Date },
    timeTaken: { type: Number, default: 0 },
  },
  { timestamps: true }
);

quizAttemptSchema.index({ student: 1, quiz: 1 });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
