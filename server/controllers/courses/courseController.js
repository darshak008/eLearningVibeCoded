const Course = require('../../models/Course');
const Module = require('../../models/Module');
const Lesson = require('../../models/Lesson');
const Review = require('../../models/Review');
const AppError = require('../../utils/AppError');
const { uploadToCloudinary } = require('../../middleware/upload');

exports.createCourse = async (req, res, next) => {
  try {
    req.body.instructor = req.user._id;
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

exports.getCourses = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort = '-createdAt',
      category,
      level,
      price,
      rating,
      search,
      difficulty,
    } = req.query;

    const query = { isPublished: true };

    if (category) query.category = category;
    if (level) query.level = level;
    if (difficulty) query.level = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }
    if (price === 'free') query.price = 0;
    if (price === 'paid') query.price = { $gt: 0 };
    if (rating) query.avgRating = { $gte: parseFloat(rating) };

    let sortOption = {};
    switch (sort) {
      case 'popular': sortOption = { totalStudents: -1 }; break;
      case 'rating': sortOption = { avgRating: -1 }; break;
      case 'newest': sortOption = { createdAt: -1 }; break;
      case 'price-low': sortOption = { price: 1 }; break;
      case 'price-high': sortOption = { price: -1 }; break;
      default: sortOption = { createdAt: -1 };
    }

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .populate('instructor', 'name avatar headline')
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      courses,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate('instructor', 'name email avatar bio headline')
      .populate('category', 'name slug')
      .populate({
        path: 'modules',
        options: { sort: { order: 1 } },
        populate: {
          path: 'lessons',
          options: { sort: { order: 1 } },
          select: 'title duration order isFree isPublished',
        },
      });

    if (!course) {
      return next(new AppError('Course not found', 404));
    }

    const reviews = await Review.find({ course: course._id })
      .populate('student', 'name avatar')
      .sort('-createdAt')
      .limit(20);

    res.status(200).json({ success: true, course, reviews });
  } catch (error) {
    next(error);
  }
};

exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) return next(new AppError('Course not found', 404));

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized', 403));
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return next(new AppError('Course not found', 404));

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized', 403));
    }

    await Module.deleteMany({ course: course._id });
    await Lesson.deleteMany({ course: course._id });
    await Review.deleteMany({ course: course._id });
    await course.deleteOne();

    res.status(200).json({ success: true, message: 'Course deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getMyCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .populate('category', 'name')
      .sort('-createdAt');

    res.status(200).json({ success: true, courses });
  } catch (error) {
    next(error);
  }
};

exports.getFeaturedCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ isPublished: true, isFeatured: true })
      .populate('instructor', 'name avatar')
      .populate('category', 'name')
      .sort('-totalStudents')
      .limit(8);

    res.status(200).json({ success: true, courses });
  } catch (error) {
    next(error);
  }
};

exports.uploadThumbnail = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return next(new AppError('Course not found', 404));

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: 'e-learning/thumbnails',
        transformation: [{ width: 1200, height: 675, crop: 'fill' }],
      });
      course.thumbnail = { url: result.secure_url, publicId: result.public_id };
      await course.save();
    }

    res.status(200).json({ success: true, course });
  } catch (error) {
    next(error);
  }
};
