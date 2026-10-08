const Message = require('../../models/Message');
const AppError = require('../../utils/AppError');

exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: req.user._id }, { receiver: req.user._id }],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: null,
          users: {
            $addToSet: {
              $cond: [
                { $eq: ['$sender', req.user._id] },
                '$receiver',
                '$sender',
              ],
            },
          },
          lastMessage: { $first: '$$ROOT' },
        },
      },
      { $unwind: '$users' },
      { $sort: { 'lastMessage.createdAt': -1 } },
    ]);

    const userIds = conversations.map((c) => c.users);
    const users = await User.find({ _id: { $in: userIds } })
      .select('name avatar role');

    const result = conversations.map((conv) => ({
      user: users.find((u) => u._id.toString() === conv.users.toString()),
      lastMessage: conv.lastMessage,
    }));

    res.status(200).json({ success: true, conversations: result });
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id },
      ],
    })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    await Message.updateMany(
      { sender: req.params.userId, receiver: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.status(200).json({
      success: true,
      messages: messages.reverse(),
    });
  } catch (error) {
    next(error);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const message = await Message.create({
      ...req.body,
      sender: req.user._id,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar');

    res.status(201).json({ success: true, message: populatedMessage });
  } catch (error) {
    next(error);
  }
};
