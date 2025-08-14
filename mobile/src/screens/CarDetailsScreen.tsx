import React, { useEffect, useState } from 'react';
import { Button, Heading, HStack, Image, Text, VStack } from 'native-base';
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

export default function CarDetailsScreen({ route, navigation }: any) {
	const { id } = route.params;
	const [car, setCar] = useState<any>(null);

	function toImageUrl(path: string) {
		if (!path) return path;
		if (path.startsWith('http')) return path;
		return `${API_BASE_URL}${path}`;
	}

	useEffect(() => {
		(async () => {
			const { data } = await axios.get(`/api/cars/${id}`);
			setCar(data.car);
		})();
	}, [id]);

	if (!car) return null;

	return (
		<VStack flex={1} p={4} space={3}>
			{car.images?.[0] && <Image alt="car" source={{ uri: toImageUrl(car.images[0]) }} height={200} borderRadius="md" />}
			<Heading>{car.brand} {car.model} · {car.year}</Heading>
			<Text>{car.location}</Text>
			<Text>{car.description}</Text>
			<Text bold>{car.pricePerDayTnd} TND/day</Text>
			{car.requiresCaution && (
				<Text color="amber.600">Caution required: {car.cautionAmountTnd} TND</Text>
			)}
			<HStack space={2}>
				<Button onPress={() => navigation.navigate('Booking', { car })}>Rent</Button>
				<Button colorScheme="secondary" onPress={() => navigation.navigate('Conversations', { companyId: car.owner?._id })}>Contact company</Button>
			</HStack>
		</VStack>
	);
}