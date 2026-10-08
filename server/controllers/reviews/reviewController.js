const Review = require('../../models/Review');
const Course = require('../../models/Course');
const Enrollment = require('../../models/Enrollment');
const AppError = require('../../utils/AppError');

exports.getCourseReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const reviews = await Review.find({ course: req.params.courseId })
      .populate('student', 'name avatar')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ course: req.params.courseId });

    res.status(200).json({
      success: true,
      reviews,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    next(error);
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId,
    });

    if (!enrollment) {
      return next(new AppError('You must be enrolled to review this course', 400));
    }

    const existingReview = await Review.findOne({
      student: req.user._id,
      course: req.params.courseId,
    });

    if (existingReview) {
      return next(new AppError('You already reviewed this course', 400));
    }

    const review = await Review.create({
      ...req.body,
      student: req.user._id,
      course: req.params.courseId,
    });

    const stats = await Review.aggregate([
      { $match: { course: review.course } },
      { $group: { _id: '$course', avgRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } },
    ]);

    if (stats.length > 0) {
      await Course.findByIdAndUpdate(review.course, {
        avgRating: Math.round(stats[0].avgRating * 10) / 10,
        totalReviews: stats[0].totalReviews,
      });
    }

    enrollment.rating = req.body.rating;
    enrollment.review = review._id;
    await enrollment.save();

    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);
    if (!review) return next(new AppError('Review not found', 404));
    if (review.student.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized', 403));
    }

    review.rating = req.body.rating || review.rating;
    review.review = req.body.review || review.review;
    review.isEdited = true;
    await review.save();

    const stats = await Review.aggregate([
      { $match: { course: review.course } },
      { $group: { _id: '$course', avgRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } },
    ]);

    if (stats.length > 0) {
      await Course.findByIdAndUpdate(review.course, {
        avgRating: Math.round(stats[0].avgRating * 10) / 10,
      });
    }

    res.status(200).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return next(new AppError('Review not found', 404));
    if (review.student.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized', 403));
    }

    await review.deleteOne();

    const stats = await Review.aggregate([
      { $match: { course: review.course } },
      { $group: { _id: '$course', avgRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } },
    ]);

    if (stats.length > 0) {
      await Course.findByIdAndUpdate(review.course, {
        avgRating: Math.round(stats[0].avgRating * 10) / 10,
        totalReviews: stats[0].totalReviews,
      });
    } else {
      await Course.findByIdAndUpdate(review.course, { avgRating: 0, totalReviews: 0 });
    }

    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};

exports.toggleLike = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return next(new AppError('Review not found', 404));

    const idx = review.likes.indexOf(req.user._id);
    if (idx > -1) {
      review.likes.splice(idx, 1);
    } else {
      review.likes.push(req.user._id);
    }

    await review.save();
    res.status(200).json({ success: true, likes: review.likes.length });
  } catch (error) {
    next(error);
  }
};

exports.instructorReply = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return next(new AppError('Review not found', 404));

    review.instructorReply = {
      message: req.body.message,
      repliedAt: Date.now(),
    };
    await review.save();

    res.status(200).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};
