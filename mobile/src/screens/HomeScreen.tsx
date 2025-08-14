import React, { useEffect, useState } from 'react';
import { Box, Button, FlatList, HStack, Heading, Image, Input, Switch, Text, VStack } from 'native-base';
import axios from 'axios';
import { useAuth } from '../providers/AuthProvider';
import { API_BASE_URL } from '../utils/config';

interface Car {
	_id: string;
	brand: string;
	model: string;
	year: number;
	location: string;
	pricePerDayTnd: number;
	requiresCaution: boolean;
	cautionAmountTnd: number;
	images: string[];
	owner: { _id: string; name: string; companyName?: string };
}

export default function HomeScreen({ navigation }: any) {
	const { user } = useAuth();
	const [cars, setCars] = useState<Car[]>([]);
	const [q, setQ] = useState('');
	const [location, setLocation] = useState('');
	const [minPrice, setMinPrice] = useState('');
	const [maxPrice, setMaxPrice] = useState('');
	const [requiresCaution, setRequiresCaution] = useState<boolean | null>(null);

	function toImageUrl(path: string) {
		if (!path) return path;
		if (path.startsWith('http')) return path;
		return `${API_BASE_URL}${path}`;
	}

	async function fetchCars() {
		const { data } = await axios.get('/api/cars', { params: { q, location, minPrice, maxPrice, requiresCaution: requiresCaution === null ? undefined : String(requiresCaution) } });
		setCars(data.cars);
	}

	useEffect(() => {
		fetchCars();
	}, []);

	return (
		<VStack flex={1} p={4} space={3}>
			<HStack space={2}>
				<Input flex={1} placeholder="Search brand, model" value={q} onChangeText={setQ} />
				<Button onPress={fetchCars}>Search</Button>
			</HStack>
			<HStack space={2}>
				<Input flex={1} placeholder="Location" value={location} onChangeText={setLocation} />
				<Input w="120" placeholder="Min" keyboardType="numeric" value={minPrice} onChangeText={setMinPrice} />
				<Input w="120" placeholder="Max" keyboardType="numeric" value={maxPrice} onChangeText={setMaxPrice} />
			</HStack>
			<HStack alignItems="center" space={2}>
				<Text>Requires caution</Text>
				<Switch isChecked={requiresCaution === true} onToggle={() => setRequiresCaution(requiresCaution === true ? null : true)} />
				<Button size="sm" onPress={fetchCars}>Apply</Button>
			</HStack>
			{user?.role === 'company' && (
				<Button onPress={() => navigation.navigate('AddCar')}>Add a car</Button>
			)}
			<FlatList data={cars} keyExtractor={(item) => item._id} renderItem={({ item }) => (
				<Box borderWidth={1} borderColor="coolGray.200" p={3} mb={3} borderRadius="md">
					<HStack space={3}>
						{item.images?.[0] && (
							<Image alt="car" source={{ uri: toImageUrl(item.images[0]) }} size="xl" borderRadius="md" />
						)}
						<VStack flex={1}>
							<Heading size="md">{item.brand} {item.model} · {item.year}</Heading>
							<Text>{item.location}</Text>
							<Text bold>{item.pricePerDayTnd} TND/day</Text>
							{item.requiresCaution && (
								<Text color="amber.600">Caution: {item.cautionAmountTnd} TND</Text>
							)}
							<HStack space={2} mt={2}>
								<Button size="sm" onPress={() => navigation.navigate('CarDetails', { id: item._id })}>Details</Button>
								<Button size="sm" colorScheme="teal" onPress={() => navigation.navigate('Booking', { car: item })}>Rent</Button>
							</HStack>
						</VStack>
					</HStack>
				</Box>
			)} />
		</VStack>
	);
}