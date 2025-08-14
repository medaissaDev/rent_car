const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

module.exports = {
	port: process.env.PORT || 4000,
	mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental',
	jwtSecret: process.env.JWT_SECRET || 'change_me',
	clientUrl: process.env.CLIENT_URL || 'http://localhost:19006',
	mqttUrl: process.env.MQTT_URL || 'mqtt://localhost:1883',
	mqttWsUrl: process.env.MQTT_WS_URL || 'ws://localhost:9001',
	serverPublicUrl: process.env.SERVER_PUBLIC_URL || 'http://localhost:4000',
	paymee: {
		baseUrl: process.env.PAYMEE_BASE_URL || 'https://sandbox.paymee.tn/api/v2',
		apiKey: process.env.PAYMEE_API_KEY || '',
		merchantId: process.env.PAYMEE_MERCHANT_ID || '',
		returnUrl: process.env.PAYMEE_RETURN_URL || '',
		webhookSecret: process.env.PAYMEE_WEBHOOK_SECRET || ''
	}
};