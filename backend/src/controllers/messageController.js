// src/controllers/messageController.js
const Message = require('../models/Message');
const Listing = require('../models/Listing');
const User = require('../models/User');

class MessageController {
  async sendMessage(req, res) {
    try {
      const { recipientId, listingId, content } = req.body;

      // Validate recipient and listing
      const recipient = await User.findById(recipientId);
      if (!recipient) return res.status(404).json({ message: 'Recipient user not found' });

      const listing = await Listing.findById(listingId);
      if (!listing) return res.status(404).json({ message: 'Listing not found' });

      const message = new Message({
        sender: req.user._id,
        recipient: recipientId,
        listing: listingId,
        content
      });

      await message.save();

      res.status(201).json({ message: 'Message sent successfully', data: message });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }

  async getConversation(req, res) {
    try {
      const { userId } = req.params;

      // Fetch all messages between req.user and userId
      const messages = await Message.find({
        $or: [
          { sender: req.user._id, recipient: userId },
          { sender: userId, recipient: req.user._id }
        ]
      }).sort({ createdAt: 1 });

      res.json({ messages });
    } catch (error) {
      console.error('Error fetching conversation:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }
}

module.exports = new MessageController();
