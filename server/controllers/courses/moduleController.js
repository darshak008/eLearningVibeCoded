const Module = require('../../models/Module');
const Lesson = require('../../models/Lesson');
const Course = require('../../models/Course');
const AppError = require('../../utils/AppError');

exports.createModule = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return next(new AppError('Course not found', 404));
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized', 403));
    }

    const count = await Module.countDocuments({ course: course._id });
    const module = await Module.create({
      ...req.body,
      course: course._id,
      order: count + 1,
    });

    course.totalModules = count + 1;
    await course.save();

    res.status(201).json({ success: true, module });
  } catch (error) {
    next(error);
  }
};

exports.getModules = async (req, res, next) => {
  try {
    const modules = await Module.find({ course: req.params.courseId })
      .populate({
        path: 'lessons',
        options: { sort: { order: 1 } },
      })
      .sort({ order: 1 });

    res.status(200).json({ success: true, modules });
  } catch (error) {
    next(error);
  }
};

exports.updateModule = async (req, res, next) => {
  try {
    const module = await Module.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!module) return next(new AppError('Module not found', 404));
    res.status(200).json({ success: true, module });
  } catch (error) {
    next(error);
  }
};

exports.deleteModule = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) return next(new AppError('Module not found', 404));

    await Lesson.deleteMany({ module: module._id });
    await module.deleteOne();

    await Course.findByIdAndUpdate(module.course, {
      $inc: { totalModules: -1 },
    });

    res.status(200).json({ success: true, message: 'Module deleted' });
  } catch (error) {
    next(error);
  }
};

exports.reorderModules = async (req, res, next) => {
  try {
    const { moduleOrder } = req.body;
    const updates = moduleOrder.map((id, index) => ({
      updateOne: { filter: { _id: id }, update: { order: index + 1 } },
    }));
    await Module.bulkWrite(updates);
    res.status(200).json({ success: true, message: 'Modules reordered' });
  } catch (error) {
    next(error);
  }
};
