const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authRequired } = require('../middleware/auth');
const config = require('../config');

const router = express.Router();

router.post('/register', async (req, res) => {
	try {
		const { name, email, password, role, companyName, phone } = req.body;
		if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
		const exists = await User.findOne({ email });
		if (exists) return res.status(400).json({ message: 'Email already used' });
		const passwordHash = await User.hashPassword(password);
		const user = await User.create({ name, email, passwordHash, role: role === 'company' ? 'company' : 'user', companyName, phone });
		const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '7d' });
		res.json({ token, user });
	} catch (e) {
		res.status(500).json({ message: 'Registration failed' });
	}
});

router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) return res.status(400).json({ message: 'Invalid credentials' });
		const ok = await user.verifyPassword(password);
		if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
		const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '7d' });
		res.json({ token, user });
	} catch (e) {
		res.status(500).json({ message: 'Login failed' });
	}
});

router.get('/me', authRequired, (req, res) => res.json({ user: req.user }));

module.exports = router;