const express = require('express');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.get('/:conversationId', authRequired, async (req, res) => {
	const { conversationId } = req.params;
	const messages = await Message.find({ conversation: conversationId }).sort({ createdAt: 1 }).limit(200);
	res.json({ messages });
});

router.post('/:conversationId', authRequired, async (req, res) => {
	const { conversationId } = req.params;
	const { content } = req.body;
	const convo = await Conversation.findById(conversationId);
	if (!convo) return res.status(404).json({ message: 'Conversation not found' });
	const message = await Message.create({ conversation: convo._id, sender: req.user._id, content });
	convo.lastMessageAt = new Date();
	await convo.save();
	res.status(201).json({ message });
});

module.exports = router;