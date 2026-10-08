const Certificate = require('../../models/Certificate');
const Enrollment = require('../../models/Enrollment');
const Course = require('../../models/Course');
const User = require('../../models/User');
const AppError = require('../../utils/AppError');
const { generateCertificateId } = require('../../utils/helpers');

exports.generateCertificate = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId)
      .populate('course', 'title')
      .populate('student', 'name');

    if (!enrollment) return next(new AppError('Enrollment not found', 404));
    if (!enrollment.isCompleted) {
      return next(new AppError('Course not completed yet', 400));
    }

    const existingCert = await Certificate.findOne({
      student: enrollment.student._id,
      course: enrollment.course._id,
    });

    if (existingCert) {
      return res.status(200).json({ success: true, certificate: existingCert });
    }

    const instructor = await User.findById(enrollment.course.instructor);

    const certificate = await Certificate.create({
      certificateId: generateCertificateId(),
      student: enrollment.student._id,
      course: enrollment.course._id,
      enrollment: enrollment._id,
      studentName: enrollment.student.name,
      courseName: enrollment.course.title,
      instructorName: instructor?.name || 'Instructor',
      completionDate: enrollment.completedAt || new Date(),
    });

    enrollment.certificate = certificate._id;
    await enrollment.save();

    res.status(201).json({ success: true, certificate });
  } catch (error) {
    next(error);
  }
};

exports.getMyCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ student: req.user._id })
      .populate('course', 'title slug thumbnail')
      .sort('-createdAt');

    res.status(200).json({ success: true, certificates });
  } catch (error) {
    next(error);
  }
};

exports.verifyCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOne({
      certificateId: req.params.id,
      isVerified: true,
    })
      .populate('course', 'title')
      .populate('student', 'name');

    if (!certificate) {
      return next(new AppError('Invalid or revoked certificate', 404));
    }

    res.status(200).json({
      success: true,
      verified: true,
      certificate: {
        certificateId: certificate.certificateId,
        studentName: certificate.studentName,
        courseName: certificate.courseName,
        instructorName: certificate.instructorName,
        completionDate: certificate.completionDate,
      },
    });
  } catch (error) {
    next(error);
  }
};
