const Lesson = require('../../models/Lesson');
const Module = require('../../models/Module');
const Course = require('../../models/Course');
const AppError = require('../../utils/AppError');
const { uploadToCloudinary } = require('../../middleware/upload');

exports.createLesson = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.moduleId);
    if (!module) return next(new AppError('Module not found', 404));

    const count = await Lesson.countDocuments({ module: module._id });
    const lesson = await Lesson.create({
      ...req.body,
      module: module._id,
      course: module.course,
      order: count + 1,
    });

    const totalLessons = await Lesson.countDocuments({ course: module.course });
    await Course.findByIdAndUpdate(module.course, { totalLessons });

    res.status(201).json({ success: true, lesson });
  } catch (error) {
    next(error);
  }
};

exports.getLessons = async (req, res, next) => {
  try {
    const lessons = await Lesson.find({ module: req.params.moduleId }).sort({ order: 1 });
    res.status(200).json({ success: true, lessons });
  } catch (error) {
    next(error);
  }
};

exports.getLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('module', 'title course order')
      .populate('course', 'title');

    if (!lesson) return next(new AppError('Lesson not found', 404));

    const prevLesson = await Lesson.findOne({
      module: lesson.module,
      order: lesson.order - 1,
    }).select('_id title');

    const nextLesson = await Lesson.findOne({
      module: lesson.module,
      order: lesson.order + 1,
    }).select('_id title');

    res.status(200).json({ success: true, lesson, prevLesson, nextLesson });
  } catch (error) {
    next(error);
  }
};

exports.updateLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!lesson) return next(new AppError('Lesson not found', 404));
    res.status(200).json({ success: true, lesson });
  } catch (error) {
    next(error);
  }
};

exports.deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return next(new AppError('Lesson not found', 404));

    await lesson.deleteOne();

    const totalLessons = await Lesson.countDocuments({ course: lesson.course });
    await Course.findByIdAndUpdate(lesson.course, { totalLessons });

    res.status(200).json({ success: true, message: 'Lesson deleted' });
  } catch (error) {
    next(error);
  }
};

exports.uploadVideo = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return next(new AppError('Lesson not found', 404));

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: 'e-learning/videos',
        resource_type: 'video',
        chunk_size: 6000000,
      });
      lesson.videoUrl = result.secure_url;
      lesson.videoPublicId = result.public_id;
      lesson.duration = req.body.duration || lesson.duration;
      await lesson.save();
    }

    res.status(200).json({ success: true, lesson });
  } catch (error) {
    next(error);
  }
};
