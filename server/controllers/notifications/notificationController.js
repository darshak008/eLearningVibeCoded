const Notification = require('../../models/Notification');

exports.getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const notifications = await Notification.find({ user: req.user._id })
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });

    const total = await Notification.countDocuments({ user: req.user._id });

    res.status(200).json({
      success: true,
      notifications,
      unreadCount,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.status(200).json({ success: true, notification });
  } catch (error) {
    next(error);
  }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true }
    );
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

exports.createNotification = async (userId, type, title, message, link = '') => {
  try {
    await Notification.create({ user: userId, type, title, message, link });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};
