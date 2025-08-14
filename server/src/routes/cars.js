const express = require('express');
const multer = require('multer');
const path = require('path');
const Car = require('../models/Car');
const { authRequired, requireRole } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, path.join(__dirname, '..', '..', 'uploads')),
	filename: (req, file, cb) => {
		const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
		const ext = path.extname(file.originalname);
		cb(null, unique + ext);
	}
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
	const { q, minPrice, maxPrice, location, requiresCaution } = req.query;
	const filter = { isAvailable: true };
	if (q) filter.$or = [{ brand: new RegExp(q, 'i') }, { model: new RegExp(q, 'i') }, { location: new RegExp(q, 'i') }];
	if (location) filter.location = new RegExp(location, 'i');
	if (requiresCaution === 'true') filter.requiresCaution = true;
	if (requiresCaution === 'false') filter.requiresCaution = false;
	if (minPrice || maxPrice) {
		filter.pricePerDayTnd = {};
		if (minPrice) filter.pricePerDayTnd.$gte = Number(minPrice);
		if (maxPrice) filter.pricePerDayTnd.$lte = Number(maxPrice);
	}
	const cars = await Car.find(filter).sort({ createdAt: -1 }).limit(100);
	res.json({ cars });
});

router.post('/', authRequired, requireRole('company'), upload.array('images', 6), async (req, res) => {
	try {
		const { brand, model, year, location, pricePerDayTnd, requiresCaution, cautionAmountTnd, description } = req.body;
		const images = (req.files || []).map(f => `/uploads/${f.filename}`);
		const car = await Car.create({
			owner: req.user._id,
			brand,
			model,
			year: Number(year),
			location,
			pricePerDayTnd: Number(pricePerDayTnd),
			requiresCaution: String(requiresCaution) === 'true',
			cautionAmountTnd: Number(cautionAmountTnd) || 0,
			description,
			images
		});
		res.status(201).json({ car });
	} catch (e) {
		res.status(400).json({ message: 'Failed to create car' });
	}
});

router.get('/mine/list', authRequired, requireRole('company'), async (req, res) => {
	const cars = await Car.find({ owner: req.user._id }).sort({ createdAt: -1 });
	res.json({ cars });
});

router.get('/:id', async (req, res) => {
	const car = await Car.findById(req.params.id).populate('owner', 'name companyName phone');
	if (!car) return res.status(404).json({ message: 'Not found' });
	res.json({ car });
});

module.exports = router;