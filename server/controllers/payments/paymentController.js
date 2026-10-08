const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../../models/Payment');
const Course = require('../../models/Course');
const User = require('../../models/User');
const Enrollment = require('../../models/Enrollment');
const Coupon = require('../../models/Coupon');
const AppError = require('../../utils/AppError');

exports.createCheckoutSession = async (req, res, next) => {
  try {
    const { courseId, couponCode } = req.body;
    const course = await Course.findById(courseId).populate('instructor', 'name email');

    if (!course) return next(new AppError('Course not found', 404));

    let amount = course.price;
    let discount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiresAt: { $gt: Date.now() },
      });

      if (!coupon) return next(new AppError('Invalid coupon', 400));
      if (coupon.currentUses >= coupon.maxUses) {
        return next(new AppError('Coupon expired', 400));
      }
      if (coupon.course && coupon.course.toString() !== courseId) {
        return next(new AppError('Coupon not applicable', 400));
      }

      discount = coupon.type === 'percentage'
        ? Math.round(amount * (coupon.discount / 100))
        : coupon.discount;
      amount = Math.max(0, amount - discount);

      coupon.currentUses += 1;
      await coupon.save();
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.title,
              images: course.thumbnail?.url ? [course.thumbnail.url] : [],
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        courseId: course._id.toString(),
        studentId: req.user._id.toString(),
        instructorId: course.instructor._id.toString(),
        discount: discount.toString(),
        couponCode: couponCode || '',
      },
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
    });

    await Payment.create({
      student: req.user._id,
      course: course._id,
      instructor: course.instructor._id,
      amount,
      stripeSessionId: session.id,
      status: 'pending',
      platformFee: Math.round(amount * 0.2 * 100) / 100,
      instructorEarnings: Math.round(amount * 0.8 * 100) / 100,
      coupon: couponCode ? { code: couponCode, discount } : undefined,
    });

    res.status(200).json({ success: true, sessionId: session.id, url: session.url });
  } catch (error) {
    next(error);
  }
};

exports.webhook = async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).json({ message: 'Webhook signature verification failed' });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const payment = await Payment.findOne({ stripeSessionId: session.id });

      if (payment) {
        payment.status = 'completed';
        payment.stripePaymentIntentId = session.payment_intent;
        await payment.save();

        await Enrollment.create({
          student: payment.student,
          course: payment.course,
        });

        await Course.findByIdAndUpdate(payment.course, {
          $inc: { totalStudents: 1 },
        });

        await User.findByIdAndUpdate(payment.instructor, {
          $inc: { totalEarnings: payment.instructorEarnings, balance: payment.instructorEarnings },
        });

        await User.findByIdAndUpdate(payment.student, {
          $push: { enrolledCourses: payment.course, purchasedCourses: payment.course },
        });
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
};

exports.getPaymentHistory = async (req, res, next) => {
  try {
    const payments = await Payment.find({ student: req.user._id })
      .populate('course', 'title slug thumbnail')
      .sort('-createdAt');

    res.status(200).json({ success: true, payments });
  } catch (error) {
    next(error);
  }
};

exports.getInstructorEarnings = async (req, res, next) => {
  try {
    const payments = await Payment.find({ instructor: req.user._id, status: 'completed' })
      .populate('course', 'title')
      .populate('student', 'name')
      .sort('-createdAt');

    const stats = await Payment.aggregate([
      { $match: { instructor: req.user._id, status: 'completed' } },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$instructorEarnings' },
          totalSales: { $sum: 1 },
          platformFees: { $sum: '$platformFee' },
        },
      },
    ]);

    const monthlyEarnings = await Payment.aggregate([
      { $match: { instructor: req.user._id, status: 'completed' } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          earnings: { $sum: '$instructorEarnings' },
          sales: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      payments,
      stats: stats[0] || { totalEarnings: 0, totalSales: 0, platformFees: 0 },
      monthlyEarnings,
    });
  } catch (error) {
    next(error);
  }
};
