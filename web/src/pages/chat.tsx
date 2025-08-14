import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Container, Heading, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_IO_URL, API_BASE_URL } from '../lib/config';
import axios from 'axios';

export default function ChatPage() {
	const [conversationId, setConversationId] = useState<string | null>(null);
	const [companyId, setCompanyId] = useState<string | null>(null);
	const [messages, setMessages] = useState<any[]>([]);
	const [text, setText] = useState('');
	const socketRef = useRef<Socket | null>(null);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const company = params.get('company');
		setCompanyId(company);
		(async () => {
			if (company) {
				const { data } = await axios.post(`${API_BASE_URL}/api/conversations`, { participantId: company });
				setConversationId(data.conversation._id);
			}
		})();
	}, []);

	useEffect(() => {
		if (!conversationId) return;
		(async () => {
			const { data } = await axios.get(`${API_BASE_URL}/api/messages/${conversationId}`);
			setMessages(data.messages);
		})();
		const s = io(SOCKET_IO_URL);
		socketRef.current = s;
		s.emit('chat:join', conversationId);
		s.on('chat:message', (msg: any) => {
			if (msg.conversation === conversationId) setMessages((prev) => [...prev, msg]);
		});
		return () => { s.disconnect(); };
	}, [conversationId]);

	async function send() {
		if (!text.trim() || !conversationId) return;
		await axios.post(`${API_BASE_URL}/api/messages/${conversationId}`, { content: text });
		setText('');
	}

	return (
		<Container maxW="3xl" py={6}>
			<Heading size="md" mb={4}>Chat</Heading>
			<VStack borderWidth={1} borderRadius="md" p={3} align="stretch" bg="white">
				<Box maxH="50vh" overflowY="auto" p={2}>
					{messages.map((m) => (
						<Box key={m._id} my={1} p={2} bg="gray.100" borderRadius="md">
							<Text>{m.content}</Text>
						</Box>
					))}
				</Box>
				<HStack>
					<Input placeholder="Type a message" value={text} onChange={(e) => setText(e.target.value)} />
					<Button onClick={send} colorScheme="teal">Send</Button>
				</HStack>
			</VStack>
		</Container>
	);
}