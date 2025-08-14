const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
	{
		car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		startDate: { type: Date, required: true },
		endDate: { type: Date, required: true },
		totalPriceTnd: { type: Number, required: true },
		paymentMethod: { type: String, enum: ['cash', 'card'], required: true },
		paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'cancelled'], default: 'pending' },
		paymeeOrderId: { type: String },
		status: { type: String, enum: ['requested', 'confirmed', 'completed', 'cancelled'], default: 'requested' }
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Booking', BookingSchema);