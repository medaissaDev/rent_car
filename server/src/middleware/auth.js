const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

async function authRequired(req, res, next) {
	try {
		const header = req.headers.authorization || '';
		const token = header.startsWith('Bearer ') ? header.slice(7) : null;
		if (!token) return res.status(401).json({ message: 'Unauthorized' });
		const payload = jwt.verify(token, config.jwtSecret);
		const user = await User.findById(payload.userId);
		if (!user) return res.status(401).json({ message: 'Unauthorized' });
		req.user = user;
		next();
	} catch (e) {
		return res.status(401).json({ message: 'Unauthorized' });
	}
}

function requireRole(role) {
	return (req, res, next) => {
		if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
		if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
		next();
	};
}

module.exports = { authRequired, requireRole };