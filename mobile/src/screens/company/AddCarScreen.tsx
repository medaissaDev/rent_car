import React, { useState } from 'react';
import { Button, Center, Heading, Input, Switch, Text, VStack } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Platform } from 'react-native';

export default function AddCarScreen({ navigation }: any) {
	const [brand, setBrand] = useState('');
	const [model, setModel] = useState('');
	const [year, setYear] = useState('2020');
	const [location, setLocation] = useState('');
	const [pricePerDayTnd, setPricePerDayTnd] = useState('');
	const [requiresCaution, setRequiresCaution] = useState(false);
	const [cautionAmountTnd, setCautionAmountTnd] = useState('');
	const [images, setImages] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	async function pickImage() {
		const res = await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: true, mediaTypes: ImagePicker.MediaTypeOptions.Images });
		if (!res.canceled) {
			// @ts-ignore
			const selected = res.assets || [];
			setImages([...images, ...selected]);
		}
	}

	async function onSubmit() {
		const form = new FormData();
		form.append('brand', brand);
		form.append('model', model);
		form.append('year', year);
		form.append('location', location);
		form.append('pricePerDayTnd', pricePerDayTnd);
		form.append('requiresCaution', String(requiresCaution));
		form.append('cautionAmountTnd', cautionAmountTnd || '0');
		if (Platform.OS === 'web') {
			for (let i = 0; i < images.length; i++) {
				const img: any = images[i];
				const resp = await fetch(img.uri);
				const blob = await resp.blob();
				(form as any).append('images', blob, `image_${i}.jpg`);
			}
		} else {
			images.forEach((img: any, idx) => {
				form.append('images', { uri: img.uri, name: `image_${idx}.jpg`, type: 'image/jpeg' } as any);
			});
		}
		try {
			setLoading(true);
			await axios.post('/api/cars', form, { headers: { 'Content-Type': 'multipart/form-data' } });
			navigation.goBack();
		} finally {
			setLoading(false);
		}
	}

	return (
		<Center flex={1} p={6}>
			<VStack space={3} w="100%" maxW="340">
				<Heading>Add a car</Heading>
				<Input placeholder="Brand" value={brand} onChangeText={setBrand} />
				<Input placeholder="Model" value={model} onChangeText={setModel} />
				<Input placeholder="Year" keyboardType="numeric" value={year} onChangeText={setYear} />
				<Input placeholder="Location" value={location} onChangeText={setLocation} />
				<Input placeholder="Price per day (TND)" keyboardType="numeric" value={pricePerDayTnd} onChangeText={setPricePerDayTnd} />
				<VStack>
					<Text>Requires caution</Text>
					<Switch isChecked={requiresCaution} onToggle={() => setRequiresCaution(!requiresCaution)} />
				</VStack>
				{requiresCaution && (
					<Input placeholder="Caution amount (TND)" keyboardType="numeric" value={cautionAmountTnd} onChangeText={setCautionAmountTnd} />
				)}
				<Button onPress={pickImage}>Pick images</Button>
				<Button onPress={onSubmit} isLoading={loading} colorScheme="teal">Create</Button>
			</VStack>
		</Center>
	);
}