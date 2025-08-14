const express = require('express');
const axios = require('axios');
const Booking = require('../models/Booking');
const config = require('../config');

const router = express.Router();

router.post('/paymee/create', async (req, res) => {
	try {
		const { bookingId } = req.body;
		const booking = await Booking.findById(bookingId);
		if (!booking) return res.status(404).json({ message: 'Booking not found' });
		if (booking.paymentMethod !== 'card') return res.status(400).json({ message: 'Not a card booking' });
		const payload = {
			amount: booking.totalPriceTnd,
			note: `Booking ${booking._id}`,
			return_url: config.paymee.returnUrl,
			webhook: `${config.serverPublicUrl}/api/payments/paymee/webhook`,
			order_id: String(booking._id)
		};
		const headers = { 'Content-Type': 'application/json', 'Authorization': `Token ${config.paymee.apiKey}` };
		const { data } = await axios.post(`${config.paymee.baseUrl}/payments/create`, payload, { headers });
		booking.paymeeOrderId = data.data?.token || data.data?.id || '';
		await booking.save();
		res.json({ checkoutUrl: data.data?.link || data.checkout_url || data.data?.url, providerData: data });
	} catch (e) {
		res.status(400).json({ message: 'Failed to create payment' });
	}
});

router.post('/paymee/webhook', async (req, res) => {
	try {
		const event = req.body;
		const orderId = event?.order_id || event?.data?.order_id;
		if (!orderId) return res.status(400).end();
		const booking = await Booking.findById(orderId);
		if (!booking) return res.status(404).end();
		if (event?.data?.status === 1 || event?.status === 'PAID') {
			booking.paymentStatus = 'paid';
			booking.status = 'confirmed';
			await booking.save();
		}
		if (event?.data?.status === 0 || event?.status === 'FAILED') {
			booking.paymentStatus = 'failed';
			await booking.save();
		}
		res.status(200).end();
	} catch (e) {
		res.status(200).end();
	}
});

module.exports = router;