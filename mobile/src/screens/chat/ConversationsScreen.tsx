import React, { useEffect, useState } from 'react';
import { Button, FlatList, HStack, Heading, VStack } from 'native-base';
import axios from 'axios';

export default function ConversationsScreen({ route, navigation }: any) {
	const [conversations, setConversations] = useState<any[]>([]);
	const companyId = route.params?.companyId;

	async function load() {
		const { data } = await axios.get('/api/conversations');
		setConversations(data.conversations);
	}

	useEffect(() => { load(); }, []);

	async function contactCompany() {
		if (!companyId) return;
		const { data } = await axios.post('/api/conversations', { participantId: companyId });
		navigation.navigate('Chat', { conversationId: data.conversation._id });
	}

	return (
		<VStack flex={1} p={4} space={3}>
			<Heading>Conversations</Heading>
			{companyId && <Button onPress={contactCompany}>Message this company</Button>}
			<FlatList data={conversations} keyExtractor={(i) => i._id} renderItem={({ item }) => (
				<HStack justifyContent="space-between" p={3} borderBottomWidth={1} onTouchEnd={() => navigation.navigate('Chat', { conversationId: item._id })}>
					<Heading size="sm">{item._id}</Heading>
				</HStack>
			)} />
		</VStack>
	);
}