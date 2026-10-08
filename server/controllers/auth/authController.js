const crypto = require("crypto");
const User = require("../../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../../utils/generateToken");
const { generateOTP } = require("../../utils/helpers");
const sendEmail = require("../../utils/sendEmail");
const AppError = require("../../utils/AppError");
const { uploadToCloudinary } = require("../../middleware/upload");

const sendTokenResponse = (user, statusCode, res) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res
    .status(statusCode)
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
      accessToken,
    });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("Email already registered", 400));
    }

    const user = await User.create({ name, email, password, role });

    const verifyToken = user.createVerificationToken();
    await user.save({ validateBeforeSave: false });

    const verificationUrl = `${process.env.CLIENT_URL}/auth/verify-email/${verifyToken}`;

    let emailSent = false;
    try {
      await sendEmail({
        email: user.email,
        subject: "Verify your email address",
        html: `<h1>Welcome to E-Learning Platform!</h1>
               <p>Please click the link below to verify your email:</p>
               <a href="${verificationUrl}">${verificationUrl}</a>
               <p>This link expires in 24 hours.</p>`,
      });
      emailSent = true;
    } catch (err) {
      console.error("Verification email failed:", err.message);
    }

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
      accessToken: generateAccessToken(user._id),
      emailSent,
      message: emailSent
        ? "Registration successful. Please verify your email."
        : "Registration successful. Verification email could not be sent. Please try resending later.",
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new AppError("Invalid credentials", 401));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new AppError("Invalid credentials", 401));
    }

    if (!user.isActive) {
      return next(new AppError("Account deactivated. Contact support.", 401));
    }

    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res) => {
  res
    .status(200)
    .cookie("accessToken", "none", {
      httpOnly: true,
      expires: new Date(Date.now() + 5 * 1000),
    })
    .cookie("refreshToken", "none", {
      httpOnly: true,
      expires: new Date(Date.now() + 5 * 1000),
    })
    .json({ success: true, message: "Logged out successfully" });
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("enrolledCourses", "title slug thumbnail price")
      .populate("wishlist", "title slug thumbnail price instructor")
      .select("-refreshToken");

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      "name",
      "bio",
      "headline",
      "socialLinks",
      "skills",
      "interests",
      "preferences",
    ];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (req.files?.avatar) {
      const file = req.files.avatar[0];
      const result = await uploadToCloudinary(file.buffer, {
        folder: "e-learning/avatars",
        transformation: [{ width: 300, height: 300, crop: "fill" }],
      });
      updates.avatar = { url: result.secure_url, publicId: result.public_id };
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password -refreshToken");

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError("No user found with that email", 404));
    }

    const resetToken = user.createResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request",
        html: `<h1>Reset Your Password</h1>
               <p>Click the link below to reset your password:</p>
               <a href="${resetUrl}">${resetUrl}</a>
               <p>This link expires in 10 minutes.</p>
               <p>If you didn't request this, please ignore this email.</p>`,
      });

      res.status(200).json({ success: true, message: "Email sent" });
    } catch (err) {
      console.error("Password reset email failed:", err.message);
      return next(
        new AppError(
          "Password reset email could not be sent. Please try again later.",
          503,
        ),
      );
    }
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError("Invalid or expired token", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError("Invalid or expired token", 400));
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
};

exports.resendVerificationEmail = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return next(new AppError("User not found", 404));

    if (user.isVerified) {
      return res
        .status(200)
        .json({ success: true, message: "Email is already verified" });
    }

    const verifyToken = user.createVerificationToken();
    await user.save({ validateBeforeSave: false });

    const verificationUrl = `${process.env.CLIENT_URL}/auth/verify-email/${verifyToken}`;

    let emailSent = false;
    try {
      await sendEmail({
        email: user.email,
        subject: "Verify your email address",
        html: `<h1>Welcome to E-Learning Platform!</h1>
               <p>Please click the link below to verify your email:</p>
               <a href="${verificationUrl}">${verificationUrl}</a>
               <p>This link expires in 24 hours.</p>`,
      });
      emailSent = true;
    } catch (err) {
      console.error("Verification email failed:", err.message);
    }

    res.status(200).json({
      success: true,
      emailSent,
      message: emailSent
        ? "Verification email sent successfully."
        : "Verification email could not be sent. Please try again later.",
    });
  } catch (error) {
    next(error);
  }
};

exports.sendOTP = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return next(new AppError("User not found", 404));

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      email: user.email,
      subject: "Your OTP Code",
      html: `<h1>OTP Verification</h1>
             <p>Your OTP code is: <strong>${otp}</strong></p>
             <p>This code expires in 10 minutes.</p>`,
    });

    res.status(200).json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    next(error);
  }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return next(new AppError("User not found", 404));

    if (user.otp !== req.body.otp || user.otpExpire < Date.now()) {
      return next(new AppError("Invalid or expired OTP", 400));
    }

    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return next(new AppError("No refresh token", 401));
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError("User not found", 401));
    }

    if (!user.isActive) {
      return next(new AppError("Account deactivated. Contact support.", 401));
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return next(new AppError("Current password is incorrect", 400));
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};
