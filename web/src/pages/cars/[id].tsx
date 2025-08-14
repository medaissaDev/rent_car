import { GetServerSideProps } from 'next';
import Head from 'next/head';
import axios from 'axios';
import { API_BASE_URL, toImageUrl } from '../../lib/config';
import { Box, Button, Container, Heading, Image, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';

export default function CarDetails({ car }: { car: any }) {
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: `${car.brand} ${car.model} ${car.year}`,
		image: car.images?.map((i: string) => toImageUrl(i)) || [],
		description: car.description || '',
		brand: car.brand,
		offers: { '@type': 'Offer', priceCurrency: 'TND', price: car.pricePerDayTnd, availability: 'https://schema.org/InStock' }
	};
	return (
		<>
			<Head>
				<title>{car.brand} {car.model} · {car.year} | Rent in Tunisia</title>
				<meta name="description" content={car.description?.slice(0, 150) || `${car.brand} ${car.model} available for rent in ${car.location}.`} />
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			</Head>
			<Container maxW="5xl" py={8}>
				{car.images?.[0] && <Image alt="car" src={toImageUrl(car.images[0])} w="100%" h="360px" objectFit="cover" borderRadius="md" />}
				<Heading mt={4}>{car.brand} {car.model} · {car.year}</Heading>
				<Text color="gray.600">{car.location}</Text>
				<Text mt={2}>{car.description}</Text>
				<Text mt={2} fontWeight="bold">{car.pricePerDayTnd} TND/day</Text>
				{car.requiresCaution && <Text color="orange.500">Caution required: {car.cautionAmountTnd} TND</Text>}
				<Stack direction="row" mt={4}>
					<Button as={Link} href={`/?prefillCar=${car._id}`} colorScheme="teal">Rent</Button>
					<Button as={Link} href={`/chat?company=${car.owner?._id}`} colorScheme="gray">Contact company</Button>
				</Stack>
			</Container>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { id } = ctx.params as { id: string };
	try {
		const { data } = await axios.get(`${API_BASE_URL}/api/cars/${id}`);
		return { props: { car: data.car } };
	} catch (e) {
		return { notFound: true };
	}
};