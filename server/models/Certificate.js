const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
    },
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
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enrollment',
    },
    studentName: { type: String, required: true },
    courseName: { type: String, required: true },
    instructorName: { type: String, required: true },
    completionDate: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: true },
    downloadUrl: { type: String, default: '' },
    grade: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certificate', certificateSchema);
