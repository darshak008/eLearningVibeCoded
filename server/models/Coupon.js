const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    discount: {
      type: Number,
      required: [true, 'Discount is required'],
      min: 1,
      max: 100,
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
    },
    maxUses: { type: Number, default: 100 },
    currentUses: { type: Number, default: 0 },
    minPurchase: { type: Number, default: 0 },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);
