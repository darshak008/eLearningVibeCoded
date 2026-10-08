const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    currentLesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    lastAccessed: { type: Date, default: Date.now },
    completedAt: Date,
    isCompleted: { type: Boolean, default: false },
    certificate: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' },
    rating: { type: Number, min: 1, max: 5 },
    review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
  },
  { timestamps: true }
);

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
