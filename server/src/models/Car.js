const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema(
	{
		owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
		brand: { type: String, required: true },
		model: { type: String, required: true },
		year: { type: Number, required: true },
		location: { type: String, required: true },
		pricePerDayTnd: { type: Number, required: true },
		requiresCaution: { type: Boolean, default: false },
		cautionAmountTnd: { type: Number, default: 0 },
		description: { type: String },
		images: [{ type: String }],
		isAvailable: { type: Boolean, default: true }
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Car', CarSchema);