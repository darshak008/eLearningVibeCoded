const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: { type: String, unique: true },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    shortDescription: {
      type: String,
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: { type: Number, default: 0 },
    thumbnail: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    trailer: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Instructor is required'],
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'all-levels'],
      default: 'beginner',
    },
    language: { type: String, default: 'English' },
    duration: { type: Number, default: 0 },
    totalLessons: { type: Number, default: 0 },
    totalModules: { type: Number, default: 0 },
    outcomes: [String],
    requirements: [String],
    targetAudience: [String],
    tags: [String],
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    totalStudents: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalDuration: { type: Number, default: 0 },
    resources: [
      {
        title: String,
        file: { url: String, publicId: String },
        type: { type: String, enum: ['pdf', 'doc', 'link', 'other'] },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

courseSchema.virtual('modules', {
  ref: 'Module',
  localField: '_id',
  foreignField: 'course',
  options: { sort: { order: 1 } },
});

courseSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'course',
});

courseSchema.pre('save', function (next) {
  this.slug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  next();
});

courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ category: 1, isPublished: 1 });
courseSchema.index({ instructor: 1 });

module.exports = mongoose.model('Course', courseSchema);
