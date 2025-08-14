const express = require('express');
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.post('/', authRequired, async (req, res) => {
	try {
		const { carId, startDate, endDate, totalPriceTnd, paymentMethod } = req.body;
		const car = await Car.findById(carId).populate('owner');
		if (!car) return res.status(404).json({ message: 'Car not found' });
		const booking = await Booking.create({
			car: car._id,
			user: req.user._id,
			company: car.owner._id,
			startDate: new Date(startDate),
			endDate: new Date(endDate),
			totalPriceTnd: Number(totalPriceTnd),
			paymentMethod,
			paymentStatus: paymentMethod === 'cash' ? 'pending' : 'pending'
		});
		res.status(201).json({ booking });
	} catch (e) {
		res.status(400).json({ message: 'Failed to create booking' });
	}
});

router.get('/me', authRequired, async (req, res) => {
	const bookings = await Booking.find({ user: req.user._id }).populate('car');
	res.json({ bookings });
});

router.get('/company', authRequired, async (req, res) => {
	const bookings = await Booking.find({ company: req.user._id }).populate('car user');
	res.json({ bookings });
});

module.exports = router;