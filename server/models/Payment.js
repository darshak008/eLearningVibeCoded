const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
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
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'usd' },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: { type: String, default: 'stripe' },
    stripeSessionId: { type: String },
    stripePaymentIntentId: { type: String },
    instructorEarnings: { type: Number, default: 0 },
    platformFee: { type: Number, default: 0 },
    commissionRate: { type: Number, default: 0.2 },
    coupon: {
      code: String,
      discount: Number,
    },
    refundedAt: Date,
    refundReason: String,
  },
  { timestamps: true }
);

paymentSchema.index({ student: 1, createdAt: -1 });
paymentSchema.index({ instructor: 1 });
paymentSchema.index({ stripeSessionId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
