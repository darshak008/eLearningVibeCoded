const express = require('express');
const router = express.Router();
const {
  getConversations,
  getMessages,
  sendMessage,
} = require('../controllers/messages/messageController');
const { protect } = require('../middleware/auth');

router.get('/conversations', protect, getConversations);
router.get('/:userId', protect, getMessages);
router.post('/', protect, sendMessage);

module.exports = router;
