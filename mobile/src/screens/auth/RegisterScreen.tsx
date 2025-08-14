import React, { useState } from 'react';
import { Button, Center, Heading, Input, VStack, Select, CheckIcon } from 'native-base';
import { useAuth } from '../../providers/AuthProvider';

export default function RegisterScreen({ navigation }: any) {
	const { register } = useAuth();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState<'user' | 'company'>('user');
	const [companyName, setCompanyName] = useState('');
	const [loading, setLoading] = useState(false);

	async function onSubmit() {
		try {
			setLoading(true);
			await register({ name, email, password, role, companyName: role === 'company' ? companyName : undefined });
		} finally {
			setLoading(false);
		}
	}

	return (
		<Center flex={1} p={6}>
			<VStack space={4} w="100%" maxW="320">
				<Heading>Create account</Heading>
				<Input placeholder="Full name" value={name} onChangeText={setName} />
				<Input placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
				<Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
				<Select selectedValue={role} onValueChange={(v) => setRole(v as any)} _selectedItem={{ bg: 'teal.600', endIcon: <CheckIcon size={5} /> }}>
					<Select.Item label="User" value="user" />
					<Select.Item label="Company" value="company" />
				</Select>
				{role === 'company' && (
					<Input placeholder="Company name" value={companyName} onChangeText={setCompanyName} />
				)}
				<Button onPress={onSubmit} isLoading={loading}>Register</Button>
			</VStack>
		</Center>
	);
}