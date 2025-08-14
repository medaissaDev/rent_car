import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, FlatList, HStack, Input, Text, VStack } from 'native-base';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { SOCKET_IO_URL } from '../../utils/config';
import { useAuth } from '../../providers/AuthProvider';

export default function ChatScreen({ route }: any) {
	const { conversationId } = route.params;
	const { user } = useAuth();
	const [messages, setMessages] = useState<any[]>([]);
	const [text, setText] = useState('');
	const socketRef = useRef<Socket | null>(null);

	useEffect(() => {
		(async () => {
			const { data } = await axios.get(`/api/messages/${conversationId}`);
			setMessages(data.messages);
		})();
	}, [conversationId]);

	useEffect(() => {
		const s = io(SOCKET_IO_URL, { query: { userId: user?._id } });
		socketRef.current = s;
		s.emit('chat:join', conversationId);
		s.on('chat:message', (msg: any) => {
			if (msg.conversation === conversationId) setMessages((prev) => [...prev, msg]);
		});
		return () => { s.disconnect(); };
	}, [conversationId, user?._id]);

	async function send() {
		if (!text.trim()) return;
		await axios.post(`/api/messages/${conversationId}`, { content: text });
		setText('');
	}

	return (
		<VStack flex={1} p={4}>
			<FlatList flex={1} data={messages} keyExtractor={(i) => i._id} renderItem={({ item }) => (
				<Box p={2} my={1} bg={item.sender === user?._id ? 'teal.100' : 'coolGray.100'} borderRadius="md" alignSelf={item.sender === user?._id ? 'flex-end' : 'flex-start'}>
					<Text>{item.content}</Text>
				</Box>
			)} />
			<HStack space={2}>
				<Input flex={1} placeholder="Type a message" value={text} onChangeText={setText} />
				<Button onPress={send}>Send</Button>
			</HStack>
		</VStack>
	);
}