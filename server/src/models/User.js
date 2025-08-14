const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true, index: true },
		passwordHash: { type: String, required: true },
		role: { type: String, enum: ['user', 'company'], default: 'user' },
		companyName: { type: String },
		phone: { type: String },
		avatarUrl: { type: String }
	},
	{ timestamps: true }
);

UserSchema.methods.verifyPassword = async function (password) {
	return bcrypt.compare(password, this.passwordHash);
};

UserSchema.statics.hashPassword = async function (password) {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(password, salt);
};

module.exports = mongoose.model('User', UserSchema);