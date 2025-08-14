const express = require('express');
const Conversation = require('../models/Conversation');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.post('/', authRequired, async (req, res) => {
	const { participantId } = req.body;
	if (!participantId) return res.status(400).json({ message: 'participantId required' });
	let convo = await Conversation.findOne({ participants: { $all: [req.user._id, participantId] } });
	if (!convo) {
		convo = await Conversation.create({ participants: [req.user._id, participantId], lastMessageAt: new Date() });
	}
	res.json({ conversation: convo });
});

router.get('/', authRequired, async (req, res) => {
	const convos = await Conversation.find({ participants: req.user._id }).sort({ updatedAt: -1 });
	res.json({ conversations: convos });
});

module.exports = router;