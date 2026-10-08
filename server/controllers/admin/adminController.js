const User = require('../../models/User');
const Course = require('../../models/Course');
const Payment = require('../../models/Payment');
const Review = require('../../models/Review');
const Category = require('../../models/Category');
const Enrollment = require('../../models/Enrollment');
const AppError = require('../../utils/AppError');

exports.getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ isPublished: true });
    const totalEnrollments = await Enrollment.countDocuments();
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalReviews = await Review.countDocuments();

    const monthlyRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const recentUsers = await User.find().sort('-createdAt').limit(5).select('name email role createdAt');
    const recentCourses = await Course.find()
      .populate('instructor', 'name')
      .sort('-createdAt')
      .limit(5)
      .select('title price isPublished createdAt');

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalInstructors,
        totalCourses,
        publishedCourses,
        totalEnrollments,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalReviews,
        monthlyRevenue,
      },
      recentUsers,
      recentCourses,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, search, sort = '-createdAt' } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-password -refreshToken');

    res.status(200).json({
      success: true,
      users,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { name, email, role, isActive, isVerified } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, isActive, isVerified },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!user) return next(new AppError('User not found', 404));

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('User not found', 404));

    if (user.role === 'admin') {
      return next(new AppError('Cannot delete admin users', 400));
    }

    await user.deleteOne();
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getAllCourses = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const query = {};
    if (status === 'published') query.isPublished = true;
    if (status === 'draft') query.isPublished = false;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .populate('instructor', 'name email')
      .populate('category', 'name')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      courses,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllPayments = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = {};
    if (status) query.status = status;

    const total = await Payment.countDocuments(query);
    const payments = await Payment.find(query)
      .populate('student', 'name email')
      .populate('course', 'title')
      .populate('instructor', 'name email')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      payments,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort('name');
    res.status(200).json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) return next(new AppError('Category not found', 404));
    res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new AppError('Category not found', 404));

    const coursesUsingCategory = await Course.countDocuments({ category: category._id });
    if (coursesUsingCategory > 0) {
      return next(new AppError('Cannot delete category with active courses', 400));
    }

    await category.deleteOne();
    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getReports = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    const enrollmentReport = await Enrollment.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          enrollments: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const revenueReport = await Payment.aggregate([
      { $match: { ...dateFilter, status: 'completed' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$amount' },
          platformFees: { $sum: '$platformFee' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const topCourses = await Course.find()
      .sort('-totalStudents')
      .limit(10)
      .select('title totalStudents avgRating totalRevenue');

    const topInstructors = await User.aggregate([
      { $match: { role: 'instructor' } },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: 'instructor',
          as: 'courses',
        },
      },
      {
        $addFields: {
          totalCourses: { $size: '$courses' },
          totalStudents: { $sum: '$courses.totalStudents' },
        },
      },
      { $sort: { totalStudents: -1 } },
      { $limit: 10 },
      { $project: { name: 1, email: 1, totalCourses: 1, totalStudents: 1 } },
    ]);

    res.status(200).json({
      success: true,
      reports: {
        enrollmentReport,
        revenueReport,
        topCourses,
        topInstructors,
      },
    });
  } catch (error) {
    next(error);
  }
};
