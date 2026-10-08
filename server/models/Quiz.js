const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['mcq', 'true-false', 'short-answer', 'coding'],
    required: [true, 'Question type is required'],
  },
  question: { type: String, required: [true, 'Question text is required'] },
  options: [String],
  correctAnswer: { type: String, required: [true, 'Correct answer is required'] },
  points: { type: Number, default: 1 },
  explanation: { type: String, default: '' },
  code: { type: String, default: '' },
});

const quizSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
    },
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
    },
    description: { type: String, default: '' },
    questions: [questionSchema],
    timeLimit: { type: Number, default: 0 },
    passingScore: { type: Number, default: 60 },
    maxAttempts: { type: Number, default: 3 },
    isPublished: { type: Boolean, default: true },
    showResults: { type: Boolean, default: true },
    randomizeQuestions: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
