const { Server } = require('socket.io');
const mqtt = require('mqtt');
const config = require('./config');

let io;
let mqttClient;

function setupRealtime(httpServer) {
	io = new Server(httpServer, { cors: { origin: true, methods: ['GET','POST'] } });
	mqttClient = mqtt.connect(config.mqttUrl);
	mqttClient.on('connect', () => {
		mqttClient.subscribe('chat/+');
	});
	mqttClient.on('message', (topic, message) => {
		try {
			const [, conversationId] = topic.split('/');
			const payload = JSON.parse(message.toString());
			io.to(`chat:${conversationId}`).emit('chat:message', payload);
		} catch {}
	});
	io.on('connection', (socket) => {
		const { userId } = socket.handshake.query;
		if (userId) socket.join(`user:${userId}`);
		socket.on('chat:join', (conversationId) => socket.join(`chat:${conversationId}`));
	});
}

function emitChatMessage(conversationId, payload) {
	try {
		if (mqttClient && mqttClient.connected) mqttClient.publish(`chat/${conversationId}`, JSON.stringify(payload));
		else if (io) io.to(`chat:${conversationId}`).emit('chat:message', payload);
	} catch {}
}

module.exports = { setupRealtime, emitChatMessage };