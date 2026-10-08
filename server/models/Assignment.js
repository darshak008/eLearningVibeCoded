const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
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
      required: [true, 'Assignment title is required'],
      trim: true,
    },
    description: { type: String, required: [true, 'Description is required'] },
    instructions: { type: String, default: '' },
    dueDate: Date,
    totalPoints: { type: Number, default: 100 },
    passingPoints: { type: Number, default: 60 },
    attachments: [
      {
        name: String,
        url: String,
      },
    ],
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: { type: String, default: '' },
    attachments: [
      {
        name: String,
        url: String,
      },
    ],
    submittedAt: { type: Date, default: Date.now },
    grade: { type: Number },
    feedback: { type: String, default: '' },
    gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    gradedAt: Date,
    status: {
      type: String,
      enum: ['submitted', 'graded', 'late'],
      default: 'submitted',
    },
  },
  { timestamps: true }
);

submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

module.exports = {
  Assignment: mongoose.model('Assignment', assignmentSchema),
  Submission: mongoose.model('Submission', submissionSchema),
};
