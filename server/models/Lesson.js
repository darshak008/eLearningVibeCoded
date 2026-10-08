const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: [true, 'Module is required'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
    },
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
    },
    description: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    videoPublicId: { type: String, default: '' },
    duration: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    isFree: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    resources: [
      {
        title: String,
        url: String,
        type: { type: String, enum: ['pdf', 'doc', 'link', 'video', 'other'] },
      },
    ],
    attachments: [
      {
        name: String,
        url: String,
        size: Number,
      },
    ],
    content: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lesson', lessonSchema);
