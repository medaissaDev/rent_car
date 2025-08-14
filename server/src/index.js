const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config');
const { setupRealtime } = require('./realtime');

async function start() {
	try {
		await mongoose.connect(config.mongoUri);
		const server = http.createServer(app);
		setupRealtime(server);
		server.listen(config.port, () => console.log(`API http://localhost:${config.port}`));
	} catch (e) {
		console.error('Failed to start server', e);
		process.exit(1);
	}
}

start();