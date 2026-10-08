const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
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
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      required: [true, 'Review text is required'],
      maxlength: [1000, 'Review cannot exceed 1000 characters'],
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    instructorReply: {
      message: String,
      repliedAt: Date,
    },
    isEdited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ course: 1, createdAt: -1 });
reviewSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
