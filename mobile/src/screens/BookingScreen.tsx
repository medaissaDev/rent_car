import React, { useState } from 'react';
import { Button, Center, Heading, Input, Radio, VStack } from 'native-base';
import axios from 'axios';
import * as Linking from 'expo-linking';

export default function BookingScreen({ route, navigation }: any) {
	const { car } = route.params;
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
	const [loading, setLoading] = useState(false);

	async function onSubmit() {
		try {
			setLoading(true);
			const totalPriceTnd = car.pricePerDayTnd; // simplified
			const { data } = await axios.post('/api/bookings', { carId: car._id, startDate, endDate, totalPriceTnd, paymentMethod });
			if (paymentMethod === 'card') {
				const { data: pay } = await axios.post('/api/payments/paymee/create', { bookingId: data.booking._id });
				if (pay.checkoutUrl) await Linking.openURL(pay.checkoutUrl);
			}
			navigation.navigate('Home');
		} finally {
			setLoading(false);
		}
	}

	return (
		<Center flex={1} p={6}>
			<VStack space={3} w="100%" maxW="340">
				<Heading>Book {car.brand} {car.model}</Heading>
				<Input placeholder="Start date (YYYY-MM-DD)" value={startDate} onChangeText={setStartDate} />
				<Input placeholder="End date (YYYY-MM-DD)" value={endDate} onChangeText={setEndDate} />
				<Radio.Group name="paymentMethod" value={paymentMethod} onChange={(v) => setPaymentMethod(v as any)}>
					<Radio value="cash">Cash</Radio>
					<Radio value="card">Card (Paymee)</Radio>
				</Radio.Group>
				<Button onPress={onSubmit} isLoading={loading}>Confirm booking</Button>
			</VStack>
		</Center>
	);
}