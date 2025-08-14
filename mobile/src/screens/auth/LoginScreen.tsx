import React, { useState } from 'react';
import { Button, Center, Heading, Input, VStack, Link, Box } from 'native-base';
import { useAuth } from '../../providers/AuthProvider';

export default function LoginScreen({ navigation }: any) {
	const { login } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	async function onSubmit() {
		try {
			setLoading(true);
			await login(email, password);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Center flex={1} p={6}>
			<VStack space={4} w="100%" maxW="320">
				<Heading>Welcome</Heading>
				<Input placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
				<Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
				<Button onPress={onSubmit} isLoading={loading}>Login</Button>
				<Box>
					<Link onPress={() => navigation.navigate('Register')}>Create an account</Link>
				</Box>
			</VStack>
		</Center>
	);
}