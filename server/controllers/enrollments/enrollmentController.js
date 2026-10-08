const Enrollment = require('../../models/Enrollment');
const Course = require('../../models/Course');
const User = require('../../models/User');
const AppError = require('../../utils/AppError');

exports.enroll = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return next(new AppError('Course not found', 404));

    const existing = await Enrollment.findOne({
      student: req.user._id,
      course: course._id,
    });

    if (existing) {
      return next(new AppError('Already enrolled in this course', 400));
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: course._id,
    });

    course.totalStudents += 1;
    await course.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: { enrolledCourses: course._id, purchasedCourses: course._id },
    });

    res.status(201).json({ success: true, enrollment });
  } catch (error) {
    next(error);
  }
};

exports.getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        select: 'title slug thumbnail price avgRating totalDuration totalLessons instructor',
        populate: { path: 'instructor', select: 'name avatar' },
      })
      .sort('-updatedAt');

    res.status(200).json({ success: true, enrollments });
  } catch (error) {
    next(error);
  }
};

exports.getEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      student: req.user._id,
    }).populate({
      path: 'course',
      populate: {
        path: 'modules',
        populate: { path: 'lessons', select: 'title duration order isFree' },
      },
    });

    if (!enrollment) return next(new AppError('Enrollment not found', 404));

    res.status(200).json({ success: true, enrollment });
  } catch (error) {
    next(error);
  }
};

exports.updateProgress = async (req, res, next) => {
  try {
    const { lessonId, completed } = req.body;
    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      student: req.user._id,
    });

    if (!enrollment) return next(new AppError('Enrollment not found', 404));

    if (completed) {
      if (!enrollment.completedLessons.includes(lessonId)) {
        enrollment.completedLessons.push(lessonId);
      }
    } else {
      enrollment.completedLessons = enrollment.completedLessons.filter(
        (id) => id.toString() !== lessonId
      );
    }

    enrollment.currentLesson = lessonId;
    enrollment.lastAccessed = Date.now();

    const totalLessons = enrollment.course.totalLessons || 1;
    enrollment.progress = Math.round(
      (enrollment.completedLessons.length / totalLessons) * 100
    );

    if (enrollment.progress >= 100 && !enrollment.isCompleted) {
      enrollment.isCompleted = true;
      enrollment.completedAt = Date.now();
    }

    await enrollment.save();

    res.status(200).json({ success: true, enrollment });
  } catch (error) {
    next(error);
  }
};
